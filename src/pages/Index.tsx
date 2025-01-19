import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { testSupabaseConnection } from "@/utils/supabaseTest";
import { useToast } from "@/hooks/use-toast";

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

  const { data: featuredProducts, isError } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .limit(4);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch products: " + error.message,
        });
        throw error;
      }
      return data;
    },
  });

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
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Selamat Datang di Albae Handicraft
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Temukan koleksi produk kerajinan tangan kami yang dibuat dengan penuh cinta dan perhatian
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Produk Unggulan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
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