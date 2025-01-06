import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "./FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  currentImages?: string[];
  onImagesUpdate: () => void;
}

export function GalleryDialog({
  open,
  onOpenChange,
  productId,
  currentImages = [],
  onImagesUpdate,
}: GalleryDialogProps) {
  const { toast } = useToast();

  const handleImageUpload = async (path: string) => {
    const { error } = await supabase
      .from("products")
      .update({
        image_gallery: [...currentImages, path],
      })
      .eq("id", productId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update gallery",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Image added to gallery",
    });
    onImagesUpdate();
  };

  const handleRemoveImage = async (path: string) => {
    const { error } = await supabase
      .from("products")
      .update({
        image_gallery: currentImages.filter(img => img !== path),
      })
      .eq("id", productId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove image",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Image removed from gallery",
    });
    onImagesUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Product Gallery</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FileUpload
            onUploadComplete={handleImageUpload}
            multiple={true}
            currentImages={currentImages}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}