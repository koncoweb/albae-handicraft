import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return `${window.location.origin}/placeholder.svg`;
  
  // Jika URL sudah lengkap (dimulai dengan http atau https), gunakan apa adanya
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Jika URL relatif, tambahkan origin
  return `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}
