const { Client } = require('pg')

const connectionString = "postgresql://neondb_owner:npg_AzuTsd6wRv3I@ep-spring-mountain-a2kt3o1s-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

async function testConnection() {
  console.log('🔗 Testing PostgreSQL connection...')
  console.log('Connection string:', connectionString.replace(/:[^:@]*@/, ':***@'))
  
  const client = new Client({
    connectionString: connectionString
  })

  try {
    await client.connect()
    console.log('✅ PostgreSQL connection successful!')
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time')
    console.log('🕒 Current time from database:', result.rows[0].current_time)
    
    // Check if tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log('📊 Existing tables:', tables.rows.map(r => r.table_name))
    
    await client.end()
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
    console.error('Error code:', error.code)
    await client.end()
    return false
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1)
})