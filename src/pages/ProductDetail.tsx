import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getFullImageUrl } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

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
        description: "Failed to load product",
      });
      navigate("/products");
    }
  }, [error, navigate, toast]);

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Generate meta description dari data produk
  const metaDescription = `${product.nama} - ${product.description.slice(0, 150)}...`;
  
  // Prepare images array with featured_image and image_gallery
  const productImages = [product.featured_image, ...(product.image_gallery || [])].filter(Boolean);
  const mainImage = getFullImageUrl(productImages[selectedImage]);
  const currentUrl = window.location.href;

  // Prepare structured data for product
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nama,
    "description": product.description,
    "image": productImages.map(getFullImageUrl),
    "offers": {
      "@type": "Offer",
      "url": currentUrl,
      "priceCurrency": "IDR",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "brand": {
      "@type": "Brand",
      "name": "Albae Handicraft"
    },
    "category": product.category,
    "material": product.material
  };

  // Prepare breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produk",
        "item": `${window.location.origin}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.nama,
        "item": currentUrl
      }
    ]
  };

  // Format price for meta tags
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <Layout>
      <Helmet>
        <title>{product.nama} | Albae Handicraft</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.nama}, kerajinan tangan, handicraft, ${product.category}, ${product.material}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Albae Handicraft" />
        <meta property="og:title" content={`${product.nama} | Albae Handicraft`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:image:alt" content={product.nama} />
        <meta property="og:url" content={currentUrl} />
        <meta property="product:brand" content="Albae Handicraft" />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="IDR" />
        <meta property="product:category" content={product.category} />
        <meta property="product:retailer_item_id" content={product.id} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@albaehandicraft" />
        <meta name="twitter:title" content={`${product.nama} | Albae Handicraft`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={mainImage} />
        <meta name="twitter:image:alt" content={product.nama} />
        <meta name="twitter:label1" content="Harga" />
        <meta name="twitter:data1" content={formattedPrice} />
        <meta name="twitter:label2" content="Kategori" />
        <meta name="twitter:data2" content={product.category} />
        
        <link rel="canonical" href={currentUrl} />
        
        {/* Structured Data / JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify([productStructuredData, breadcrumbStructuredData])}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
              <img
                src={mainImage}
                alt={`${product.nama} - Gambar Utama`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={getFullImageUrl(image)}
                    alt={`${product.nama} - Gambar ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{product.nama}</h1>
              <p className="text-2xl font-semibold text-primary mt-2">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Deskripsi</h2>
                <p className="text-muted-foreground mt-2">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">Material</h2>
                <p className="text-muted-foreground mt-2">{product.material}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">Kategori</h2>
                <p className="text-muted-foreground mt-2">{product.category}</p>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Hubungi Kami
            </Button>
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