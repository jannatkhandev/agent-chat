import { Button } from "@/components/ui/button"
import { Camera, Image as ImageIcon, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
          {/* Logo/Icon */}
          <div className="flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
            <Camera className="w-12 h-12 text-primary" />
          </div>
          
          {/* Headings */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">Fotofi</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Share and collect photos from your events
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              Create beautiful galleries for your events. Guests can upload their photos and easily access all memories in one place.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/mustafakijannat">
                <ImageIcon className="mr-2 h-5 w-5" />
                View Example Gallery
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Event
              </Link>
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Easy Upload</h3>
              <p className="text-sm text-muted-foreground text-center">
                Guests can easily upload photos directly from their devices
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Beautiful Galleries</h3>
              <p className="text-sm text-muted-foreground text-center">
                Organize and display photos in stunning gallery layouts
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Secure Access</h3>
              <p className="text-sm text-muted-foreground text-center">
                Protected galleries with passcode access for privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
