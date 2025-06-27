import React from 'react';
import { AppProvider, Button, Card, InlineStack, Text } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CalendarView } from './components/CalendarView';
import { LoginForm } from './components/LoginForm';
import { testAirtableConnection } from './utils/testAirtable';

function AppContent() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const isSupabaseConfigured = process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY;
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        testAirtableConnection().catch((error: any) => {
          console.log('Airtable test failed (this is OK):', error?.message || error);
        });
      } catch (error: any) {
        console.log('Airtable test error (this is OK):', error?.message || error);
      }
    }
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If Supabase is not configured, show demo mode (full admin)
  if (!isSupabaseConfigured) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#fef7e0',
          padding: '12px 16px',
          borderBottom: '1px solid #f1c40f',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Demo Mode</strong> - Supabase not configured. Calendar is fully functional for testing.
          </div>
          <button
            onClick={signOut}
            style={{
              background: '#d82c0d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Demo
          </button>
        </div>
        <CalendarView isAdmin={true} />
      </div>
    );
  }

  // Always show the calendar, but only allow editing if authenticated as admin
  const handleSignOut = async () => {
    await signOut();
    setShowLogin(false); // Ensure login modal is closed after sign out
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card>
        <InlineStack align="end" blockAlign="center">
          <div>
            {user && isAdmin ? (
              <Button onClick={handleSignOut} tone="critical">Sign Out</Button>
            ) : (
              <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
            )}
          </div>
        </InlineStack>
      </Card>
      <CalendarView isAdmin={!!user && isAdmin} />
      {/* Show login modal if requested and not already authenticated */}
      {showLogin && !user && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.2)', padding: 32, minWidth: 320 }}>
            <LoginForm />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button onClick={() => setShowLogin(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App; 