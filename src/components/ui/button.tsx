import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "font-semibold rounded transition-colors duration-200 flex items-center justify-center gap-2"

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-neutral-400",
    secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 disabled:bg-neutral-300",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-neutral-400",
    ghost: "bg-transparent text-primary hover:bg-blue-50 disabled:text-neutral-400",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? <span className="animate-spin">⏳</span> : null}
      {children}
    </button>
  )
}
