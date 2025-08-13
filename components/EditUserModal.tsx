import { useState } from "react"
import { XCircle } from "lucide-react"

interface EditUserModalProps {
  user: any
  onClose: () => void
  onSave: () => void
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    isAdmin: user.isAdmin || false,
    isActive: user.isActive !== false,
    subscription: user.subscription || "Free"
  })

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/hybrid-users?id=${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Kullanıcı başarıyla güncellendi!')
        onSave()
        onClose()
      } else {
        alert('Hata: ' + data.message)
      }
    } catch (error) {
      console.error('Update user error:', error)
      alert('Bir hata oluştu!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Kullanıcı Düzenle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={editedUser.phone}
              onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="0555 555 5555"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={editedUser.isAdmin}
                onChange={(e) => setEditedUser({...editedUser, isAdmin: e.target.checked})}
                className="rounded bg-gray-800 border-gray-700"
              />
              <span>Admin Yetkisi</span>
            </label>

            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={editedUser.isActive}
                onChange={(e) => setEditedUser({...editedUser, isActive: e.target.checked})}
                className="rounded bg-gray-800 border-gray-700"
              />
              <span>Aktif</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Abonelik
            </label>
            <select
              value={editedUser.subscription}
              onChange={(e) => setEditedUser({...editedUser, subscription: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="Free">Free</option>
              <option value="QART Lifetime">QART Lifetime</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}