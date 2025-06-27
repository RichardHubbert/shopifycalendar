import { CalendarEvent } from '../components/CalendarView';

// Airtable Configuration
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID || '';
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY || '';
const AIRTABLE_TABLE_NAME = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Calendar Events';

interface AirtableRecord {
  id: string;
  fields: {
    ID: string;
    Title: string;
    Description?: string;
    StartDate: string;
    EndDate: string;
    Type: 'Order' | 'Inventory' | 'Marketing' | 'Promotion';
    Status: 'Pending' | 'Active' | 'Completed';
    CreatedAt?: string;
    UpdatedAt?: string;
  };
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Helper function to make Airtable API requests
const makeAirtableRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  data?: any
) => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}${endpoint}`;
  
  console.log('🔗 Airtable Request:', {
    method,
    url,
    tableName: AIRTABLE_TABLE_NAME,
    baseId: AIRTABLE_BASE_ID,
    hasApiKey: !!AIRTABLE_API_KEY,
    dataKeys: data ? Object.keys(data) : null
  });

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Airtable API Error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      url
    });
    throw new Error(`Airtable API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log('✅ Airtable Response Success');
  return result;
};

// Convert CalendarEvent to Airtable format
const eventToAirtableFields = (event: CalendarEvent) => ({
  ID: event.id,
  Title: event.title,
  Description: event.description || '',
  StartDate: event.start.toISOString(),
  EndDate: event.end.toISOString(),
  Type: event.type.charAt(0).toUpperCase() + event.type.slice(1),
  Status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
});

// Convert Airtable record to CalendarEvent
const airtableRecordToEvent = (record: AirtableRecord): CalendarEvent => ({
  id: record.fields.ID || '',
  title: record.fields.Title || 'Untitled Event',
  description: record.fields.Description || '',
  start: new Date(record.fields.StartDate || new Date()),
  end: new Date(record.fields.EndDate || new Date()),
  type: (record.fields.Type || 'Order').toLowerCase() as CalendarEvent['type'],
  status: (record.fields.Status || 'Pending').toLowerCase() as CalendarEvent['status'],
});

// Check if Airtable is configured
export const isAirtableConfigured = (): boolean => {
  return !!(AIRTABLE_BASE_ID && AIRTABLE_API_KEY);
};

// Load all events from Airtable
export const loadEventsFromAirtable = async (): Promise<CalendarEvent[]> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured. Please set REACT_APP_AIRTABLE_BASE_ID and REACT_APP_AIRTABLE_API_KEY environment variables.');
  }

  try {
    const response: AirtableResponse = await makeAirtableRequest('?sort[0][field]=StartDate&sort[0][direction]=asc');
    
    // Filter out invalid records and convert valid ones
    const validEvents = response.records
      .filter(record => {
        // Check if record has minimum required fields
        return record.fields && 
               record.fields.ID && 
               record.fields.Title &&
               record.fields.StartDate &&
               record.fields.EndDate;
      })
      .map(airtableRecordToEvent);
    
    return validEvents;
  } catch (error) {
    console.error('Failed to load events from Airtable:', error);
    throw error;
  }
};

// Save a new event to Airtable
export const saveEventToAirtable = async (event: CalendarEvent): Promise<CalendarEvent> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured.');
  }

  try {
    const eventData = {
      fields: eventToAirtableFields(event)
    };

    const response = await makeAirtableRequest('', 'POST', eventData);
    return airtableRecordToEvent(response);
  } catch (error) {
    console.error('Failed to save event to Airtable:', error);
    throw error;
  }
};

// Update an existing event in Airtable
export const updateEventInAirtable = async (event: CalendarEvent, airtableRecordId: string): Promise<CalendarEvent> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured.');
  }

  try {
    const eventData = {
      fields: eventToAirtableFields(event)
    };

    const response = await makeAirtableRequest(`/${airtableRecordId}`, 'PATCH', eventData);
    return airtableRecordToEvent(response);
  } catch (error) {
    console.error('Failed to update event in Airtable:', error);
    throw error;
  }
};

// Delete an event from Airtable
export const deleteEventFromAirtable = async (airtableRecordId: string): Promise<void> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured.');
  }

  try {
    await makeAirtableRequest(`/${airtableRecordId}`, 'DELETE');
  } catch (error) {
    console.error('Failed to delete event from Airtable:', error);
    throw error;
  }
};

// Batch operations for better performance
export const saveMultipleEventsToAirtable = async (events: CalendarEvent[]): Promise<CalendarEvent[]> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured.');
  }

  try {
    const records = events.map(event => ({
      fields: eventToAirtableFields(event)
    }));

    // Airtable API allows max 10 records per batch
    const batches = [];
    for (let i = 0; i < records.length; i += 10) {
      batches.push(records.slice(i, i + 10));
    }

    const savedEvents: CalendarEvent[] = [];
    for (const batch of batches) {
      const response = await makeAirtableRequest('', 'POST', { records: batch });
      savedEvents.push(...response.records.map(airtableRecordToEvent));
    }

    return savedEvents;
  } catch (error) {
    console.error('Failed to save multiple events to Airtable:', error);
    throw error;
  }
};

// Sync with Airtable - useful for initial setup
export const syncLocalEventsToAirtable = async (localEvents: CalendarEvent[]): Promise<CalendarEvent[]> => {
  if (!isAirtableConfigured()) {
    throw new Error('Airtable not configured.');
  }

  try {
    // First, try to load existing events from Airtable
    let existingEvents: CalendarEvent[] = [];
    try {
      existingEvents = await loadEventsFromAirtable();
    } catch (error) {
      console.log('No existing events in Airtable, creating new ones...');
    }

    // Find events that don't exist in Airtable
    const eventsToCreate = localEvents.filter(localEvent => 
      !existingEvents.some(existing => existing.id === localEvent.id)
    );

    if (eventsToCreate.length > 0) {
      await saveMultipleEventsToAirtable(eventsToCreate);
    }

    // Return all events from Airtable
    return await loadEventsFromAirtable();
  } catch (error) {
    console.error('Failed to sync events to Airtable:', error);
    throw error;
  }
}; 