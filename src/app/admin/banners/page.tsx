"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const initialBanners = [
  { id: 1, title: "Oferta de Verano", active: true },
  { id: 2, title: "Descuento en Electrónicos", active: false },
]

const initialPopups = [
  { id: 1, title: "Suscríbete al Newsletter", active: true },
  { id: 2, title: "Encuesta de Satisfacción", active: false },
]

export default function BannersAndPopupsPage() {
  const [banners, setBanners] = useState(initialBanners)
  const [popups, setPopups] = useState(initialPopups)
  const [newBanner, setNewBanner] = useState({ title: "", content: "" })
  const [newPopup, setNewPopup] = useState({ title: "", content: "" })

  const handleBannerToggle = (id: number) => {
    setBanners(banners.map(banner =>
      banner.id === id ? { ...banner, active: !banner.active } : banner
    ))
  }

  const handlePopupToggle = (id: number) => {
    setPopups(popups.map(popup =>
      popup.id === id ? { ...popup, active: !popup.active } : popup
    ))
  }

  const handleNewBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBanners([...banners, { id: Date.now(), title: newBanner.title, active: true }])
    setNewBanner({ title: "", content: "" })
  }

  const handleNewPopupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPopups([...popups, { id: Date.now(), title: newPopup.title, active: true }])
    setNewPopup({ title: "", content: "" })
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Banners y Pop-ups</h2>
      
      <div>
        <h3 className="text-2xl font-semibold mb-4">Banners</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.title}</TableCell>
                <TableCell>
                  <Switch
                    checked={banner.active}
                    onCheckedChange={() => handleBannerToggle(banner.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <form onSubmit={handleNewBannerSubmit} className="mt-4 space-y-4">
          <h4 className="text-lg font-semibold">Añadir Nuevo Banner</h4>
          <div>
            <Label htmlFor="bannerTitle">Título</Label>
            <Input
              id="bannerTitle"
              value={newBanner.title}
              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="bannerContent">Contenido</Label>
            <Textarea
              id="bannerContent"
              value={newBanner.content}
              onChange={(e) => setNewBanner({ ...newBanner, content: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Añadir Banner</Button>
        </form>
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold mb-4">Pop-ups</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popups.map((popup) => (
              <TableRow key={popup.id}>
                <TableCell>{popup.title}</TableCell>
                <TableCell>
                  <Switch
                    checked={popup.active}
                    onCheckedChange={() => handlePopupToggle(popup.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <form onSubmit={handleNewPopupSubmit} className="mt-4 space-y-4">
          <h4 className="text-lg font-semibold">Añadir Nuevo Pop-up</h4>
          <div>
            <Label htmlFor="popupTitle">Título</Label>
            <Input
              id="popupTitle"
              value={newPopup.title}
              onChange={(e) => setNewPopup({ ...newPopup, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="popupContent">Contenido</Label>
            <Textarea
              id="popupContent"
              value={newPopup.content}
              onChange={(e) => setNewPopup({ ...newPopup, content: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Añadir Pop-up</Button>
        </form>
      </div>
    </div>
  )
}

