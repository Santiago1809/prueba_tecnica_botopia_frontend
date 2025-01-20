import { login } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { User } from "lucide-react";
import Link from "next/link";
import { useState, useActionState } from "react";

export default function Login() {
  const { setIsLoggedIn, setToken, setAuth, setName, setEmail, setUserName, setId } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [_state, formAction, isPending] = useActionState(
    async (prevState: unknown, queryData: FormData) => {
      const res = await login(prevState, queryData);
      if (!res) {
        return "Credenciales incorrectas";
      } else {
        setIsLoggedIn(true);
        setToken(res?.jwt);
        setAuth(res?.user?.user_role === "ADMIN");
        setName(res?.user?.display_name);
        setEmail(res?.user?.email);
        setUserName(res?.user?.username);
        setId(res?.user?.id);
        setIsOpen(false);
      }
    },
    null
  );

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)} >
          <User className="size-5" />
          <span className="sr-only">Usuario</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inicio de sesión</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          autoComplete="off"
          action={formAction}
        >
          {_state && <p className="text-red-500 text-sm">{_state}</p>}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="identifier" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" name="password" />
          </div>
          <Button className="w-full" disabled={isPending}>
            Iniciar sesión
          </Button>
          <span className="text-center text-sm">
            No tiene cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline" onClick={() => setIsOpen(false)}>
              Registrese
            </Link>
          </span>
        </form>
      </DialogContent>
    </Dialog>
  );
}
