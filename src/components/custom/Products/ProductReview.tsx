import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { Review } from "@/types/review"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
  review: Review
}

export default function ProductReview({ review }: Props) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.user.display_name}`}
              alt={`Avatar de ${review.user.display_name}`}
            />
            <AvatarFallback>{review.user.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">{review.user.display_name}</h4>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
              </time>
            </div>
            <p className="text-sm text-gray-700 mt-2">{review.Text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

