"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const ShopDropdown: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center text-gray-600 hover:text-pink-500 transition-colors group">
          <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Shop
          </span>
          <ChevronDown
            size={14}
            className="ml-1 opacity-70 group-hover:translate-y-0.5 transition-transform duration-300"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 rounded-xl shadow-lg border-purple-600/10">
        <div className="py-2">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
          >
            Health Plans
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
          >
            Dental Coverage
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
          >
            Vision Insurance
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
          >
            TravelBird
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShopDropdown
