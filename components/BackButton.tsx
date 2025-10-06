"use client"

import type React from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  className?: string
  size?: "default" | "sm"
}

/**
 * A consistent back button component that uses browser history
 * for reliable navigation to the previous page
 */
const BackButton: React.FC<BackButtonProps> = ({ className, size = "default" }) => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleBack}
      className={cn(
        "text-gray-600 hover:text-gray-900",
        size === "sm" ? "mb-4" : "mb-6",
        "pl-0", // Remove left padding
        className,
      )}
    >
      <ArrowLeft size={size === "sm" ? 16 : 18} className="mr-2" />
      Back
    </Button>
  )
}

export default BackButton
