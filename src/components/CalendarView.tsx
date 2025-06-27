import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import {
  Page,
  Layout,
  Card,
  Button,
  Modal,
  ButtonGroup,
  InlineStack,
  Text
} from '@shopify/polaris';
import { PlusMinor } from '@shopify/polaris-icons';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { loadEvents, saveEvents } from '../utils/eventStorage';

const localizer = momentLocalizer(moment);

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: 'order' | 'inventory' | 'marketing' | 'promotion';
  status: 'pending' | 'active' | 'completed';
}

interface CalendarViewProps {
  isAdmin?: boolean;
}

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Flash Sale - Summer Collection',
    start: new Date(2024, 2, 15, 10, 0),
    end: new Date(2024, 2, 15, 23, 59),
    description: 'Summer collection 50% off promotion',
    type: 'promotion',
    status: 'active'
  },
  {
    id: '2',
    title: 'Inventory Restock - Winter Boots',
    start: new Date(2024, 2, 20, 9, 0),
    end: new Date(2024, 2, 20, 17, 0),
    description: 'Restock 500 units of winter boots',
    type: 'inventory',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Email Marketing Campaign',
    start: new Date(2024, 2, 18, 8, 0),
    end: new Date(2024, 2, 18, 8, 30),
    description: 'Send newsletter to premium customers',
    type: 'marketing',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Large Order Fulfillment',
    start: new Date(2024, 2, 22, 10, 0),
    end: new Date(2024, 2, 22, 16, 0),
    description: 'Process bulk order #12345',
    type: 'order',
    status: 'pending'
  }
];

export function CalendarView({ isAdmin }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Load events from configured storage on component mount
  useEffect(() => {
    const loadInitialEvents = async () => {
      try {
        const savedEvents = await loadEvents();
        if (savedEvents.length > 0) {
          setEvents(savedEvents);
        } else {
          // If no saved events, use sample events
          setEvents(sampleEvents);
          await saveEvents(sampleEvents);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents(sampleEvents);
      }
    };
    
    loadInitialEvents();
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    if (isAdmin) {
      setShowEventModal(true);
    }
  }, [isAdmin]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    if (!isAdmin) {
      alert('Only administrators can create events. Please contact your admin.');
      return;
    }
    
    setSelectedEvent({
      id: '',
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      type: 'order',
      status: 'pending'
    });
    setShowEventModal(true);
  }, [isAdmin]);

  const handleSaveEvent = useCallback((eventData: CalendarEvent) => {
    if (!isAdmin) {
      alert('Only administrators can modify events. Please contact your admin.');
      return;
    }
    
    let updatedEvents: CalendarEvent[];
    
    if (eventData.id) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === eventData.id ? eventData : event
      );
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      updatedEvents = [...events, newEvent];
    }
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowEventModal(false);
    setSelectedEvent(null);
  }, [events, isAdmin]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    if (!isAdmin) {
      alert('Only administrators can delete events. Please contact your admin.');
      return;
    }
    
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowEventModal(false);
    setSelectedEvent(null);
  }, [events, isAdmin]);

  const eventStyleGetter = (event: CalendarEvent) => {
    let className = 'rbc-event';
    switch (event.type) {
      case 'order':
        className += ' order-event';
        break;
      case 'inventory':
        className += ' inventory-event';
        break;
      case 'marketing':
        className += ' marketing-event';
        break;
      case 'promotion':
        className += ' promotion-event';
        break;
    }
    return { className };
  };

  const viewOptions = [
    { label: 'Month', value: 'month' },
    { label: 'Week', value: 'week' },
    { label: 'Day', value: 'day' },
    { label: 'Agenda', value: 'agenda' }
  ];

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '16px' }}>
              <InlineStack align="space-between" blockAlign="center">
                <ButtonGroup variant="segmented">
                  {viewOptions.map(option => (
                    <Button
                      key={option.value}
                      pressed={view === option.value}
                      onClick={() => setView(option.value as View)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div className="calendar-container">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={isAdmin ? handleSelectSlot : undefined}
                selectable={isAdmin}
                eventPropGetter={eventStyleGetter}
                popup
              />
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <EventList 
            events={events}
            onSelectEvent={isAdmin ? handleSelectEvent : () => {}}
            onDeleteEvent={isAdmin ? handleDeleteEvent : () => {}}
            isAdmin={isAdmin}
            selectedEventId={selectedEvent ? selectedEvent.id : undefined}
          />
        </Layout.Section>
      </Layout>

      <Modal
        open={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent?.id ? 'Edit Event' : 'Create New Event'}
        primaryAction={{
          content: 'Save',
          onAction: () => {}
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }
          }
        ]}
      >
        <Modal.Section>
          {selectedEvent && (
            <EventForm
              event={selectedEvent}
              onSave={handleSaveEvent}
              onDelete={selectedEvent.id && isAdmin ? handleDeleteEvent : undefined}
            />
          )}
        </Modal.Section>
      </Modal>

      <Modal
        open={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title="Admin Panel"
        primaryAction={{
          content: 'Close',
          onAction: () => setShowAdminModal(false)
        }}
      >
        <Modal.Section>
          <Text as="span" variant="bodyMd">
            You are in <b>Admin Mode</b>.<br />
            Only admins can create, edit, or clear events.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
} 