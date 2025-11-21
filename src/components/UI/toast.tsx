/**
 * Toast Component
 * 
 * Simple toast notification component following shadcn/ui pattern.
 * Used for success feedback after profile creation.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  message: string
  variant?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Wait for fade-out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const variantStyles = {
    success: "bg-success text-success-foreground border-success",
    error: "bg-destructive text-destructive-foreground border-destructive",
    warning: "bg-warning text-warning-foreground border-warning",
    info: "bg-info text-info-foreground border-info",
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 rounded-md border p-4 shadow-lg transition-opacity duration-300",
        variantStyles[variant],
        isVisible ? "opacity-100" : "opacity-0"
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

/**
 * Toast Hook
 * 
 * Manages toast state and rendering
 */
export const useToast = () => {
  const [toast, setToast] = React.useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast(props)
  }

  const ToastContainer = () => {
    if (!toast) return null

    return (
      <Toast
        {...toast}
        onClose={() => {
          toast.onClose?.()
          setToast(null)
        }}
      />
    )
  }

  return { showToast, ToastContainer }
}

