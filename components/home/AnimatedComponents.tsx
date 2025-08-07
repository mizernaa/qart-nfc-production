"use client"

import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"

// Animated counter for statistics
export function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/\D/g, ''))
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 2000, 1)
      
      setCount(Math.floor(progress * target))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [target])
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {count}{suffix}
    </motion.div>
  )
}

// Animated text with typewriter effect
export function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")
  
  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 30)
    
    return () => clearInterval(interval)
  }, [text])
  
  return <span className={className}>{displayText}</span>
}

// Animated card with hover effects
export function AnimatedCard({ children, className = "", delay = 0 }: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating animation wrapper
export function FloatingElement({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        delay
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation wrapper
export function PulseElement({ children }: { children: ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  )
}

// Gradient animated text
export function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      animate={{
        backgroundPosition: ["0%", "200%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {children}
    </motion.span>
  )
}