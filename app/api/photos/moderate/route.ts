import { NextRequest, NextResponse } from 'next/server'
import { getImageDatabase, setImageDatabase } from '../gallery/route'

// In-memory storage for demo purposes
// In production, this should be stored in a database
interface ImageData {
  id: string
  url: string
  fileName: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export async function GET() {
  try {
    const imageDatabase = getImageDatabase()
    // Return all images for moderation
    return NextResponse.json({
      success: true,
      images: imageDatabase
    })
  } catch (error) {
    console.error('Error fetching images for moderation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageId, action } = await request.json()

    if (!imageId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing imageId or action' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Find and update the image
    const imageDatabase = getImageDatabase()
    const imageIndex = imageDatabase.findIndex(img => img.id === imageId)
    if (imageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    imageDatabase[imageIndex].status = action === 'approve' ? 'approved' : 'rejected'
    setImageDatabase(imageDatabase)

    return NextResponse.json({
      success: true,
      message: `Image ${action}d successfully`,
      image: imageDatabase[imageIndex]
    })
  } catch (error) {
    console.error('Error updating image status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update image status' },
      { status: 500 }
    )
  }
}

