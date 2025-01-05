import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (path: string) => void;
  currentImage?: string;
  multiple?: boolean;
  currentImages?: string[];
  onRemoveImage?: (path: string) => void;
}

export function FileUpload({ 
  onUploadComplete, 
  currentImage,
  multiple = false,
  currentImages = [],
  onRemoveImage
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        // Only save file metadata if upload was successful
        const { error: dbError } = await supabase.from("files").insert({
          name: file.name,
          path: filePath,
          size: file.size,
          type: file.type,
          bucket: "product-images",
        });

        if (dbError) throw dbError;

        // Call onUploadComplete with the public URL
        onUploadComplete(publicUrl.publicUrl);
      }

      toast({
        title: "Success",
        description: "Image(s) uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      const input = document.getElementById("image-upload") as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!multiple && currentImage && (
        <img
          src={currentImage}
          alt="Product"
          className="w-32 h-32 object-cover rounded-md"
        />
      )}
      {multiple && currentImages && (
        <div className="flex flex-wrap gap-2">
          {currentImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-32 h-32 object-cover rounded-md"
              />
              {onRemoveImage && (
                <button
                  onClick={() => onRemoveImage(image)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          multiple={multiple}
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