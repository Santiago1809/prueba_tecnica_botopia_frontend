"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createReview } from "@/actions/reviews";
import { useAuthStore } from "@/store/authStore";
import { Review } from "@/types/review";
import { useParams } from "next/navigation";

const reviewSchema = z.object({
  text: z
    .string()
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(500, "La reseña no puede exceder los 500 caracteres"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Props {
  setReviews: (reviews: Review[]) => void;
}

export default function ReviewForm({ setReviews }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const { token, user_id } = useAuthStore();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const reviews = await createReview(token, id as string, data.text, user_id);
      setReviews(reviews);
      form.reset();
      toast({
        title: "Reseña enviada",
        description: "Gracias por compartir tu opinión.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo enviar la reseña. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-bold">Tu reseña</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Comparte tu opinión sobre este producto..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar reseña"}
        </Button>
      </form>
    </Form>
  );
}
