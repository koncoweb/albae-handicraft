export interface Product {
  id: string;
  nama: string;
  slug: string;
  category: string;
  price: number;
  material: string;
  description: string;
  active: boolean;
  featured_image: string;
  image_gallery?: string[];
  created_at?: string;
  updated_at?: string;
}