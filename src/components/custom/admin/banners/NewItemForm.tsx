import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BannerAndPopUp } from "@/types/banner"
import { Upload } from "lucide-react"

interface NewItemFormProps {
  onSubmit: (newItem: Omit<BannerAndPopUp, "id" | "documentId">) => void
  itemType: string
}

export function NewItemForm({ onSubmit, itemType }: NewItemFormProps) {
  const [newItem, setNewItem] = useState<Omit<BannerAndPopUp, "id" | "documentId">>({
    Title: "",
    Url: "",
    ButtonText: "",
    Image: { id: 0, documentId: "", url: "" },
    Active: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newItem)
    setNewItem({
      Title: "",
      Url: "",
      ButtonText: "",
      Image: { id: 0, documentId: "", url: "" },
      Active: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          Image: {
            id: 0,
            documentId: "",
            url: reader.result as string,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-semibold">Añadir Nuevo {itemType}</h4>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={newItem.Title}
          onChange={(e) => setNewItem({ ...newItem, Title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={newItem.Url}
          onChange={(e) => setNewItem({ ...newItem, Url: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto del Botón</Label>
        <Input
          id="buttonText"
          value={newItem.ButtonText}
          onChange={(e) => setNewItem({ ...newItem, ButtonText: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Imagen</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Subir Imagen
          </Button>
          {newItem.Image.url && <span className="text-sm text-gray-500">Imagen seleccionada</span>}
        </div>
      </div>
      <Button type="submit">Añadir {itemType}</Button>
    </form>
  )
}

