import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import type { Product } from "@/types/product";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products: " + error.message,
      });
      return;
    }

    setProducts(data || []);
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleAddProduct = async (formData: any) => {
    try {
      const slug = createSlug(formData.nama);
      console.log("Attempting to insert product with data:", { ...formData, slug });
      
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

      if (error) {
        console.error("Error adding product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add product: " + error.message,
        });
        return;
      }

      console.log("Product added successfully:", data);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setIsAddDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Unexpected error adding product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while adding the product",
      });
    }
  };

  const handleEditProduct = async (formData: any) => {
    if (!selectedProduct) return;

    try {
      console.log("Attempting to update product with data:", formData);
      
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

      if (error) {
        console.error("Error updating product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update product: " + error.message,
        });
        return;
      }

      console.log("Product updated successfully");
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Unexpected error updating product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating the product",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating product status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update product status: " + error.message,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product status updated successfully",
      });
      fetchProducts();
    } catch (error) {
      console.error("Unexpected error updating product status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating the product status",
      });
    }
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.featured_image && (
                      <img
                        src={product.featured_image}
                        alt={product.nama}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.nama}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleProductStatus(product.id, product.active)
                        }
                      >
                        {product.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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