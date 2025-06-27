import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const baseId = envVars.REACT_APP_AIRTABLE_BASE_ID;
const apiKey = envVars.REACT_APP_AIRTABLE_API_KEY;
const tableName = envVars.REACT_APP_AIRTABLE_TABLE_NAME;

console.log('🧪 Simple Airtable Test (Read Only)...\n');

const testSimpleConnection = async () => {
  try {
    console.log('1. Testing read access...');
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=3`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Read access failed:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Read access successful!');
    console.log(`📊 Found ${data.records.length} records`);
    
    if (data.records.length > 0) {
      console.log('\nSample record structure:');
      const sampleRecord = data.records[0];
      console.log('Record ID:', sampleRecord.id);
      console.log('Fields:', Object.keys(sampleRecord.fields));
      console.log('Field values:', sampleRecord.fields);
    }

    console.log('\n🎉 Airtable connection is working!');
    console.log('\n📝 Next step: Add dropdown options to Type and Status fields');
    console.log('Type options: Order, Inventory, Marketing, Promotion');
    console.log('Status options: Pending, Active, Completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testSimpleConnection(); 