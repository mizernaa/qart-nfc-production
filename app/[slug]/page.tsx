import { notFound } from "next/navigation"
import { Phone, Mail, Globe } from "lucide-react"

async function getProfile(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'
    const res = await fetch(`${baseUrl}/api/profile/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await getProfile(slug)
  
  if (!profile) {
    notFound()
  }
  
  // Simple theme configuration
  const themeColors = {
    primary: profile?.themeSettings?.colors?.primary || '#3b82f6',
    secondary: profile?.themeSettings?.colors?.secondary || '#8b5cf6',
    accent: profile?.themeSettings?.colors?.accent || '#06b6d4'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" 
              style={{ color: themeColors.primary }}>
            {profile?.name || 'Kullanıcı'}
          </h1>
          {profile?.title && (
            <p className="text-xl text-gray-400 mb-4">{profile.title}</p>
          )}
          {profile?.bio && (
            <p className="text-gray-300 mb-8">{profile.bio}</p>
          )}
        </div>
        
        {/* Contact Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {profile?.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition"
              style={{ 
                background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` 
              }}
            >
              <Phone className="w-5 h-5" />
              <span>Ara</span>
            </a>
          )}
          
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition"
              style={{ 
                background: `linear-gradient(to right, ${themeColors.secondary}, ${themeColors.accent})` 
              }}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
          )}
        </div>
        
        {/* Contact Info */}
        <div className="space-y-4">
          {profile?.phone && (
            <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl">
              <Phone className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Telefon: </span>
              <a href={`tel:${profile.phone}`} className="text-blue-400 hover:text-blue-300">
                {profile.phone}
              </a>
            </div>
          )}
          
          {profile?.email && (
            <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl">
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">Email: </span>
              <a href={`mailto:${profile.email}`} className="text-blue-400 hover:text-blue-300">
                {profile.email}
              </a>
            </div>
          )}
          
          {profile?.website && (
            <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300">Website: </span>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-400 hover:text-blue-300">
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}