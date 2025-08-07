"use client"

import { useEffect } from "react"

interface ProfileAnalyticsProps {
  profileId: string
}

export default function ProfileAnalytics({ profileId }: ProfileAnalyticsProps) {
  useEffect(() => {
    const recordView = async () => {
      try {
        // Get user location and device info
        const deviceInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          screenWidth: screen.width,
          screenHeight: screen.height,
          colorDepth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }

        // Get IP and location from external service
        let locationData = {}
        try {
          const response = await fetch('https://ipapi.co/json/')
          if (response.ok) {
            locationData = await response.json()
          }
        } catch (error) {
          console.warn('Location service unavailable')
        }

        // Record analytics
        await fetch('/api/analytics/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId,
            deviceInfo,
            locationData,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
          })
        })
      } catch (error) {
        console.error('Analytics error:', error)
      }
    }

    // Record view after a short delay to ensure page is loaded
    const timer = setTimeout(recordView, 1000)

    // Track time spent on page
    const startTime = Date.now()
    
    const handleBeforeUnload = async () => {
      const duration = Math.round((Date.now() - startTime) / 1000)
      
      // Use sendBeacon for reliable data sending on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          profileId,
          duration,
          action: 'page_leave'
        })
        
        navigator.sendBeacon('/api/analytics/duration', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [profileId])

  // Component renders nothing - it's just for tracking
  return null
}