"use server"
import { BACKEND_HOST } from "@/lib/constants";
import { PopUp } from "@/types/popup";

export async function getPopUps(token: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/pop-ups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error fetching PopUps");
    const { data } = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
export async function getActivePopUps(token: string) {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/pop-ups?filters[Active][$eq]=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Error fetching PopUps");
    const { data } = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function deletePopUp(token: string, id: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/pop-ups/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error fetching PopUps");
    const { data } = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
export async function savePopUp(token: string, item: FormData) {
  try {
    const Title = item.get("Title");
    const ButtonText = item.get("ButtonText");
    const Url = item.get("Url");
    const response = await fetch(`${BACKEND_HOST}/api/pop-ups`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          Title,
          ButtonText,
          Url,
        },
      }),
    });
    if (!response.ok) throw new Error("Error creating popup");
    return true;
  } catch (error) {
    console.log(error);
    
    return false;
  }
}
export async function updatePopUp(token: string, item: PopUp) {
  try {
    const Title = item.Title;
    const ButtonText = item.ButtonText;
    const Active = item.Active;
    const Url = item.Url;
    const response = await fetch(`${BACKEND_HOST}/api/pop-ups/${item.documentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          Title,
          ButtonText,
          Url,
          Active,
        },
      }),
    });
    if (!response.ok) throw new Error("Error creating popup");
    return true;
  } catch (error) {
    return false;
  }
}
