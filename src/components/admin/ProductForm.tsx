import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/product";
import { FileUpload } from "./FileUpload";

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Product | null;
  onCancel: () => void;
}

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      nama: initialData?.nama || "",
      category: initialData?.category || "",
      price: initialData?.price?.toString() || "",
      material: initialData?.material || "",
      description: initialData?.description || "",
      featured_image: initialData?.featured_image || "",
      image_gallery: initialData?.image_gallery || [],
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .order('category');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
      return;
    }

    const uniqueCategories = [...new Set(data.map(item => item.category))];
    setCategories(uniqueCategories);
  };

  const handleImageUpload = (path: string) => {
    form.setValue("featured_image", path);
  };

  const handleGalleryImageUpload = (path: string) => {
    const currentGallery = form.getValues("image_gallery") || [];
    form.setValue("image_gallery", [...currentGallery, path]);
  };

  const handleRemoveGalleryImage = (path: string) => {
    const currentGallery = form.getValues("image_gallery") || [];
    form.setValue(
      "image_gallery",
      currentGallery.filter((img: string) => img !== path)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add new category</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <FileUpload
                  onUploadComplete={handleImageUpload}
                  currentImage={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_gallery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Gallery</FormLabel>
              <FormControl>
                <FileUpload
                  onUploadComplete={handleGalleryImageUpload}
                  multiple={true}
                  currentImages={field.value}
                  onRemoveImage={handleRemoveGalleryImage}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}