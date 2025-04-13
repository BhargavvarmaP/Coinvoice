'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 text-xl font-semibold mb-2">Something went wrong!</h2>
        <p className="text-red-600 mb-4">Failed to load invoice details.</p>
        <button
          onClick={reset}
          className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 