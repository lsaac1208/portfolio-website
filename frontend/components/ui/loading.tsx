import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Loading({ className, size = "md", ...props }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loading size="md" />
    </div>
  )
}
