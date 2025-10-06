"use client"

import { useEffect, useState } from "react"
import { useAuthModal } from "@/hooks/use-auth-modal"
import AuthModal from "./AuthModal"

export const AuthModalProvider = () => {
  const { isOpen, view, onClose } = useAuthModal()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <AuthModal isOpen={isOpen} onClose={onClose} initialView={view} />
}
