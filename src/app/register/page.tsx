"use client";

import { register } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z
  .object({
    display_name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(70, "El nombre no puede exceder los 70 caracteres"),
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(15, "el nombre de usuario no puede exceder los 15 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    setName,
    setAuth,
    setIsLoggedIn,
    setToken,
    isLoggedIn,
    setEmail,
    setId,
    setUserName,
  } = useAuthStore();
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  });

  const [error, registerAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      const res = await register(prevState, formData);

      if (res?.error) {
        return res.error;
      }

      if (!res?.jwt || !res?.userData) {
        return "Error en el proceso de registro";
      }

      setIsLoggedIn(true);
      setToken(res?.jwt);
      setAuth(res?.userData?.user_role === "ADMIN");
      setName(res?.userData?.display_name);
      setEmail(res?.userData?.email);
      setUserName(res?.userData?.username);
      setId(res?.userData?.id);

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada!",
      });

      router.push("/");
      return null;
    },
    null
  );

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Crear una cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte en nuestra plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              action={registerAction}
              className="space-y-6"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john_doe" />
                    </FormControl>
                    <FormDescription>
                      Este será tu identificador único como usuario
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Usaremos este correo para enviarte información importante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Usa al menos 8 caracteres con una combinación de letras,
                      números y símbolos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Registrando..." : "Registrarse"}
              </Button>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
