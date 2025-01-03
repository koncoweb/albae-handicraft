import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (path: string) => void;
  currentImage?: string;
}

export function FileUpload({ onUploadComplete, currentImage }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      // Save file metadata
      const { error: dbError } = await supabase.from("files").insert({
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
        bucket: "product-images",
      });

      if (dbError) throw dbError;

      onUploadComplete(publicUrl.publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <img
          src={currentImage}
          alt="Product"
          className="w-32 h-32 object-cover rounded-md"
        />
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}