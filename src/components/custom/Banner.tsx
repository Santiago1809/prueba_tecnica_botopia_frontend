"use client";

import { getActiveBanners } from "@/actions/banners";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { BannerAndPopUp } from "@/types/banner";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Banners() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<BannerAndPopUp[]>([]);
  const { token } = useAuthStore();
  const autoPlayDelay = 5000; // Cambiar banner cada 5 segundos

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getActiveBanners(token);
      setBanners(res || []); // Asegura que siempre sea un arreglo
    };
    fetchBanners();
  }, [token]);

  useEffect(() => {
    // Configuración del temporizador para reproducción automática
    const timer = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, autoPlayDelay);

    return () => clearInterval(timer); // Limpia el intervalo al desmontar
  }, [banners]);

  const handleManualChange = (index: number) => {
    setCurrentBanner(index);
  };

  if (banners.length === 0) {
    return <div>Loading banners...</div>;
  }

  return (
    <section className="mb-12 relative">
      <Tabs
        value={currentBanner.toString()}
        onValueChange={(value) => handleManualChange(Number(value))}
        className="relative"
      >
        <div className="relative h-96 rounded-lg overflow-hidden">
          {banners.map((banner, index) => (
            <TabsContent
              key={banner.id}
              value={index.toString()}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={banner.Image.url || "/placeholder.svg"}
                alt={`Banner promocional: ${banner.Title}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {banner.Title}
                  </h2>
                  <Button>
                    <Link href={banner.Url} legacyBehavior>
                      <a className="block w-full h-full">{banner.ButtonText}</a>
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
        {/* Lista de Tabs para los Dots del Carrusel */}
        <TabsList className="absolute bottom-4 bg-transparent left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              onClick={() => handleManualChange(index)} // Permite cambiar manualmente
              className={`w-3 h-3 rounded-full ${
                index === currentBanner ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </TabsList>
      </Tabs>
    </section>
  );
}
