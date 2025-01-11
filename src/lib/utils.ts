import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const CopFormatNumber = (price: number) => {
  const numberFormat = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'});
  return numberFormat.format(price);
}