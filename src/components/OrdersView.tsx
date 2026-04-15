import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Order } from "../types";

interface OrdersViewProps {
  orders: Order[];
}

export function OrdersView({ orders }: OrdersViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <p>No orders yet.</p>
            <p className="text-sm">Simulate a customer order in the Messages tab.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>{order.customerName}</div>
                    {order.customerContact && (
                      <div className="text-xs text-neutral-500">{order.customerContact}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <ul className="text-sm text-neutral-600 list-disc list-inside">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.productName}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="font-medium">$\{(order.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={order.status === 'fulfilled' ? 'default' : order.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
