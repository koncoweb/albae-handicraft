import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (product) {
      document.title = `${product.nama} - Albae Handicraft`;
      // Update meta description for SEO
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", product.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = product.description;
        document.head.appendChild(meta);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Memuat...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Produk tidak ditemukan</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Produk
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img
              src={product.featured_image}
              alt={product.nama}
              className="w-full rounded-lg object-cover aspect-square"
            />
            {product.image_gallery && product.image_gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.image_gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.nama} - Gambar ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nama}</h1>
              <p className="text-lg text-gray-600">{product.category}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Harga</h2>
              <p className="text-2xl font-bold text-primary">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Material</h2>
              <p className="text-gray-700">{product.material}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}