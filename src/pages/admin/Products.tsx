import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

export default function AdminProducts() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, fetchProducts, toggleProductStatus } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleAddProduct = async (formData: any) => {
    try {
      const slug = createSlug(formData.nama);
      const { data, error } = await supabase.from("products").insert([
        {
          nama: formData.nama,
          slug,
          category: formData.category,
          price: parseFloat(formData.price),
          material: formData.material,
          description: formData.description,
          featured_image: formData.featured_image,
          active: true,
        },
      ]).select();

      if (error) throw error;

      setIsAddDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (formData: any) => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          nama: formData.nama,
          category: formData.category,
          price: parseFloat(formData.price),
          material: formData.material,
          description: formData.description,
          featured_image: formData.featured_image,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error updating product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New Product
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onToggleStatus={toggleProductStatus}
          />
        </div>

        <ProductFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddProduct}
          title="Add New Product"
        />

        <ProductFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedProduct={selectedProduct}
          onSubmit={handleEditProduct}
          title="Edit Product"
        />
      </div>
    </Layout>
  );
}