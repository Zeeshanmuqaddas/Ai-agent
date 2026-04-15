export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export interface OrderItem {
  productName: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerContact?: string;
  items: OrderItem[];
  status: 'pending' | 'fulfilled' | 'cancelled';
  total: number;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'system';
  text: string;
  timestamp: string;
  classification?: string;
  suggestedAction?: string;
}
