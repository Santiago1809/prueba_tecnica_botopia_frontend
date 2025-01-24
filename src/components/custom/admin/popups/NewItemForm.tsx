import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";

interface NewItemFormProps {
  onSubmit: (formData: FormData) => void;
  itemType: string;
}

export function NewItemForm({ onSubmit, itemType }: NewItemFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Url", url);
    formData.append("ButtonText", buttonText);
    formData.append("Active", JSON.stringify(isActive));
    onSubmit(formData);
    setTitle("");
    setUrl("");
    setButtonText("");
    setIsActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-semibold">Añadir Nuevo {itemType}</h4>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto del Botón</Label>
        <Input
          id="buttonText"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Añadir {itemType}</Button>
    </form>
  );
}
