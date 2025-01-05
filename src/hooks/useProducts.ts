import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
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
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching products",
      });
    }
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

  return {
    products,
    fetchProducts,
    toggleProductStatus,
  };
};