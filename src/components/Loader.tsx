export interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

export default function Loader({ size = "md" }: LoaderProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}
        role="status"
        aria-label="loading"
      />
    </div>
  )
}