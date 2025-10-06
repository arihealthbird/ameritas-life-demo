"use client"

import type React from "react"
import { Star } from "lucide-react"

interface CarrierLogoProps {
  carrier: string
  rating?: number
}

const CarrierLogo: React.FC<CarrierLogoProps> = ({ carrier, rating }) => {
  // Get carrier initials for fallback
  const getCarrierInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const initials = getCarrierInitials(carrier)

  return (
    <div className="flex items-center gap-3 mb-3">
      {/* Logo or initials */}
      <div className="w-10 h-10 bg-healthbird-purple/10 rounded-md flex items-center justify-center">
        <span className="text-healthbird-purple font-semibold">{initials}</span>
      </div>

      <div>
        <h3 className="font-medium text-healthbird-gray-900">{carrier}</h3>
        {rating && (
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={`${
                  star <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
            <span className="text-xs ml-1">{rating}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarrierLogo
