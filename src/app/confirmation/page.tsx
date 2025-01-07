import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">¡Pedido confirmado!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Gracias por tu compra. Tu pedido ha sido recibido y está siendo
            procesado.
          </p>
          <p className="text-center mb-4">
            Número de pedido: <strong>#12345</strong>
          </p>
          <p className="text-center">
            Te enviaremos un email con los detalles de tu pedido y la
            información de envío.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
