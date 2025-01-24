"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BannerAndPopUp } from "@/types/banner";
import { getBanners } from "@/actions/banners";
import { useAuthStore } from "@/store/authStore";

export default function Banners() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<BannerAndPopUp[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getBanners(token);
      setBanners(res || []); // Ensure it's always an array
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    // Only set up interval if banners exist
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [banners]);

  // Add a loading or empty state
  if (banners.length === 0) {
    return <div>Loading banners...</div>;
  }

  return (
    <section className="mb-12 relative">
      <div className="relative h-96 rounded-lg overflow-hidden">
        {banners &&
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={index !== currentBanner}
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
                  <Button asChild>
                    <Link href={banner.Url}>{banner.ButtonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentBanner ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentBanner(index)}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
