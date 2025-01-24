"use server";
import { BACKEND_HOST } from "@/lib/constants";
import { Banner } from "@/types/banner";

export async function getActiveBanners(token: string) {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/banners?populate[Image][fields][0]=url&filters[Active][$eq]=true`,
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
    return data.map((banner: Banner) => {
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
    return data.map((banner: Banner) => {
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

export async function saveBanner(token: string, banner: FormData) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/banners/create-banner`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: banner,
    });
    if (!response.ok) {
      throw new Error("Error saving banner");
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function updateBanner(token: String, banner: Partial<Banner>) {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/banners/${banner.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            Title: banner.Title,
            Url: banner.Url,
            ButtonText: banner.ButtonText,
            Active: banner.Active,
          },
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Error updating banner");
    }
    return true;
  } catch (error) {
    return false;
  }
}
export async function deleteBanner(token: string, documentId: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/banners/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error deleting banner");
    }
    return true;
  } catch (error) {
    return false;
  }
}
