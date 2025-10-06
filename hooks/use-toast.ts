"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Toast = Omit<ToasterToast, "id">

type ToastActionType = (props: Toast) => void

type ToastState = {
  toasts: ToasterToast[]
  toast: ToastActionType
  dismiss: (toastId?: string) => void
}

const toastState: ToastState = {
  toasts: [],
  toast: () => {},
  dismiss: () => {},
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  useEffect(() => {
    toastState.toasts = toasts
    toastState.toast = (props) => {
      const id = genId()
      const newToast = { id, ...props }
      setToasts((prevToasts) => [...prevToasts, newToast])

      setTimeout(() => {
        toastState.dismiss(id)
      }, 5000)
    }
    toastState.dismiss = (toastId) => {
      setToasts((prevToasts) => {
        if (toastId) {
          return prevToasts.filter((toast) => toast.id !== toastId)
        }
        return []
      })
    }
  }, [toasts])

  return toastState
}
