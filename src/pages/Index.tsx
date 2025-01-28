import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testSupabaseConnection } from "@/utils/supabaseTest";
import { useToast } from "@/hooks/use-toast";
import { getFullImageUrl } from "@/lib/utils";

// Fungsi untuk mengambil featured products
async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .limit(4);

  if (error) throw error;
  return data;
}

export default function Index() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Albae Handicraft - Kerajinan Tangan & Produk Artisan";
    
    // Test Supabase connection on component mount
    testSupabaseConnection().then((isConnected) => {
      if (!isConnected) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to database. Please check your configuration.",
        });
      } else {
        toast({
          title: "Connected",
          description: "Successfully connected to database",
        });
      }
    });
  }, [toast]);

  const { data: featuredProducts = [], isError } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
    gcTime: 1000 * 60 * 30, // Data disimpan di garbage collection selama 30 menit
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Get hero image for og:image
  const heroImage = featuredProducts[0] ? getFullImageUrl(featuredProducts[0].featured_image) : getFullImageUrl("/placeholder.svg");

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error loading products</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Albae Handicraft | Kerajinan Tangan Berkualitas</title>
        <meta
          name="description"
          content="Albae Handicraft menghadirkan kerajinan tangan berkualitas tinggi dengan sentuhan tradisional dan modern. Temukan koleksi unik kami untuk mempercantik ruangan Anda."
        />
        <meta
          name="keywords"
          content="kerajinan tangan, handicraft, produk lokal, dekorasi, indonesia, kaligrafi"
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Albae Handicraft | Kerajinan Tangan Berkualitas" />
        <meta
          property="og:description"
          content="Albae Handicraft menghadirkan kerajinan tangan berkualitas tinggi dengan sentuhan tradisional dan modern. Temukan koleksi unik kami untuk mempercantik ruangan Anda."
        />
        <meta property="og:image" content={heroImage} />
        <meta property="og:image:alt" content="Albae Handicraft - Kerajinan Tangan Berkualitas" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Albae Handicraft | Kerajinan Tangan Berkualitas" />
        <meta
          name="twitter:description"
          content="Albae Handicraft menghadirkan kerajinan tangan berkualitas tinggi dengan sentuhan tradisional dan modern. Temukan koleksi unik kami untuk mempercantik ruangan Anda."
        />
        <meta name="twitter:image" content={heroImage} />
        <meta name="twitter:image:alt" content="Albae Handicraft - Kerajinan Tangan Berkualitas" />
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <section className="bg-background py-12 sm:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Selamat Datang di Albae Handicraft
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Temukan koleksi produk kerajinan tangan kami yang dibuat dengan penuh cinta dan perhatian
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Produk Unggulan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id}>
                <Link to={`/products/${product.slug}`}>
                  <img
                    src={product.featured_image}
                    alt={product.nama}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.nama}</h3>
                    <p className="text-gray-600">Rp {product.price.toLocaleString('id-ID')}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}