import { NextRequest, NextResponse } from 'next/server'
import { vercelUserStore } from '@/lib/vercel-user-store'

export async function GET(request: NextRequest) {
  try {
    // Diagnostic bilgileri al
    const diagnostics = vercelUserStore.getDiagnosticInfo()
    
    // User backup data (şifreler hariç)
    const users = (await vercelUserStore.getAllUsers()).map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      diagnostics,
      users,
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(diagnostics)
    })
    
  } catch (error) {
    console.error('Database diagnostic error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database diagnostic failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateRecommendations(diagnostics: any): string[] {
  const recommendations: string[] = []
  
  if (diagnostics.environment === 'Vercel' && !diagnostics.hasBackupEnv) {
    recommendations.push('⚠️ Add BACKUP_USER_DATA environment variable to prevent user data loss')
  }
  
  if (diagnostics.userCount < 2) {
    recommendations.push('🔧 Database may be corrupted - missing essential users')
  }
  
  if (diagnostics.adminCount === 0) {
    recommendations.push('❌ No admin users found - system may be inaccessible')
  }
  
  if (diagnostics.storageRisk.includes('HIGH')) {
    recommendations.push('🚨 Consider migrating to persistent storage (Vercel KV, Supabase, etc.)')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Database appears healthy')
  }
  
  return recommendations
}