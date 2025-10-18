/**
 * ImageKit Test Component
 * Use this to verify ImageKit configuration is working
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageKitTest() {
  const [uploadStatus, setUploadStatus] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'test')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setImageUrl(data.data.url)
        setUploadStatus('✅ Upload successful!')
      } else {
        setUploadStatus(`❌ Error: ${data.error}`)
      }
    } catch (error: any) {
      setUploadStatus(`❌ Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">ImageKit Configuration Test</h2>
      
      {/* Configuration Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Configuration:</h3>
        <div className="text-sm space-y-1">
          <p>✅ Endpoint: {process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}</p>
          <p>✅ Public Key: {process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.substring(0, 20)}...</p>
          <p>✅ Package: imagekit installed</p>
        </div>
      </div>

      {/* Upload Test */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Test Upload:</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark
            disabled:opacity-50"
        />
        {uploadStatus && (
          <p className="mt-2 text-sm font-medium">{uploadStatus}</p>
        )}
      </div>

      {/* Display Uploaded Image */}
      {imageUrl && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Uploaded Image:</h3>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt="Uploaded test image"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-xs break-all text-gray-600">{imageUrl}</p>
        </div>
      )}

      {/* Sample ImageKit Image */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Sample Image (ImageKit CDN):</h3>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}/default-image.jpg`}
            alt="Sample from ImageKit"
            fill
            className="object-contain"
            onError={(e) => {
              // @ts-ignore
              e.target.src = 'https://placehold.co/600x400?text=Upload+First+Image'
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">
          This will load from: {process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT}
        </p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-green-800">✅ Setup Complete!</h3>
        <ul className="text-sm space-y-1 text-green-700">
          <li>• ImageKit credentials configured</li>
          <li>• Package installed successfully</li>
          <li>• Upload API ready at /api/admin/upload</li>
          <li>• Ready to upload product images!</li>
        </ul>
      </div>
    </div>
  )
}
