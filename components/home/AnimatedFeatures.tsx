"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const features = [
  {
    icon: "📱",
    title: "Tek Dokunuş",
    description: "NFC ile anında bağlantı",
    gradient: "from-blue-400 to-cyan-400",
    delay: 0
  },
  {
    icon: "🔗",
    title: "Anında Bağlantı",
    description: "Sosyal medya ve iletişim",
    gradient: "from-purple-400 to-pink-400",
    delay: 0.2
  },
  {
    icon: "📊",
    title: "Detaylı Analitik",
    description: "Gerçek zamanlı veriler",
    gradient: "from-orange-400 to-red-400",
    delay: 0.4
  }
]

export default function AnimatedFeatures() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-96 h-32 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Main container */}
      <motion.div 
        className="relative flex flex-wrap items-center justify-center gap-4 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: feature.delay,
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Feature card */}
            <motion.div
              className={`
                relative overflow-hidden rounded-2xl p-4 md:p-6
                bg-gradient-to-br from-gray-800/50 to-gray-900/50
                backdrop-blur-sm border border-gray-700/50
                ${activeIndex === index ? 'scale-110 border-white/30' : ''}
                transition-all duration-500
              `}
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgba(255,255,255,0.3)"
              }}
              animate={activeIndex === index ? {
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 40px rgba(168, 85, 247, 0.3)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: activeIndex === index ? Infinity : 0,
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20`}
                animate={activeIndex === index ? { opacity: [0, 0.3, 0] } : {}}
                transition={{ duration: 2, repeat: activeIndex === index ? Infinity : 0 }}
              />

              {/* Icon with animation */}
              <motion.div
                className="text-4xl md:text-5xl mb-2"
                animate={activeIndex === index ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: activeIndex === index ? Infinity : 0,
                }}
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <motion.h3 
                className={`
                  text-lg md:text-xl font-bold mb-1
                  ${activeIndex === index ? 'text-white' : 'text-gray-200'}
                  transition-colors duration-500
                `}
              >
                {feature.title}
              </motion.h3>

              {/* Description */}
              <motion.p 
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: feature.delay + 0.2 }}
              >
                {feature.description}
              </motion.p>

              {/* Pulse effect for active item */}
              {activeIndex === index && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-lg"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Connection lines */}
              {index < features.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-1/2 -right-4 md:-right-8 w-4 md:w-8 h-0.5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: feature.delay + 0.3 }}
                >
                  <div className="h-full bg-gradient-to-r from-gray-600 to-transparent" />
                  <motion.div
                    className="absolute inset-0 h-full bg-gradient-to-r from-white to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Floating particles around active item */}
            {activeIndex === index && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${20 + i * 30}%`,
                      left: `${-10 - i * 5}%`,
                    }}
                    animate={{
                      x: [0, 20, 0],
                      y: [0, -10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom indicator dots */}
      <motion.div 
        className="flex justify-center gap-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {features.map((_, index) => (
          <motion.div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-500
              ${activeIndex === index ? 'w-8 bg-white' : 'bg-gray-600'}
            `}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}