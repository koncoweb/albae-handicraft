import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getFullImageUrl } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
    gcTime: 1000 * 60 * 30, // Data disimpan di garbage collection selama 30 menit
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  // Generate meta description dari data produk
  const metaDescription = `${product.nama} - ${product.description.slice(0, 150)}...`;
  const productImages = (product.image_gallery || [product.featured_image]).map(getFullImageUrl);
  const mainImage = getFullImageUrl(product.featured_image);

  return (
    <Layout>
      <Helmet>
        <title>{product.nama} | Albae Handicraft</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.nama}, kerajinan tangan, handicraft, ${product.material}`} />
        <meta property="og:title" content={`${product.nama} | Albae Handicraft`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={mainImage} />
        <meta property="og:image:alt" content={product.nama} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.nama} | Albae Handicraft`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={mainImage} />
        <meta name="twitter:image:alt" content={product.nama} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="IDR" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
              <img
                src={productImages[selectedImage]}
                alt={`${product.nama} - Gambar Utama`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.nama} - Gambar ${index + 1}`}
                    className="w-full h-full object-cover"
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

const getProduct = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Product not found");
  return data;
};