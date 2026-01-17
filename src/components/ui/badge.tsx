import type React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "warning" | "info"
}

export function Badge({ variant = "info", children, className = "", ...props }: BadgeProps) {
  const variantClasses = {
    success: "bg-green-50 text-green-700",
    danger: "bg-red-50 text-red-700",
    warning: "bg-yellow-50 text-yellow-700",
    info: "bg-blue-50 text-blue-700",
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
