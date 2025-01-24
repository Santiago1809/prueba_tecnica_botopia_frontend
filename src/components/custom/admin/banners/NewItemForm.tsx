import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface NewItemFormProps {
  // Change the type definition if your submission handler expects a FormData
  onSubmit: (formData: FormData) => void
  itemType: string
}

export function NewItemForm({ onSubmit, itemType }: NewItemFormProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [buttonText, setButtonText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("Title", title)
    formData.append("Url", url)
    formData.append("ButtonText", buttonText)
    if (selectedFile) {
      formData.append("Image", selectedFile)
    }
    onSubmit(formData)
    setTitle("")
    setUrl("")
    setButtonText("")
    setSelectedFile(null)
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
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
          {previewUrl && (
            <span className="text-sm text-gray-500">Imagen seleccionada</span>
          )}
        </div>
      </div>
      <Button type="submit">Añadir {itemType}</Button>
    </form>
  )
}
