import { Button } from "@/components/ui/button";
import { MessageSquare, Truck, ShoppingBag, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SidebarProps = {
  setTopic: (topic: "delivery" | "recommendations" | "tracking" | null) => void;
  tone: "formal" | "friendly" | "technical";
  setTone: (tone: "formal" | "friendly" | "technical") => void;
};

export function Sidebar({ setTopic, tone, setTone }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Asistente Virtual</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Ajustar tono de respuesta</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium leading-none mb-2">
                Tono de respuesta
              </h4>
              <RadioGroup
                value={tone}
                onValueChange={(value) =>
                  setTone(value as "formal" | "friendly" | "technical")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="formal" id="formal" />
                  <Label htmlFor="formal">Formal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friendly" id="friendly" />
                  <Label htmlFor="friendly">Amigable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical" id="technical" />
                  <Label htmlFor="technical">Técnico</Label>
                </div>
              </RadioGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <nav className="space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTopic("delivery")}
        >
          <Truck className="mr-2 h-4 w-4" />
          Tiempo de entrega
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTopic("recommendations")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Recomendaciones
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTopic("tracking")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Seguimiento de órdenes
        </Button>
      </nav>
    </div>
  );
}
