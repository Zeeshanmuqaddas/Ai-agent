/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShoppingCart, 
  Package, 
  BarChart3,
  Bot
} from 'lucide-react';
import { Product, Order, Message } from './types';
import { Toaster } from './components/ui/sonner';
import { DashboardView } from './components/DashboardView';
import { MessagesView } from './components/MessagesView';
import { OrdersView } from './components/OrdersView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';

// Mock initial data
const initialInventory: Product[] = [
  { id: '1', name: 'Premium Coffee Beans', stock: 50, price: 15.99 },
  { id: '2', name: 'Ceramic Mug', stock: 12, price: 9.99 },
  { id: '3', name: 'Pour Over Maker', stock: 5, price: 24.99 },
  { id: '4', name: 'Coffee Filters (100pk)', stock: 100, price: 4.99 },
];

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'system',
    text: 'AI Agent initialized and ready to assist.',
    timestamp: new Date().toISOString(),
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<Product[]>(initialInventory);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-neutral-100">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AutoBiz AI</h1>
            <p className="text-xs text-neutral-500">Autonomous Agent</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-8">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView inventory={inventory} orders={orders} messages={messages} />
            )}
            {activeTab === 'messages' && (
              <MessagesView 
                messages={messages} 
                setMessages={setMessages} 
                inventory={inventory} 
                setInventory={setInventory} 
                setOrders={setOrders} 
              />
            )}
            {activeTab === 'orders' && (
              <OrdersView orders={orders} />
            )}
            {activeTab === 'inventory' && (
              <InventoryView inventory={inventory} setInventory={setInventory} />
            )}
            {activeTab === 'reports' && (
              <ReportsView inventory={inventory} orders={orders} messages={messages} />
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
