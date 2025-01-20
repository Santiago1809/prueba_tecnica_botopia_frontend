"use client";

import { login } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useActionState, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

const loginSchema = z.object({
  identifier: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    setIsLoggedIn,
    setToken,
    setAuth,
    setName,
    isLoggedIn,
    setEmail,
    setUserName,
    setId,
  } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.back();
    }
  }, []);

  const [error, formAction, isPending] = useActionState(
    async (prevState: unknown, queryData: FormData) => {
      const res = await login(prevState, queryData);
      if (!res) {
        return "Error al iniciar sesión. Por favor, verifica tus credenciales.";
      }

      setIsLoggedIn(true);
      setToken(res?.jwt);
      setAuth(res?.user?.user_role === "ADMIN");
      setName(res?.user?.display_name);
      setEmail(res?.user?.email);
      setUserName(res?.user?.username);
      setId(res?.user?.id);
      router.back();
      return null;
    },
    null
  );

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-6" autoComplete="off">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="tu@ejemplo.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Ingresa el correo electrónico asociado a tu cuenta.
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
                      Ingresa tu contraseña. Debe tener al menos 8 caracteres.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
