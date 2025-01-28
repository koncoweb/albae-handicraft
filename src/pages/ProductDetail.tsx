import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Product not found");
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product. Please try again later.",
      });
      navigate("/products");
    }
  }, [error, navigate, toast]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.featured_image);
      document.title = `${product.nama} - Albae Handicraft`;
      // Update meta description for SEO
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${product.nama} - ${product.description}`
        );
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">Product not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img
              src={selectedImage || product.featured_image}
              alt={product.nama}
              className="w-full rounded-lg object-cover aspect-square"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to load image",
                });
              }}
            />
            <div className="grid grid-cols-4 gap-2">
              <div 
                className={`cursor-pointer p-1 rounded-lg ${selectedImage === product.featured_image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedImage(product.featured_image)}
              >
                <img
                  src={product.featured_image}
                  alt={`${product.nama} - Featured`}
                  className="w-full h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              {product.image_gallery?.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-1 rounded-lg ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.nama} - Gambar ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{product.nama}</h1>
            <p className="text-2xl font-semibold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-foreground">Deskripsi</h2>
              <p className="text-muted-foreground">{product.description}</p>
              <h2 className="text-xl font-semibold text-foreground">Material</h2>
              <p className="text-muted-foreground">{product.material}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}