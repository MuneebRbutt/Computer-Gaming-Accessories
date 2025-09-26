"use client"

import { motion, Variants } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

const getVariants = (direction: RevealProps['direction']): Variants => {
  const dist = 24
  const map = {
    up: { y: dist },
    down: { y: -dist },
    left: { x: dist },
    right: { x: -dist }
  } as const
  const offset = map[direction || 'up']
  return {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0 }
  }
}

export default function Reveal({ children, direction = 'up', delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      variants={getVariants(direction)}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}


