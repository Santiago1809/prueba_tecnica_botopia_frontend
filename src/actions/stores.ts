'use server'

import { BACKEND_HOST } from "@/lib/constants";

export async function getStores(){
  const response = await fetch(
    `${BACKEND_HOST}/api/stores?populate[Products][fields][0]=id`
  );
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const { data } = await response.json();
  return data;
}