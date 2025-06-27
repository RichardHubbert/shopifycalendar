import React, { useState, useCallback } from 'react';
import {
  FormLayout,
  TextField,
  Select,
  Button,
  InlineStack,
  Checkbox,
  Text,
  Card
} from '@shopify/polaris';
import { CalendarEvent } from './CalendarView';

interface EventFormProps {
  event: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventForm({ event, onSave, onDelete }: EventFormProps) {
  const [formData, setFormData] = useState<CalendarEvent>(event);
  const [startDate, setStartDate] = useState(event.start);
  const [endDate, setEndDate] = useState(event.end);
  const [allDay, setAllDay] = useState(false);

  const typeOptions = [
    { label: 'Order', value: 'order' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Promotion', value: 'promotion' }
  ];

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  const handleSubmit = useCallback(() => {
    const eventData: CalendarEvent = {
      ...formData,
      start: startDate,
      end: endDate
    };
    onSave(eventData);
  }, [formData, startDate, endDate, onSave]);

  const handleDelete = useCallback(() => {
    if (onDelete && formData.id) {
      onDelete(formData.id);
    }
  }, [onDelete, formData.id]);

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <FormLayout>
        <TextField
          label="Event Title"
          value={formData.title}
          onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          placeholder="Enter event title"
          autoComplete="off"
        />

        <TextField
          label="Description"
          value={formData.description || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Enter event description"
          multiline={3}
          autoComplete="off"
        />

        <FormLayout.Group>
          <Select
            label="Event Type"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              type: value as CalendarEvent['type'] 
            }))}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              status: value as CalendarEvent['status'] 
            }))}
          />
        </FormLayout.Group>

        <Checkbox
          label="All day event"
          checked={allDay}
          onChange={setAllDay}
        />

        <FormLayout.Group>
          <div>
            <Text as="p" variant="bodyMd" fontWeight="semibold">Start Date & Time</Text>
            <TextField
              label=""
              type="datetime-local"
              value={startDate.toISOString().slice(0, 16)}
              onChange={(value) => setStartDate(new Date(value))}
              autoComplete="off"
            />
          </div>

          <div>
            <Text as="p" variant="bodyMd" fontWeight="semibold">End Date & Time</Text>
            <TextField
              label=""
              type="datetime-local"
              value={endDate.toISOString().slice(0, 16)}
              onChange={(value) => setEndDate(new Date(value))}
              autoComplete="off"
            />
          </div>
        </FormLayout.Group>

        <InlineStack align="space-between">
          <Button variant="primary" onClick={handleSubmit}>
            {formData.id ? 'Update Event' : 'Create Event'}
          </Button>
          
          {onDelete && formData.id && (
            <Button variant="primary" tone="critical" onClick={handleDelete}>
              Delete Event
            </Button>
          )}
        </InlineStack>
        </FormLayout>
      </div>
    </Card>
  );
} 