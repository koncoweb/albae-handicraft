import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { getFullImageUrl } from "@/lib/utils";

// Fungsi untuk mengambil data produk
async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");

  // Menggunakan prefetchQuery untuk data produk
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
    gcTime: 1000 * 60 * 30, // Data disimpan di garbage collection selama 30 menit
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((product) =>
    product.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate meta description dari data produk
  const metaDescription = `Temukan koleksi ${products.length} produk kerajinan tangan terbaik dari Albae Handicraft. Produk unggulan kami meliputi ${products
    .slice(0, 3)
    .map((p) => p.nama)
    .join(", ")} dan banyak lagi.`;

  // Get featured image for og:image
  const featuredImage = products[0] ? getFullImageUrl(products[0].featured_image) : getFullImageUrl("/placeholder.svg");
  const currentUrl = window.location.href;

  return (
    <Layout>
      <Helmet>
        <title>Produk Kerajinan Tangan | Albae Handicraft</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="kerajinan tangan, handicraft, produk lokal, dekorasi, kaligrafi, indonesia" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Albae Handicraft" />
        <meta property="og:title" content="Produk Kerajinan Tangan | Albae Handicraft" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:image:alt" content="Koleksi Produk Albae Handicraft" />
        <meta property="og:url" content={currentUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@albaehandicraft" />
        <meta name="twitter:title" content="Produk Kerajinan Tangan | Albae Handicraft" />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={featuredImage} />
        <meta name="twitter:image:alt" content="Koleksi Produk Albae Handicraft" />
        
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Produk Kami</h1>
          <p className="text-xl text-muted-foreground">
            Temukan koleksi kerajinan tangan terbaik kami
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={getFullImageUrl(product.featured_image)}
                      alt={product.nama}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <h2 className="font-semibold text-foreground mb-2">{product.nama}</h2>
                  <p className="text-primary">Rp {product.price.toLocaleString("id-ID")}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}