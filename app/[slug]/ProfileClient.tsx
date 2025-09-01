"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy components
const ProfileContent = dynamic(() => import('./ProfileContent'), {
  loading: () => <div>Yükleniyor...</div>,
  ssr: false
})

export default function ProfileClient({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent slug={slug} />
    </Suspense>
  )
}