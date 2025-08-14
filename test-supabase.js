const { Client } = require('pg')

// Template - Supabase connection string formatı
const SUPABASE_CONNECTION_TEMPLATE = "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

async function testSupabaseConnection(connectionString) {
  console.log('🚀 Testing Supabase PostgreSQL connection...')
  console.log('Connection string:', connectionString.replace(/:[^:@]*@/, ':***@'))
  
  const client = new Client({
    connectionString: connectionString
  })

  try {
    await client.connect()
    console.log('✅ Supabase PostgreSQL connection successful!')
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time')
    console.log('🕒 Current time from database:', result.rows[0].current_time)
    
    // Check if User table exists
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'User'
    `)
    console.log('👤 User table exists:', tables.rows.length > 0)
    
    // If no User table, show all tables
    if (tables.rows.length === 0) {
      const allTables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)
      console.log('📊 All tables:', allTables.rows.map(r => r.table_name))
    }
    
    await client.end()
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    console.error('Error code:', error.code)
    await client.end()
    return false
  }
}

// Check if connection string is provided as argument
const connectionString = process.argv[2]
if (!connectionString) {
  console.log('📝 Usage: node test-supabase.js "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"')
  console.log('🔗 Get your connection string from: https://app.supabase.com → Settings → Database')
  process.exit(1)
}

testSupabaseConnection(connectionString).then(success => {
  process.exit(success ? 0 : 1)
})