"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye, Loader2 } from "lucide-react"
import Image from "next/image"

interface PendingImage {
  id: string
  url: string
  fileName: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function OnlyIKnowPage() {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPendingImages()
  }, [])

  const fetchPendingImages = async () => {
    try {
      const response = await fetch('/api/photos/moderate')
      if (response.ok) {
        const data = await response.json()
        setPendingImages(data.images || [])
      }
    } catch (error) {
      console.error('Failed to fetch pending images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (imageId: string) => {
    setProcessingIds(prev => new Set(prev).add(imageId))
    try {
      const response = await fetch('/api/photos/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, action: 'approve' })
      })

      if (response.ok) {
        setPendingImages(prev =>
          prev.map(img =>
            img.id === imageId ? { ...img, status: 'approved' } : img
          )
        )
      }
    } catch (error) {
      console.error('Failed to approve image:', error)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }

  const handleReject = async (imageId: string) => {
    setProcessingIds(prev => new Set(prev).add(imageId))
    try {
      const response = await fetch('/api/photos/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, action: 'reject' })
      })

      if (response.ok) {
        setPendingImages(prev =>
          prev.map(img =>
            img.id === imageId ? { ...img, status: 'rejected' } : img
          )
        )
      }
    } catch (error) {
      console.error('Failed to reject image:', error)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading images...</p>
        </div>
      </div>
    )
  }

  const pendingCount = pendingImages.filter(img => img.status === 'pending').length
  const approvedCount = pendingImages.filter(img => img.status === 'approved').length
  const rejectedCount = pendingImages.filter(img => img.status === 'rejected').length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Image Moderation</h1>
          <div className="flex gap-4">
            <Badge variant="secondary">
              Pending: {pendingCount}
            </Badge>
            <Badge variant="default">
              Approved: {approvedCount}
            </Badge>
            <Badge variant="destructive">
              Rejected: {rejectedCount}
            </Badge>
          </div>
        </div>

        {pendingImages.length === 0 ? (
          <Card className="p-8 text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No images to review</h3>
            <p className="text-muted-foreground">All uploaded images have been reviewed.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.fileName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={
                        image.status === 'approved' ? 'default' :
                        image.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {image.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm mb-2 truncate" title={image.fileName}>
                    {image.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(image.uploadedAt).toLocaleString()}
                  </p>

                  {image.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(image.id)}
                        disabled={processingIds.has(image.id)}
                        className="flex-1"
                      >
                        {processingIds.has(image.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(image.id)}
                        disabled={processingIds.has(image.id)}
                        className="flex-1"
                      >
                        {processingIds.has(image.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}

                  {image.status !== 'pending' && (
                    <div className="text-center text-sm text-muted-foreground">
                      {image.status === 'approved' ? 'Approved ✓' : 'Rejected ✗'}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}