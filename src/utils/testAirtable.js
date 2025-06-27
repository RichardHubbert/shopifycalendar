// Simple Airtable connection test
// Run this in browser console to test connectivity

export const testAirtableConnection = async () => {
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
  
  console.log('Testing Airtable connection...');
  console.log('Base ID:', baseId);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  
  if (!baseId || !apiKey) {
    console.error('❌ Missing credentials!');
    return false;
  }
  
  try {
    const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'tblPn5rEFpQtpBL6y';
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Airtable connection successful!');
      console.log('Records found:', data.records?.length || 0);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Airtable error:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
};

// Auto-run test when this file is loaded
if (typeof window !== 'undefined') {
  window.testAirtableConnection = testAirtableConnection;
  console.log('Airtable test function loaded. Run testAirtableConnection() in console to test.');
} 