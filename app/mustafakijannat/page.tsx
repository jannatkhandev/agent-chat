"use client"

import { useState, useRef, useEffect } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Upload, Download, Image as ImageIcon, Camera, AlertCircle, X, FileImage, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import axios from "axios"

const EXPECTED_OTP = "170126"

// File Preview Component with Upload Progress
function FilePreviewCard({
  file,
  index,
  error,
  onRemove,
  formatFileSize,
  uploadProgress,
  uploadStatus,
  isUploading,
}: {
  file: File
  index: number
  error?: string
  onRemove: (index: number) => void
  formatFileSize: (bytes: number) => string
  uploadProgress?: number
  uploadStatus?: 'pending' | 'uploading' | 'uploaded' | 'error'
  isUploading?: boolean
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <Card className="relative overflow-hidden p-0">
      <div className="relative aspect-square">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`Preview ${index + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <FileImage className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {uploadStatus === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        {uploadStatus === 'uploaded' && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={() => onRemove(index)}
          disabled={uploadStatus === 'uploading'}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium truncate flex-1" title={file.name}>
            {file.name}
          </p>
          {uploadStatus === 'uploading' && uploadProgress !== undefined && (
            <span className="text-xs text-muted-foreground ml-2">
              {Math.round(uploadProgress)}%
            </span>
          )}
          {uploadStatus === 'uploaded' && (
            <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
        {uploadStatus === 'uploading' && uploadProgress !== undefined && (
          <Progress value={uploadProgress} className="h-2" />
        )}
        {error && (
          <Alert variant="destructive" className="py-1 px-2">
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  )
}

// Mock data - will be replaced with API data
const eventData = {
  name: "Mustafa ki Jannat",
  photoCount: 40,
  headerImage: "/hands.JPG",
  profileImage: "/profile.png",
}

interface GalleryPhoto {
  id: string
  url: string
  fileName: string
  uploadedAt: string
}

export default function Page() {
  const [otp, setOtp] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [isGetPhotosDialogOpen, setIsGetPhotosDialogOpen] = useState(false)
  const [isUploadPhotosDialogOpen, setIsUploadPhotosDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<Map<number, string>>(new Map())
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Map<number, number>>(new Map())
  const [uploadStatus, setUploadStatus] = useState<Map<number, 'pending' | 'uploading' | 'uploaded' | 'error'>>(new Map())
  const [currentUploadIndex, setCurrentUploadIndex] = useState<number>(-1)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Fetch approved photos when component mounts or when verified
  useEffect(() => {
    if (isVerified) {
      fetchGalleryPhotos()
    }
  }, [isVerified])

  const fetchGalleryPhotos = async () => {
    try {
      setLoadingPhotos(true)
      const response = await fetch('/api/photos/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Failed to fetch gallery photos:', error)
    } finally {
      setLoadingPhotos(false)
    }
  }

  const handleOtpChange = (value: string) => {
    setOtp(value)
    if (value === EXPECTED_OTP) {
      setIsVerified(true)
    }
  }

  // Handle camera access
  const startCamera = async () => {
    try {
      setCameraError(null)
      setIsLoadingCamera(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", // Front-facing camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false,
      })
      
      streamRef.current = stream
      
      // Wait a bit for the video element to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              setIsCameraActive(true)
              setIsLoadingCamera(false)
            })
            .catch((err) => {
              console.error("Error playing video:", err)
              setCameraError("Failed to play video stream")
              setIsLoadingCamera(false)
            })
        }
      } else {
        setIsLoadingCamera(false)
        setCameraError("Video element not found")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError(
        error instanceof Error
          ? error.message
          : "Failed to access camera. Please check permissions."
      )
      setIsCameraActive(false)
      setIsLoadingCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const photoDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(photoDataUrl)
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setCapturedPhoto(null)
    startCamera()
  }

  // Cleanup camera on unmount or dialog close
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Handle video element updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      console.log("Video started playing")
      setIsCameraActive(true)
      setIsLoadingCamera(false)
    }

    const handleError = (e: ErrorEvent) => {
      console.error("Video error:", e)
      setCameraError("Video playback error")
      setIsLoadingCamera(false)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("error", handleError)
    }
  }, [isCameraActive])

  const handleDialogOpenChange = (open: boolean) => {
    setIsGetPhotosDialogOpen(open)
    if (!open) {
      stopCamera()
      setCapturedPhoto(null)
      setName("")
      setEmail("")
      setCameraError(null)
      setIsLoadingCamera(false)
    }
    // Don't auto-start camera - let user click the button
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/photos/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          facePhoto: capturedPhoto, // Base64 encoded image
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      // Success - close dialog and show success message
      handleDialogOpenChange(false)
      // You can add a toast notification here
      console.log('Form submitted successfully:', data)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Allowed image formats
  const ALLOWED_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/webp',
  ]
  const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3 MB in bytes
  const MAX_FILES = 5

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
      // Also check by extension for HEIC/HEIF which might not have proper MIME type
      const extension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp']
      if (!extension || !allowedExtensions.includes(extension)) {
        return `File format not supported. Allowed: JPG, JPEG, PNG, HEIC, HEIF, WEBP`
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 3 MB limit (${formatFileSize(file.size)})`
    }

    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const errors = new Map<number, string>()
    const validFiles: File[] = []

    // Check total file count first
    const totalFiles = selectedFiles.length + files.length
    if (totalFiles > MAX_FILES) {
      const excess = totalFiles - MAX_FILES
      setFileErrors(new Map([[0, `Maximum ${MAX_FILES} files allowed. Please remove ${excess} file(s) first.`]]))
      e.target.value = ''
      return
    }

    files.forEach((file, index) => {
      const error = validateFile(file)
      if (error) {
        errors.set(selectedFiles.length + index, error)
      } else {
        validFiles.push(file)
      }
    })

    // Only add valid files, keep existing errors for existing files
    const newFiles = [...selectedFiles, ...validFiles]
    const newErrors = new Map<number, string>()
    
    // Re-index errors for existing files
    fileErrors.forEach((error, oldIndex) => {
      if (oldIndex < selectedFiles.length) {
        newErrors.set(oldIndex, error)
      }
    })
    
    // Add new errors
    errors.forEach((error, index) => {
      newErrors.set(selectedFiles.length + index, error)
    })

    setSelectedFiles(newFiles)
    setFileErrors(newErrors)
    
    // Initialize upload status for new files
    const newStatus = new Map(uploadStatus)
    validFiles.forEach((_, index) => {
      newStatus.set(selectedFiles.length + index, 'pending')
    })
    setUploadStatus(newStatus)
    
    // Reset input
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    
    // Re-index errors after removal
    const newErrors = new Map<number, string>()
    fileErrors.forEach((error, oldIndex) => {
      if (oldIndex < index) {
        // Keep errors before removed index
        newErrors.set(oldIndex, error)
      } else if (oldIndex > index) {
        // Shift errors after removed index
        newErrors.set(oldIndex - 1, error)
      }
      // Skip error at removed index
    })
    setFileErrors(newErrors)
    
    // Re-index upload status and progress
    const newStatus = new Map<number, 'pending' | 'uploading' | 'uploaded' | 'error'>()
    const newProgress = new Map<number, number>()
    uploadStatus.forEach((status, oldIndex) => {
      if (oldIndex < index) {
        newStatus.set(oldIndex, status)
      } else if (oldIndex > index) {
        newStatus.set(oldIndex - 1, status)
      }
    })
    uploadProgress.forEach((progress, oldIndex) => {
      if (oldIndex < index) {
        newProgress.set(oldIndex, progress)
      } else if (oldIndex > index) {
        newProgress.set(oldIndex - 1, progress)
      }
    })
    setUploadStatus(newStatus)
    setUploadProgress(newProgress)
  }

  const handleUploadDialogOpenChange = (open: boolean) => {
    setIsUploadPhotosDialogOpen(open)
    if (!open) {
      // Cleanup object URLs to prevent memory leaks
      selectedFiles.forEach(() => {
        // URLs are revoked in the onLoad handler, but revoke any remaining
      })
      setSelectedFiles([])
      setFileErrors(new Map())
      setIsDragging(false)
      setUploadProgress(new Map())
      setUploadStatus(new Map())
      setCurrentUploadIndex(-1)
    }
  }

  const CHUNK_SIZE = 10 * 1024 * 1024 // 10 MB chunks
  const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME || 'fotofi-photos'

  const uploadFile = async (file: File, fileIndex: number) => {
    // Generate object name with timestamp
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    setUploadStatus(prev => new Map(prev).set(fileIndex, 'uploading'))
    setCurrentUploadIndex(fileIndex)

    try {
      // Create multipart upload
      const createResponse = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileType: file.type,
          bucketName: BUCKET_NAME,
        }),
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create upload session')
      }

      const { uploadId } = await createResponse.json()
      const chunks = Math.ceil(file.size / CHUNK_SIZE)
      const parts = []

      // Upload each chunk
      for (let i = 0; i < chunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        // Get signed URL for this part
        const urlResponse = await axios.post('/api/photos/upload', {
          fileName,
          partNumber: i + 1,
          uploadId,
          bucketName: BUCKET_NAME,
        })

        const { signedUrl } = urlResponse.data

        // Convert chunk to ArrayBuffer (works in browser)
        const arrayBuffer = await chunk.arrayBuffer()

        // Upload chunk with progress tracking
        await axios.put(signedUrl, arrayBuffer, {
          headers: { 'Content-Type': 'application/octet-stream' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const chunkProgress = (progressEvent.loaded / progressEvent.total) * 100
              const overallProgress = ((i + chunkProgress / 100) / chunks) * 100
              setUploadProgress(prev => new Map(prev).set(fileIndex, overallProgress))
            }
          },
        })

        // Get ETag for this part
        const etagResponse = await axios.post('/api/photos/upload', {
          fileName,
          uploadId,
          partNumber: i + 1,
          bucketName: BUCKET_NAME,
          action: 'getETag',
        })

        const etag = etagResponse.data.ETag
        if (!etag) {
          throw new Error(`ETag not received for part ${i + 1}`)
        }

        parts.push({
          PartNumber: i + 1,
          ETag: etag.replace(/^"|"$/g, ''), // Remove quotes if present
        })
      }

      // Complete multipart upload
      const completeResponse = await fetch('/api/photos/upload', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          uploadId,
          parts: parts.map(part => ({
            ETag: part.ETag,
            PartNumber: part.PartNumber,
          })),
          bucketName: BUCKET_NAME,
        }),
      })

      if (!completeResponse.ok) {
        throw new Error('Failed to complete upload')
      }

      const result = await completeResponse.json()
      setUploadProgress(prev => new Map(prev).set(fileIndex, 100))
      setUploadStatus(prev => new Map(prev).set(fileIndex, 'uploaded'))
      
      return result
    } catch (error) {
      console.error(`Error uploading file ${fileIndex}:`, error)
      setUploadStatus(prev => new Map(prev).set(fileIndex, 'error'))
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file')
      throw error
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)

    // Initialize upload status for all files
    const initialStatus = new Map<number, 'pending' | 'uploading' | 'uploaded' | 'error'>()
    selectedFiles.forEach((_, index) => {
      initialStatus.set(index, 'pending')
    })
    setUploadStatus(initialStatus)

    try {
      // Upload files sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadFile(selectedFiles[i], i)
      }

      // All files uploaded successfully
      console.log('All files uploaded successfully')
      // Refresh gallery to potentially show newly approved images
      fetchGalleryPhotos()
    } catch (error) {
      console.error('Error uploading files:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload files')
    } finally {
      setIsUploading(false)
      setCurrentUploadIndex(-1)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (selectedFiles.length >= MAX_FILES) {
      setFileErrors(new Map([[0, `Maximum ${MAX_FILES} files allowed. Please remove files first.`]]))
      return
    }

    const files = Array.from(e.dataTransfer.files)
    const errors = new Map<number, string>()
    const validFiles: File[] = []

    // Check total file count
    const totalFiles = selectedFiles.length + files.length
    if (totalFiles > MAX_FILES) {
      const excess = totalFiles - MAX_FILES
      setFileErrors(new Map([[0, `Maximum ${MAX_FILES} files allowed. Please remove ${excess} file(s) first.`]]))
      return
    }

    files.forEach((file, index) => {
      const error = validateFile(file)
      if (error) {
        errors.set(selectedFiles.length + index, error)
      } else {
        validFiles.push(file)
      }
    })

    // Re-index errors
    const newFiles = [...selectedFiles, ...validFiles]
    const newErrors = new Map<number, string>()
    
    fileErrors.forEach((error, oldIndex) => {
      if (oldIndex < selectedFiles.length) {
        newErrors.set(oldIndex, error)
      }
    })
    
    errors.forEach((error, index) => {
      newErrors.set(selectedFiles.length + index, error)
    })

    setSelectedFiles(newFiles)
    setFileErrors(newErrors)
  }

  if (!isVerified) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 animate-pulse" style={{
              filter: 'hue-rotate(0deg)',
              animation: 'hue-rotate 3s linear infinite'
            }}>
              <Image
                src="/MJ.svg"
                alt="MJ Logo"
                width={96}
                height={96}
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold">Enter Access Code</h2>
          </div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <style jsx>{`
          @keyframes hue-rotate {
            0% { filter: hue-rotate(0deg) brightness(1.1); }
            25% { filter: hue-rotate(90deg) brightness(1.2); }
            50% { filter: hue-rotate(180deg) brightness(1.1); }
            75% { filter: hue-rotate(270deg) brightness(1.2); }
            100% { filter: hue-rotate(360deg) brightness(1.1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Background Image */}
      <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={eventData.headerImage}
            alt="Event header"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6 lg:p-8">
          <div className="flex items-end gap-3 md:gap-4 lg:gap-6">
            {/* Circular Profile Image - Overlapping the header */}
            <div className="relative shrink-0 -mb-8 md:-mb-12 lg:-mb-16">
              <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-muted">
                <Image
                  src={eventData.profileImage}
                  alt="Event profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1 pb-4 md:pb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
                {eventData.name}
              </h1>
              <p className="text-white/90 text-xs md:text-sm lg:text-base mb-3 md:mb-4 drop-shadow">
                {galleryPhotos.length} photos, videos & posts
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg text-sm md:text-base"
                  onClick={() => setIsUploadPhotosDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload your photos
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-sm md:text-base"
                  onClick={() => setIsGetPhotosDialogOpen(true)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Get your photos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12">
        <h2 className="text-2xl font-semibold mb-6">Gallery</h2>

        {loadingPhotos ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading photos...</span>
          </div>
        ) : galleryPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryPhotos.map((photo) => (
              <Card
                key={photo.id}
                className="group cursor-pointer overflow-hidden p-0 aspect-square hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-full bg-muted">
                  <Image
                    src={photo.url}
                    alt={photo.fileName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your memories from this event!
                </p>
                <Button size="lg" onClick={() => setIsUploadPhotosDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload your photos
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Get Your Photos Dialog */}
      <Dialog open={isGetPhotosDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get Your Photos</DialogTitle>
            <DialogDescription>
              Please provide your information and take a photo so we can find your photos in the gallery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Face Photo Section */}
            <div className="space-y-2">
              <Label>Face Photo</Label>
              <div className="space-y-4">
                {!capturedPhoto ? (
                  <div className="space-y-3">
                    {!isCameraActive && !isLoadingCamera && !cameraError && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        className="w-full"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    )}

                    {isLoadingCamera && (
                      <Card className="p-8">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Starting camera...</p>
                        </div>
                      </Card>
                    )}

                    {cameraError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Error</AlertTitle>
                        <AlertDescription>
                          <p className="mb-3">{cameraError}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                          >
                            Try Again
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    {(isCameraActive || isLoadingCamera) && (
                      <Card className="p-0 overflow-hidden">
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover bg-black"
                            style={{ transform: 'scaleX(-1)' }}
                            onLoadedData={() => {
                              console.log("Video data loaded")
                              if (videoRef.current) {
                                videoRef.current.play().catch(console.error)
                              }
                            }}
                            onCanPlay={() => {
                              console.log("Video can play")
                            }}
                          />
                          {/* Face Scanning Overlay - only show when camera is active */}
                          {isCameraActive && (
                          <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Scanning Grid */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="h-full w-full" style={{
                                backgroundImage: `
                                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px'
                              }} />
                            </div>
                            
                            {/* Scanning Line Animation */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div className="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-scan-line" />
                            </div>

                            {/* Corner Indicators */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary animate-pulse" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary animate-pulse" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary animate-pulse" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary animate-pulse" />

                            {/* Scanning Status Text */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                              <div className="flex items-center gap-2 text-white text-sm">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="font-medium">Scanning face...</span>
                              </div>
                            </div>
                          </div>
                          )}
                        </div>
                        {isCameraActive && (
                        <div className="flex gap-2 p-4">
                          <Button
                            type="button"
                            onClick={capturePhoto}
                            className="flex-1"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Capture Photo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={stopCamera}
                          >
                            Stop Camera
                          </Button>
                        </div>
                        )}
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="p-0 overflow-hidden">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={capturedPhoto}
                        alt="Captured face"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={retakePhoto}
                        className="w-full"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Retake Photo
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name || !email || !capturedPhoto || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Your Photos Dialog */}
      <Dialog open={isUploadPhotosDialogOpen} onOpenChange={handleUploadDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Your Photos</DialogTitle>
            <DialogDescription>
              Select up to 5 photos to upload. Maximum file size: 3 MB per file. Supported formats: JPG, JPEG, PNG, HEIC, HEIF, WEBP
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select Photos</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/50 hover:bg-muted'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Up to {MAX_FILES} files, max 3 MB each
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,.jpg,.jpeg,.png,.heic,.heif,.webp"
                    onChange={handleFileSelect}
                    disabled={selectedFiles.length >= MAX_FILES}
                  />
                </label>
              </div>
              {selectedFiles.length >= MAX_FILES && (
                <p className="text-sm text-muted-foreground">
                  Maximum {MAX_FILES} files selected. Remove a file to add more.
                </p>
              )}
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Photos ({selectedFiles.length}/{MAX_FILES})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <FilePreviewCard
                      key={`${file.name}-${file.size}-${index}`}
                      file={file}
                      index={index}
                      error={fileErrors.get(index)}
                      onRemove={removeFile}
                      formatFileSize={formatFileSize}
                      uploadProgress={uploadProgress.get(index)}
                      uploadStatus={uploadStatus.get(index) || 'pending'}
                      isUploading={currentUploadIndex === index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Global Errors - show if there are errors but no files selected yet */}
            {fileErrors.size > 0 && selectedFiles.length === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>File Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Array.from(fileErrors.values()).map((error, idx) => (
                      <li key={idx} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleUploadDialogOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={selectedFiles.length === 0 || fileErrors.size > 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentUploadIndex >= 0 && currentUploadIndex < selectedFiles.length
                      ? `Uploading ${currentUploadIndex + 1}/${selectedFiles.length}...`
                      : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}