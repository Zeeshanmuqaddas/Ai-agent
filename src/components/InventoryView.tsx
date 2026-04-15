import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Product } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface InventoryViewProps {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function InventoryView({ inventory, setInventory }: InventoryViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditStock(product.stock);
  };

  const handleSave = (id: string) => {
    setInventory(inventory.map(p => p.id === id ? { ...p, stock: editStock } : p));
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs text-neutral-500">{product.id}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>$\{(product.price).toFixed(2)}</TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={editStock} 
                        onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                    </div>
                  ) : (
                    <span className="font-medium">{product.stock}</span>
                  )}
                </TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : product.stock < 10 ? (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Low Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === product.id ? (
                    <Button size="sm" onClick={() => handleSave(product.id)}>Save</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>Update Stock</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
