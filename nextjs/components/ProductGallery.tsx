"use client"

import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import Placeholder from '../images/Image (4).png'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface ProductGalleryProps {
  images: (string | StaticImageData)[]
  videoUrl?: string
  view360Url?: string
}

export default function ProductGallery({ images, videoUrl, view360Url }: ProductGalleryProps) {
  const list = images && images.length ? images : [Placeholder]
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  return (
    <div>
      <div
        className="relative aspect-[4/3] bg-card border border-gray-800 rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => setZoom(!zoom)}
        title={zoom ? 'Exit zoom' : 'Click to zoom'}
      >
        <motion.div animate={{ scale: zoom ? 1.25 : 1 }} className="w-full h-full">
          <Image src={list[active]} alt={`Image ${active + 1}`} fill className="object-cover" />
        </motion.div>
        {(videoUrl || view360Url) && (
          <div className="absolute top-2 left-2 flex gap-2">
            {videoUrl && (
              <a href={videoUrl} target="_blank" className="px-2 py-1 text-xs rounded-md border border-gray-700 bg-black/40 hover:border-brand">Video</a>
            )}
            {view360Url && (
              <a href={view360Url} target="_blank" className="px-2 py-1 text-xs rounded-md border border-gray-700 bg-black/40 hover:border-brand">360°</a>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {list.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-[4/3] rounded-md overflow-hidden border ${i === active ? 'border-brand' : 'border-gray-800'} hover:border-brand`}
          >
            <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}


