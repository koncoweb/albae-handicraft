import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function UpdateProductImages() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateImages = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-product-images');
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Gambar produk telah diperbarui",
      });
    } catch (error) {
      console.error('Error updating images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui gambar produk",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdateImages} 
      disabled={isUpdating}
    >
      {isUpdating ? "Memperbarui..." : "Perbarui Gambar Produk"}
    </Button>
  );
}