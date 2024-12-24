export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'earrings' | 'candles' | 'stickers';
  quantity: number;
  imageUrl: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Array<{ product: Product; quantity: number }>;
  totalAmount: number;
  date: Date;
  status: 'processing' | 'in route' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
}
