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

console.log('🔍 Checking Airtable Table Fields...\n');

const requiredFields = [
  { name: 'ID', type: 'singleLineText' },
  { name: 'Title', type: 'singleLineText' },
  { name: 'Description', type: 'multilineText' },
  { name: 'StartDate', type: 'dateTime' },
  { name: 'EndDate', type: 'dateTime' },
  { name: 'Type', type: 'singleSelect' },
  { name: 'Status', type: 'singleSelect' },
  { name: 'CreatedAt', type: 'dateTime' },
  { name: 'UpdatedAt', type: 'dateTime' }
];

const checkFields = async () => {
  try {
    // Get base schema to see all fields
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get base schema: ${response.status}`);
    }

    const data = await response.json();
    const table = data.tables.find(t => t.id === tableName || t.name === 'calendar');
    
    if (!table) {
      console.error('❌ Table not found!');
      return;
    }

    console.log(`✅ Found table: "${table.name}" (ID: ${table.id})\n`);
    
    console.log('📋 Current Fields in Airtable:');
    console.log('=====================================');
    table.fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
      if (field.type === 'singleSelect' && field.options?.choices) {
        console.log(`   Options: ${field.options.choices.map(c => c.name).join(', ')}`);
      }
    });

    console.log('\n🎯 Required Fields for Calendar:');
    console.log('=====================================');
    requiredFields.forEach((field, index) => {
      const exists = table.fields.find(f => f.name === field.name);
      const status = exists ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${field.name} (${field.type})`);
    });

    const missingFields = requiredFields.filter(req => 
      !table.fields.find(f => f.name === req.name)
    );

    if (missingFields.length === 0) {
      console.log('\n🎉 All required fields exist! Your table is ready.');
    } else {
      console.log('\n🔧 Missing Fields - Add These to Airtable:');
      console.log('============================================');
      missingFields.forEach((field, index) => {
        console.log(`${index + 1}. Add field: "${field.name}" (Type: ${field.type})`);
        
        if (field.name === 'Type') {
          console.log('   Single Select Options: Order, Inventory, Marketing, Promotion');
        } else if (field.name === 'Status') {
          console.log('   Single Select Options: Pending, Active, Completed');
        }
      });

      console.log('\n📝 How to Add Fields in Airtable:');
      console.log('1. Go to your Airtable base');
      console.log('2. Click the "calendar" table');
      console.log('3. Click the "+" button to add a new field');
      console.log('4. Choose the field type and add options as shown above');
      console.log('5. Repeat for each missing field');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkFields(); 