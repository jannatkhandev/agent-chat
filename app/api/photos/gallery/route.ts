import { NextResponse } from 'next/server'

// Import the function to get approved images
// In production, this would query a database
interface ImageData {
  id: string
  url: string
  fileName: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

// This would be imported from a shared database module in production
// For now, we'll access the same storage as the moderate endpoint
let imageDatabase: ImageData[] = []

export async function GET() {
  try {
    // Get only approved images for the gallery
    const approvedImages = imageDatabase.filter(img => img.status === 'approved')

    return NextResponse.json({
      success: true,
      photos: approvedImages.map(img => ({
        id: img.id,
        url: img.url,
        fileName: img.fileName,
        uploadedAt: img.uploadedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching approved images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

// Export function to access the database (for sharing with other endpoints)
export function getImageDatabase() {
  return imageDatabase
}

export function setImageDatabase(data: ImageData[]) {
  imageDatabase = data
}