"use client"

import { motion } from "framer-motion"
import { Crown, Diamond, Sparkles, Gem } from "lucide-react"

// Move all the component definitions here
export const EpicBackground = ({ colors }: { colors: any }) => (
  <div className="fixed inset-0 z-0">
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: `radial-gradient(circle at 20% 80%, ${colors?.primary || '#3b82f6'} 0%, transparent 50%), 
                     radial-gradient(circle at 80% 20%, ${colors?.secondary || '#8b5cf6'} 0%, transparent 50%), 
                     radial-gradient(circle at 40% 40%, ${colors?.accent || '#06b6d4'} 0%, transparent 50%)`
      }}
    />
    {/* Floating particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-blue-400/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() > 0.5 ? 30 : -30, 0],
          opacity: [0.2, 0.8, 0.2]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
)

export const EpicCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02 }}
    className={`relative group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
      {children}
    </div>
  </motion.div>
)