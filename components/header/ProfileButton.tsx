"use client"

import type React from "react"
import { User, LogOut, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfileButtonProps {
  displayName: string
  email?: string
  initials: string
  logout: () => void
  isMobile?: boolean
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ displayName, email, initials, logout, isMobile = false }) => {
  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-purple-600 hover:text-white overflow-hidden"
          >
            <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
            <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
            <Avatar className="h-7 w-7 relative z-10">
              <AvatarFallback className="bg-purple-600/10 text-purple-600 text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 rounded-xl shadow-lg border-purple-600/10">
          <div className="py-2 px-1">
            <div className="px-2 py-3 mb-1 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <div className="py-1">
              <a
                href="/profile"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
              >
                <User size={16} className="mr-2" />
                My Profile
              </a>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-pink-500/5 hover:text-pink-500 rounded-lg transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative group overflow-hidden rounded-full text-purple-600 hover:text-white transition-all duration-300 flex items-center px-5 py-2"
        >
          <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
          <Avatar className="h-7 w-7 mr-2 relative z-10">
            <AvatarFallback className="bg-purple-600/10 text-purple-600 text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
          <span className="relative z-10 font-medium">{displayName}</span>
          <ChevronDown
            size={14}
            className="ml-1 relative z-10 group-hover:scale-110 transition-transform duration-300"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 rounded-xl shadow-lg border-purple-600/10">
        <div className="py-2 px-1">
          <div className="px-2 py-3 mb-1 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          <div className="py-1">
            <a
              href="/profile"
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-600/5 hover:text-purple-600 rounded-lg transition-colors"
            >
              <User size={16} className="mr-2" />
              My Profile
            </a>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-pink-500/5 hover:text-pink-500 rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ProfileButton
