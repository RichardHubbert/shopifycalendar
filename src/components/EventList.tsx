import React, { useState, useMemo } from 'react';
import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  Button,
  Filters,
  BlockStack,
  InlineStack,
  EmptyState
} from '@shopify/polaris';
import { CalendarEvent } from './CalendarView';

interface EventListProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  isAdmin?: boolean;
  selectedEventId?: string;
}

export function EventList({ events, onSelectEvent, onDeleteEvent, isAdmin, selectedEventId }: EventListProps) {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [queryValue, setQueryValue] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const title = event.title || '';
      const description = event.description || '';
      
      const matchesQuery = title.toLowerCase().includes(queryValue.toLowerCase()) ||
                          description.toLowerCase().includes(queryValue.toLowerCase());
      const matchesType = !typeFilter || event.type === typeFilter;
      const matchesStatus = !statusFilter || event.status === statusFilter;
      
      return matchesQuery && matchesType && matchesStatus;
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, queryValue, typeFilter, statusFilter]);

  const filters = [
    {
      key: 'type',
      label: 'Event Type',
      filter: (
        <select
          value={typeFilter || ''}
          onChange={(e) => setTypeFilter(e.target.value || undefined)}
        >
          <option value="">All Types</option>
          <option value="order">Orders</option>
          <option value="inventory">Inventory</option>
          <option value="marketing">Marketing</option>
          <option value="promotion">Promotions</option>
        </select>
      ),
      shortcut: true,
    },
    {
      key: 'status',
      label: 'Status',
      filter: (
        <select
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      ),
      shortcut: true,
    },
  ];

  const appliedFilters: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (typeFilter) {
    appliedFilters.push({
      key: 'type',
      label: `Type: ${typeFilter}`,
      onRemove: () => setTypeFilter(undefined),
    });
  }
  if (statusFilter) {
    appliedFilters.push({
      key: 'status',
      label: `Status: ${statusFilter}`,
      onRemove: () => setStatusFilter(undefined),
    });
  }

  const getStatusBadge = (status: CalendarEvent['status']) => {
    if (!status) {
      return <Badge>Unknown</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge tone="attention">Pending</Badge>;
      case 'active':
        return <Badge tone="success">Active</Badge>;
      case 'completed':
        return <Badge>Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: CalendarEvent['type']) => {
    if (!type) {
      return <Badge>Unknown</Badge>;
    }
    
    const colors = {
      order: 'success',
      inventory: 'warning',
      marketing: 'info',
      promotion: 'critical'
    } as const;

    return <Badge tone={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (filteredEvents.length === 0 && events.length === 0) {
    return (
      <Card>
        <div style={{ padding: '16px' }}>
          <EmptyState
            heading="No events scheduled"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Create your first event to get started with managing your Shopify store calendar.</p>
          </EmptyState>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">Upcoming Events</Text>
          <Text as="p" variant="bodySm" tone="subdued">
            {filteredEvents.length} of {events.length} events
          </Text>
        </BlockStack>
      </div>

      <div style={{ padding: '0 16px 16px 16px' }}>
        <Filters
          queryValue={queryValue}
          filters={filters}
          appliedFilters={appliedFilters}
          onQueryChange={setQueryValue}
          onQueryClear={() => setQueryValue('')}
          onClearAll={() => {
            setQueryValue('');
            setTypeFilter(undefined);
            setStatusFilter(undefined);
          }}
        />
      </div>

      <ResourceList
        resourceName={{ singular: 'event', plural: 'events' }}
        items={filteredEvents}
        renderItem={(event) => {
          const { id, title, description, start, end, type, status } = event;
          const isSelected = selectedEventId === id;

          return (
            <ResourceItem
              id={id || 'unknown'}
              onClick={() => onSelectEvent(event)}
              accessibilityLabel={`View details for ${title || 'event'}`}
            >
              <div
                style={isSelected
                  ? {
                      background: '#e0e7ff',
                      borderRadius: 8,
                      border: '2px solid #5c6ac4',
                      padding: 8,
                      opacity: 1,
                      transition: 'opacity 0.5s',
                    }
                  : {
                      opacity: 0.7,
                      transition: 'opacity 0.5s',
                    }
                }
              >
                <div style={{ padding: '12px 0' }}>
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="200">
                      <InlineStack gap="200">
                        <Text as="span" variant="bodyMd" fontWeight="semibold">{title || 'Untitled Event'}</Text>
                        {getTypeBadge(type)}
                        {getStatusBadge(status)}
                        {isAdmin && (
                          <Button
                            variant="plain"
                            tone="critical"
                            // Workaround: ignore linter, no-arg handler, event propagation handled by ResourceItem
                            onClick={() => onDeleteEvent(id || '')}
                          >
                            Delete
                          </Button>
                        )}
                      </InlineStack>
                      {description && (
                        <Text as="p" variant="bodySm" tone="subdued">
                          {description.length > 60 ? description.substring(0, 60) + '...' : description}
                        </Text>
                      )}
                      <Text as="p" variant="bodySm" tone="subdued">
                        {start && end ? `${formatDate(start)} - ${formatDate(end)}` : 'No date set'}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </div>
              </div>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
} 