import React, { useState } from 'react';
import {
  Card,
  FormLayout,
  TextField,
  Button,
  Text,
  BlockStack
} from '@shopify/polaris';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card>
        <div style={{ padding: '32px', minWidth: '400px' }}>
          <BlockStack gap="400">
            <div style={{ textAlign: 'center' }}>
              <Text as="h1" variant="headingLg">
                Shopify Calendar Admin
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Sign in to manage your calendar events
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />

                {error && (
                  <Text as="p" tone="critical">
                    {error}
                  </Text>
                )}

                <Button
                  submit
                  variant="primary"
                  loading={loading}
                  fullWidth
                >
                  Sign In
                </Button>
              </FormLayout>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Text as="p" variant="bodySm" tone="subdued">
                Only authorized administrators can access this calendar
              </Text>
            </div>
          </BlockStack>
        </div>
      </Card>
    </div>
  );
} 