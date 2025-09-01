export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-xl text-gray-400">Profil yükleniyor...</p>
      </div>
    </div>
  )
}