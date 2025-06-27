import { CalendarEvent } from '../components/CalendarView';
import { 
  isAirtableConfigured, 
  loadEventsFromAirtable, 
  saveEventToAirtable,
  syncLocalEventsToAirtable
} from './airtableStorage';

const STORAGE_KEY = 'shopify_calendar_events';

// Storage mode configuration
export type StorageMode = 'localStorage' | 'airtable' | 'hybrid';

const getStorageMode = (): StorageMode => {
  if (isAirtableConfigured()) {
    return process.env.REACT_APP_STORAGE_MODE as StorageMode || 'hybrid';
  }
  return 'localStorage';
};

// Clean up invalid events from localStorage
const cleanupInvalidEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.filter(event => {
    // Check if event has required fields
    if (!event.id || !event.title) {
      return false;
    }
    
    // Check if dates are valid
    const startValid = event.start && !isNaN(event.start.getTime());
    const endValid = event.end && !isNaN(event.end.getTime());
    
    return startValid && endValid;
  });
};

// Local Storage Functions
export const saveEventsToLocalStorage = (events: CalendarEvent[]): void => {
  try {
    const eventsJson = JSON.stringify(events.map(event => {
      // Validate dates before converting to ISO string
      const startDate = event.start && !isNaN(event.start.getTime()) ? event.start.toISOString() : new Date().toISOString();
      const endDate = event.end && !isNaN(event.end.getTime()) ? event.end.toISOString() : new Date().toISOString();
      
      return {
        ...event,
        start: startDate,
        end: endDate
      };
    }));
    localStorage.setItem(STORAGE_KEY, eventsJson);
  } catch (error) {
    console.error('Failed to save events to localStorage:', error);
  }
};

export const loadEventsFromLocalStorage = (): CalendarEvent[] => {
  try {
    const eventsJson = localStorage.getItem(STORAGE_KEY);
    if (!eventsJson) return [];
    
    const events = JSON.parse(eventsJson);
    const parsedEvents = events.map((event: any) => {
      // Validate dates when loading
      const startDate = event.start ? new Date(event.start) : new Date();
      const endDate = event.end ? new Date(event.end) : new Date();
      
      // Check if dates are valid, if not use current date
      const validStart = !isNaN(startDate.getTime()) ? startDate : new Date();
      const validEnd = !isNaN(endDate.getTime()) ? endDate : new Date();
      
      return {
        ...event,
        start: validStart,
        end: validEnd
      };
    });
    
    // Clean up any invalid events
    const cleanEvents = cleanupInvalidEvents(parsedEvents);
    
    // If we removed invalid events, save the cleaned version back
    if (cleanEvents.length !== parsedEvents.length) {
      saveEventsToLocalStorage(cleanEvents);
    }
    
    return cleanEvents;
  } catch (error) {
    console.error('Failed to load events from localStorage:', error);
    return [];
  }
};

export const clearLocalStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Unified Storage Functions (Auto-detects storage mode)
export const loadEvents = async (): Promise<CalendarEvent[]> => {
  const mode = getStorageMode();
  
  try {
    switch (mode) {
      case 'airtable':
        return await loadEventsFromAirtable();
      
      case 'hybrid':
        try {
          const airtableEvents = await loadEventsFromAirtable();
          // Also save to localStorage as backup
          saveEventsToLocalStorage(airtableEvents);
          return airtableEvents;
        } catch (error) {
          console.log('Airtable unavailable, falling back to localStorage');
          return loadEventsFromLocalStorage();
        }
      
      case 'localStorage':
      default:
        return loadEventsFromLocalStorage();
    }
  } catch (error) {
    console.error('Failed to load events:', error);
    return loadEventsFromLocalStorage(); // Fallback
  }
};

export const saveEvents = async (events: CalendarEvent[]): Promise<void> => {
  const mode = getStorageMode();
  
  // Always save to localStorage for fast access
  saveEventsToLocalStorage(events);
  
  if (mode === 'airtable' || mode === 'hybrid') {
    try {
      // For Airtable, we need to sync individual events
      // This is a simplified version - in production you'd want more sophisticated sync
      await syncLocalEventsToAirtable(events);
    } catch (error) {
      console.error('Failed to save to Airtable:', error);
      if (mode === 'airtable') {
        throw error; // Re-throw if Airtable is the primary storage
      }
    }
  }
};

export const saveEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const mode = getStorageMode();
  
  if (mode === 'airtable' || mode === 'hybrid') {
    try {
      return await saveEventToAirtable(event);
    } catch (error) {
      console.error('Failed to save event to Airtable:', error);
             if (mode !== 'airtable') {
        // Fallback to localStorage
        const currentEvents = loadEventsFromLocalStorage();
        const newEvent = { ...event, id: event.id || Date.now().toString() };
        const updatedEvents = [...currentEvents, newEvent];
        saveEventsToLocalStorage(updatedEvents);
        return newEvent;
      }
      throw error;
    }
  } else {
    // localStorage mode
    const currentEvents = loadEventsFromLocalStorage();
    const newEvent = { ...event, id: event.id || Date.now().toString() };
    const updatedEvents = [...currentEvents, newEvent];
    saveEventsToLocalStorage(updatedEvents);
    return newEvent;
  }
};

export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const mode = getStorageMode();
  
  if (mode === 'airtable' || mode === 'hybrid') {
    try {
      // Note: This is simplified - you'd need to track Airtable record IDs
      return await saveEventToAirtable(event);
    } catch (error) {
      console.error('Failed to update event in Airtable:', error);
    }
  }
  
  // Update in localStorage
  const currentEvents = loadEventsFromLocalStorage();
  const updatedEvents = currentEvents.map(e => e.id === event.id ? event : e);
  saveEventsToLocalStorage(updatedEvents);
  return event;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const mode = getStorageMode();
  
  if (mode === 'airtable' || mode === 'hybrid') {
    try {
      // Note: This is simplified - you'd need to track Airtable record IDs
      // await deleteEventFromAirtable(airtableRecordId);
      console.log('Airtable delete not fully implemented yet');
    } catch (error) {
      console.error('Failed to delete event from Airtable:', error);
    }
  }
  
  // Delete from localStorage
  const currentEvents = loadEventsFromLocalStorage();
  const updatedEvents = currentEvents.filter(e => e.id !== eventId);
  saveEventsToLocalStorage(updatedEvents);
};

// Shopify Integration Functions
export const syncWithShopify = async (): Promise<CalendarEvent[]> => {
  // TODO: Implement Shopify API integration
  // Example integrations:
  // - Fetch orders and create order fulfillment events
  // - Get inventory levels and create restock reminders
  // - Sync with marketing campaigns
  
  console.log('Shopify sync not implemented yet');
  return [];
}; 