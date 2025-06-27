import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  console.log('Environment variables loaded:');
  console.log('BASE_ID:', envVars.REACT_APP_AIRTABLE_BASE_ID);
  console.log('API_KEY:', envVars.REACT_APP_AIRTABLE_API_KEY ? `${envVars.REACT_APP_AIRTABLE_API_KEY.substring(0, 10)}...` : 'Not found');
  console.log('TABLE_NAME:', envVars.REACT_APP_AIRTABLE_TABLE_NAME);
  console.log('STORAGE_MODE:', envVars.REACT_APP_STORAGE_MODE);
  console.log('');

  const baseId = envVars.REACT_APP_AIRTABLE_BASE_ID;
  const apiKey = envVars.REACT_APP_AIRTABLE_API_KEY;
  const tableName = envVars.REACT_APP_AIRTABLE_TABLE_NAME;

  if (!baseId || !apiKey || !tableName) {
    console.error('Missing required environment variables!');
    process.exit(1);
  }

  const testAirtableConnection = async () => {
    try {
      console.log('Testing Airtable connection...');
      
      // Test 1: Get base schema
      console.log('\n1. Testing base schema access...');
      const baseResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      console.log('Base schema response status:', baseResponse.status);
      
      if (!baseResponse.ok) {
        const errorText = await baseResponse.text();
        console.error('Base schema error:', errorText);
        throw new Error(`Base schema failed: ${baseResponse.status} ${errorText}`);
      }
      
      const baseData = await baseResponse.json();
      console.log('✅ Base schema access successful!');
      console.log('Available tables:', baseData.tables.map(t => ({ id: t.id, name: t.name })));
      
      // Test 2: Get records from our table
      console.log('\n2. Testing table record access...');
      const recordsResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      console.log('Records response status:', recordsResponse.status);
      
      if (!recordsResponse.ok) {
        const errorText = await recordsResponse.text();
        console.error('Records error:', errorText);
        throw new Error(`Records access failed: ${recordsResponse.status} ${errorText}`);
      }
      
      const recordsData = await recordsResponse.json();
      console.log('✅ Records access successful!');
      console.log('Number of records found:', recordsData.records.length);
      
      if (recordsData.records.length > 0) {
        console.log('Sample record fields:', Object.keys(recordsData.records[0].fields));
      }
      
      // Test 3: Try to create a test record
      console.log('\n3. Testing record creation...');
      const testRecord = {
        fields: {
          Title: 'Test Event',
          Description: 'Test description',
          StartDate: new Date().toISOString(),
          EndDate: new Date(Date.now() + 3600000).toISOString(),
          Type: 'Order',
          Status: 'Pending'
        }
      };
      
      const createResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [testRecord] })
      });
      
      console.log('Create response status:', createResponse.status);
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Create error:', errorText);
        throw new Error(`Record creation failed: ${createResponse.status} ${errorText}`);
      }
      
      const createData = await createResponse.json();
      console.log('✅ Record creation successful!');
      const createdRecordId = createData.records[0].id;
      console.log('Created record ID:', createdRecordId);
      
      // Test 4: Clean up - delete the test record
      console.log('\n4. Testing record deletion...');
      const deleteResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?records[]=${createdRecordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      console.log('Delete response status:', deleteResponse.status);
      
      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error('Delete error:', errorText);
        console.log('⚠️  Test record was created but could not be deleted. You may need to delete it manually.');
      } else {
        console.log('✅ Record deletion successful!');
      }
      
      console.log('\n🎉 All Airtable tests passed! Integration should work perfectly.');
      
    } catch (error) {
      console.error('\n❌ Airtable connection test failed:', error.message);
      process.exit(1);
    }
  };

  testAirtableConnection();
  
} else {
  console.error('.env file not found!');
  process.exit(1);
} 