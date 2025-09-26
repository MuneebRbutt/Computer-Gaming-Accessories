export interface Product {
  id: string
  title: string
  price: number
  category: string
  subcategory?: string
  brand: string
  image: string
  gallery?: string[]
  description?: string
  availability?: 'In Stock' | 'Limited Stock' | 'Preorder' | 'Out of Stock'
  specs?: Record<string, string>
  tags?: string[]
}

export interface PCComponent {
  id: string
  name: string
  price: number
  watts?: number
  category: 'case' | 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'cooler'
  socket?: string
  formFactor?: string
  compatibility?: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'laptop4060',
    title: 'Gaming Laptop 15" RTX 4060',
    price: 345000,
    category: 'Gaming Laptops',
    brand: 'MSI',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'High-FPS 1080p/1440p gaming laptop with RTX 4060.',
    availability: 'In Stock',
    specs: {
      CPU: 'Intel Core i7',
      GPU: 'NVIDIA RTX 4060',
      RAM: '16GB DDR5',
      Storage: '1TB NVMe SSD',
      Display: '15.6" 144Hz'
    },
    tags: ['gaming', 'laptop', 'rtx']
  },
  {
    id: 'pc-ryzen7',
    title: 'Custom Gaming PC Ryzen 7',
    price: 280000,
    category: 'PC',
    subcategory: 'PC Bundle (Pre-build)',
    brand: 'AMD',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Ryzen 7 + RTX performance for streaming and gaming.',
    availability: 'Limited Stock',
    specs: {
      CPU: 'Ryzen 7 5800X',
      GPU: 'NVIDIA RTX 4070',
      RAM: '32GB DDR4',
      Storage: '1TB NVMe + 2TB HDD',
      Cooling: '240mm AIO'
    },
    tags: ['gaming', 'desktop', 'ryzen']
  },
  {
    id: 'kb-rgb',
    title: 'RGB Mechanical Keyboard',
    price: 12500,
    category: 'Keyboards',
    brand: 'Razer',
    image: 'https://images.unsplash.com/photo-1595044426077-d36a40f253d3?q=80&w=1200&auto=format&fit=crop',
    description: 'Tactile switches, per-key RGB, detachable cable.',
    availability: 'In Stock',
    specs: {
      Switches: 'Tactile',
      Layout: 'ANSI',
      Connection: 'USB-C',
      RGB: 'Per-key',
      Software: 'Supported'
    },
    tags: ['keyboard', 'rgb', 'mechanical']
  },
  {
    id: 'headset-71',
    title: 'Gaming Headset 7.1 Surround',
    price: 9800,
    category: 'Headphones',
    brand: 'HyperX',
    image: 'https://images.unsplash.com/photo-1511715281310-7ff014df43a2?q=80&w=1200&auto=format&fit=crop',
    description: 'Immersive virtual surround with noise-cancelling mic.',
    availability: 'In Stock',
    specs: {
      Sound: '7.1 Virtual Surround',
      Mic: 'Noise-cancelling',
      Connection: 'USB',
      Weight: '275g'
    },
    tags: ['headset', 'gaming', 'surround']
  },
  {
    id: 'mouse-wireless',
    title: 'Wireless Gaming Mouse',
    price: 6500,
    category: 'Mouses',
    brand: 'Logitech',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b07e7?q=80&w=1200&auto=format&fit=crop',
    description: 'Lightweight wireless mouse with precise sensor.',
    availability: 'In Stock',
    specs: {
      Sensor: 'Hero',
      DPI: '12,000',
      Weight: '85g',
      Battery: '200 hours'
    },
    tags: ['mouse', 'wireless', 'gaming']
  },
  {
    id: 'monitor-27-165',
    title: '27" 165Hz Gaming Monitor',
    price: 62000,
    category: 'Computer Accessories',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    description: 'Fast 165Hz IPS panel for smooth gameplay.',
    availability: 'Preorder',
    specs: {
      Size: '27"',
      Panel: 'IPS',
      Refresh: '165Hz',
      Resolution: '1440p'
    },
    tags: ['monitor', 'gaming', 'high-refresh']
  },
  {
    id: 'ssd-1tb',
    title: 'NVMe SSD 1TB',
    price: 18500,
    category: 'Computer Accessories',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1611695434369-5c6e61bbee04?q=80&w=1200&auto=format&fit=crop',
    description: 'Blazing fast NVMe SSD for OS and games.',
    availability: 'In Stock',
    specs: {
      Interface: 'PCIe 3.0 x4',
      Read: '3500 MB/s',
      Write: '3000 MB/s'
    },
    tags: ['storage', 'ssd', 'nvme']
  },
  {
    id: 'cpu-cooler',
    title: 'ARGB CPU Liquid Cooler',
    price: 14500,
    category: 'Computer Accessories',
    brand: 'CoolerMaster',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1200&auto=format&fit=crop',
    description: 'Quiet cooling with addressable RGB.',
    availability: 'In Stock',
    specs: {
      Radiator: '240mm',
      Fans: '2x120mm ARGB',
      Socket: 'AM4/LGA1700',
      Warranty: '2 Years'
    },
    tags: ['cooler', 'rgb', 'liquid']
  }
]

export const PC_COMPONENTS: PCComponent[] = [
  // Cases
  { id: 'nzxt-h510', name: 'NZXT H510', price: 18000, category: 'case', formFactor: 'ATX' },
  { id: 'cm-nr200', name: 'Cooler Master NR200', price: 16500, category: 'case', formFactor: 'ITX' },
  { id: 'lianli-215', name: 'Lian Li Lancool 215', price: 22000, category: 'case', formFactor: 'ATX' },
  
  // CPUs
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', price: 45000, watts: 65, category: 'cpu', socket: 'LGA1700' },
  { id: 'r5-5600', name: 'AMD Ryzen 5 5600', price: 38000, watts: 65, category: 'cpu', socket: 'AM4' },
  { id: 'r7-5700x', name: 'AMD Ryzen 7 5700X', price: 65000, watts: 65, category: 'cpu', socket: 'AM4' },
  
  // GPUs
  { id: 'gtx-1660', name: 'NVIDIA GTX 1660 6GB', price: 65000, watts: 120, category: 'gpu' },
  { id: 'rtx-3060', name: 'NVIDIA RTX 3060 12GB', price: 105000, watts: 170, category: 'gpu' },
  { id: 'rtx-4060', name: 'NVIDIA RTX 4060 8GB', price: 125000, watts: 115, category: 'gpu' },
  
  // RAM
  { id: '16gb-3200', name: '16GB (2x8) DDR4-3200', price: 14000, watts: 8, category: 'ram' },
  { id: '32gb-3600', name: '32GB (2x16) DDR4-3600', price: 28000, watts: 12, category: 'ram' },
  
  // Storage
  { id: 'ssd-500', name: 'NVMe SSD 500GB', price: 11000, watts: 5, category: 'storage' },
  { id: 'ssd-1tb', name: 'NVMe SSD 1TB', price: 18500, watts: 5, category: 'storage' },
  
  // PSUs
  { id: 'psu-550', name: '550W 80+ Bronze', price: 15000, watts: 550, category: 'psu' },
  { id: 'psu-650', name: '650W 80+ Bronze', price: 18500, watts: 650, category: 'psu' },
  { id: 'psu-750', name: '750W 80+ Gold', price: 26000, watts: 750, category: 'psu' }
]

export const CATEGORIES = [
  'PC',
  'Gaming Laptops', 
  'Mouses',
  'Keyboards',
  'Headphones',
  'Computer Accessories',
  'Graphic Cards',
  'Processors'
]

export const BRANDS = [
  'MSI', 'AMD', 'Razer', 'HyperX', 'Logitech', 'Dell', 'Samsung', 'CoolerMaster', 'AdvanceIT'
]
