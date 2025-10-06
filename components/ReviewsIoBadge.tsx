"use client"

import type React from "react"

const ReviewsIoBadge: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center mt-2 mb-4 relative z-30">
      <p className="text-xs text-gray-600 mb-1">Powered by</p>
      <a
        href="https://www.reviews.io/company-reviews/store/www.healthbird.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity duration-300"
        aria-label="Read HealthBird reviews on Reviews.io"
      >
        <img src="/images/reviews-io-logo.png" alt="Reviews.io" className="h-6 md:h-7" />
      </a>
    </div>
  )
}

export default ReviewsIoBadge
