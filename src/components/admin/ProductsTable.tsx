import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageIcon } from "lucide-react";
import type { Product } from "@/types/product";
import { GalleryDialog } from "./GalleryDialog";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export const ProductsTable = ({ products, onEdit, onToggleStatus }: ProductsTableProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleGalleryClick = (product: Product) => {
    setSelectedProduct(product);
    setIsGalleryOpen(true);
  };

  return (
    <>
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
                    onClick={() => onToggleStatus(product.id, product.active)}
                  >
                    {product.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGalleryClick(product)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <GalleryDialog
          open={isGalleryOpen}
          onOpenChange={setIsGalleryOpen}
          productId={selectedProduct.id}
          currentImages={selectedProduct.image_gallery}
          onImagesUpdate={() => window.location.reload()}
        />
      )}
    </>
  );
};