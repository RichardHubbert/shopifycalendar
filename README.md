# Shopify Calendar

A comprehensive calendar application for Shopify store management, built with React and Shopify Polaris design system.

## Features

### 📅 Calendar Views
- **Month View**: Get an overview of all your scheduled events
- **Week View**: Focus on weekly planning and scheduling
- **Day View**: Detailed daily schedule management
- **Agenda View**: List view of upcoming events

### 🏷️ Event Types
- **Orders**: Track order fulfillment and shipping deadlines
- **Inventory**: Schedule restocking and inventory management tasks
- **Marketing**: Plan email campaigns, social media posts, and advertising
- **Promotions**: Manage sales, discounts, and special offers

### ✨ Key Features
- **Event Creation**: Easy-to-use form for creating new events
- **Event Editing**: Click any event to modify details
- **Event Filtering**: Filter by type, status, or search by keywords
- **Color Coding**: Visual distinction between different event types
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant calendar updates when events are modified

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This will create a `build` folder with optimized production files.

## Usage

### Creating Events

1. Click the "Add Event" button in the top right
2. Fill in the event details:
   - **Title**: Brief description of the event
   - **Description**: Additional details (optional)
   - **Type**: Choose from Order, Inventory, Marketing, or Promotion
   - **Status**: Set as Pending, Active, or Completed
   - **Date & Time**: Set start and end times
3. Click "Create Event" to save

### Managing Events

- **View Event**: Click on any calendar event to see details
- **Edit Event**: In the event modal, modify any field and save
- **Delete Event**: Use the delete button in the event modal or event list
- **Filter Events**: Use the sidebar filters to find specific events

### Calendar Navigation

- **Change Views**: Use the Month/Week/Day/Agenda buttons
- **Navigate Dates**: Use the arrow buttons or date picker
- **Create Events**: Click and drag on empty calendar slots

## Integration with Shopify

This calendar can be extended to integrate with Shopify's APIs:

- **Orders API**: Automatically create events for order deadlines
- **Inventory API**: Track stock levels and reorder points
- **Marketing API**: Sync with email campaigns and promotions
- **Webhooks**: Real-time updates from your Shopify store

## Customization

### Event Types
Modify the event types in `src/components/CalendarView.tsx`:

```typescript
const typeOptions = [
  { label: 'Custom Type', value: 'custom' },
  // Add your custom event types
];
```

### Styling
Customize the appearance in `src/index.css`:

- Event colors
- Calendar theme
- Typography
- Layout spacing

### Components
The application is built with reusable components:

- `CalendarView`: Main calendar interface
- `EventForm`: Event creation/editing form
- `EventList`: Sidebar event list with filtering

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Shopify Polaris**: Design system for consistent UI
- **React Big Calendar**: Full-featured calendar component
- **Moment.js**: Date/time manipulation
- **React Scripts**: Build tooling and development server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ for Shopify store owners and developers. 