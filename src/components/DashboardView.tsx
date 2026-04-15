import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, ShoppingCart, AlertCircle, DollarSign } from "lucide-react";
import { Product, Order, Message } from "../types";

interface DashboardViewProps {
  inventory: Product[];
  orders: Order[];
  messages: Message[];
}

export function DashboardView({ inventory, orders, messages }: DashboardViewProps) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockItems = inventory.filter((item) => item.stock < 10);
  const pendingOrders = orders.filter((order) => order.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$\{(totalRevenue).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-neutral-500 mt-1">{pendingOrders.length} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Products</CardTitle>
            <Package className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.slice(-5).reverse().map((msg) => (
                <div key={msg.id} className="flex flex-col space-y-1 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{msg.sender}</span>
                    <span className="text-xs text-neutral-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2">{msg.text}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-4">No messages yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-red-600 font-bold">{item.stock} left</span>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-4">All items are sufficiently stocked.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
