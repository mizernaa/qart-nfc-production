import { notFound } from "next/navigation"

async function getProfile(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://qart-nfc-production.vercel.app'}/api/profile/${slug}`, {
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">{profile.name}</h1>
        {profile.title && <p className="text-xl text-gray-400 mb-4">{profile.title}</p>}
        {profile.bio && <p className="text-gray-300 mb-8">{profile.bio}</p>}
        
        {profile.phone && (
          <div className="mb-4">
            <span className="text-gray-400">Telefon: </span>
            <a href={`tel:${profile.phone}`} className="text-blue-400 hover:text-blue-300">
              {profile.phone}
            </a>
          </div>
        )}
        
        {profile.email && (
          <div className="mb-4">
            <span className="text-gray-400">Email: </span>
            <a href={`mailto:${profile.email}`} className="text-blue-400 hover:text-blue-300">
              {profile.email}
            </a>
          </div>
        )}
        
        {profile.website && (
          <div className="mb-4">
            <span className="text-gray-400">Website: </span>
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              {profile.website}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}