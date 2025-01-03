import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  nama: string;
  slug: string;
  category: string;
  price: number;
  material: string;
  description: string;
  active: boolean;
  featured_image: string;
}

interface ProductFormData {
  nama: string;
  category: string;
  price: string;
  material: string;
  description: string;
  featured_image: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    nama: "",
    category: "",
    price: "",
    material: "",
    description: "",
    featured_image: "",
  });
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
      return;
    }

    setProducts(data || []);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = createSlug(formData.nama);
    
    const { error } = await supabase.from("products").insert([
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
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Product created successfully",
    });
    setIsAddDialogOpen(false);
    setFormData({
      nama: "",
      category: "",
      price: "",
      material: "",
      description: "",
      featured_image: "",
    });
    fetchProducts();
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Product updated successfully",
    });
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      nama: product.nama,
      category: product.category,
      price: product.price.toString(),
      material: product.material,
      description: product.description,
      featured_image: product.featured_image,
    });
    setIsEditDialogOpen(true);
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Product status updated successfully",
    });
    fetchProducts();
  };

  const ProductForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nama">Name</Label>
        <Input
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="material">Material</Label>
        <Input
          id="material"
          name="material"
          value={formData.material}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="featured_image">Featured Image URL</Label>
        <Input
          id="featured_image"
          name="featured_image"
          value={formData.featured_image}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit">
        {selectedProduct ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleAddProduct} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleEditProduct} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}