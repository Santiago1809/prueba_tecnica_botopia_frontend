"use server";
import { BACKEND_HOST } from "@/lib/constants";
import { BannerAndPopUp } from "@/types/banner";

export async function getBanners(token: string) {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/banners?populate[Image][fields][0]=url`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error fetching banners");
    }
    const { data } = await response.json();
    return data.map((banner: BannerAndPopUp) => {
      return {
        ...banner,
        Image: {
          url: `${BACKEND_HOST}${banner.Image.url}`,
        },
      };
    });
  } catch (error) {
    return [];
  }
}
