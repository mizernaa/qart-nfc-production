"use client"

import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Youtube, 
  Github,
  ExternalLink
} from "lucide-react"

interface SocialLink {
  id: string
  platform: string
  url: string
  isVisible: boolean
  order: number
}

interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
}

interface SocialGridProps {
  socialLinks: SocialLink[]
  theme: Theme
}

const socialIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  tiktok: ExternalLink,
  whatsapp: ExternalLink,
  telegram: ExternalLink,
  discord: ExternalLink,
  pinterest: ExternalLink,
  spotify: ExternalLink,
  behance: ExternalLink,
  dribbble: ExternalLink,
  medium: ExternalLink
}

const socialColors: Record<string, string> = {
  instagram: "#E4405F",
  linkedin: "#0077B5",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
  youtube: "#FF0000",
  github: "#333333",
  tiktok: "#000000",
  whatsapp: "#25D366",
  telegram: "#0088CC",
  discord: "#5865F2",
  pinterest: "#BD081C",
  spotify: "#1DB954",
  behance: "#1769FF",
  dribbble: "#EA4C89",
  medium: "#000000"
}

export default function SocialGrid({ socialLinks, theme }: SocialGridProps) {
  const handleSocialClick = async (socialId: string, url: string) => {
    // Track click analytics
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialId })
      })
    } catch (error) {
      console.error("Analytics error:", error)
    }

    // Open link
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {socialLinks.map((social) => {
        const IconComponent = socialIcons[social.platform] || ExternalLink
        const brandColor = socialColors[social.platform] || theme.primaryColor

        return (
          <button
            key={social.id}
            onClick={() => handleSocialClick(social.id, social.url)}
            className="group relative p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${brandColor}20, ${theme.primaryColor}10)`
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div 
                className="p-3 rounded-full transition-colors"
                style={{ backgroundColor: `${brandColor}20` }}
              >
                <IconComponent 
                  className="h-6 w-6"
                  style={{ color: brandColor }}
                />
              </div>
              <span className="text-sm font-medium capitalize">
                {social.platform}
              </span>
            </div>
            
            {/* Hover effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${brandColor}30, transparent)`
              }}
            />
          </button>
        )
      })}
    </div>
  )
}