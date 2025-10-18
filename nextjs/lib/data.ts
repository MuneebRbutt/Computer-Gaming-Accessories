import type { StaticImageData } from 'next/image'
import { z } from 'zod'

export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number // For showing discounts
  category: string
  subcategory?: string
  brand: string
  image: string | StaticImageData
  gallery?: (string | StaticImageData)[]
  description?: string
  availability?: 'In Stock' | 'Limited Stock' | 'Preorder' | 'Out of Stock'
  specs?: Record<string, string>
  tags?: string[]
  featured?: boolean
  rating?: number
  reviewCount?: number
  discount?: number
  weight?: number // in grams
  warranty?: string
  sku?: string
  metaTitle?: string
  metaDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parentId?: string
  featured?: boolean
  productCount?: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  featured?: boolean
  productCount?: number
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
  brand?: string
  image?: string
  specs?: Record<string, string>
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  pros?: string[]
  cons?: string[]
  verified?: boolean
  helpful?: number
  createdAt: Date
}

// Enhanced product data with better images and more details
export const PRODUCTS: Product[] = [
  {
    id: 'gaming-laptop-rtx4060',
    title: 'MSI Gaming Laptop 15.6" RTX 4060',
    price: 345000,
    originalPrice: 380000,
    category: 'Gaming Laptops',
    brand: 'MSI',
    image: 'images/msi-gaming-laptop-rtx4060-front.png',
    gallery: [
      'images/msi-gaming-laptop-rtx4060-front.png',
      'images/msi-gaming-laptop-rtx4060-side.png'
    ],
    description: 'Unleash your gaming potential with this powerhouse MSI laptop featuring RTX 4060 graphics, perfect for 1440p gaming and content creation.',
    availability: 'In Stock',
    specs: {
      'Processor': 'Intel Core i7-13700H',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB',
      'Memory': '16GB DDR5-4800',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'Display': '15.6" FHD 144Hz IPS',
      'OS': 'Windows 11 Home',
      'Battery': '65Wh Li-Polymer',
      'Weight': '2.4 kg'
    },
    tags: ['gaming', 'laptop', 'rtx', 'msi', 'high-performance'],
    featured: true,
    rating: 4.7,
    reviewCount: 89,
    discount: 9,
    weight: 2400,
    warranty: '2 Years International Warranty',
    sku: 'MSI-GL66-RTX4060',
    metaTitle: 'MSI Gaming Laptop RTX 4060 - Best Price in Pakistan',
    metaDescription: 'Buy MSI Gaming Laptop with RTX 4060 graphics at best price in Pakistan. 144Hz display, 16GB RAM, 1TB SSD. Free shipping available.'
  },
  {
    id: 'custom-pc-ryzen7',
    title: 'Custom Gaming PC AMD Ryzen 7 5800X',
    price: 280000,
    originalPrice: 320000,
    category: 'PC',
    subcategory: 'Pre-built Systems',
    brand: 'AdvanceIT Custom',
    image: 'images/custom-pc-ryzen7-5800x-front.png',
    gallery: [
      'images/custom-pc-ryzen7-5800x-front.png',
      'images/custom-pc-ryzen7-5800x-rgb.png',
      'images/custom-pc-ryzen7-5800x-inside.png'
    ],
    description: 'Professional-grade custom gaming PC built with AMD Ryzen 7 and RTX 4070. Perfect for streaming, gaming, and productivity work.',
    availability: 'Limited Stock',
    specs: {
      'Processor': 'AMD Ryzen 7 5800X',
      'Graphics': 'NVIDIA RTX 4070 12GB',
      'Memory': '32GB DDR4-3600 RGB',
      'Storage': '1TB NVMe + 2TB HDD',
      'Motherboard': 'MSI B550 Gaming Plus',
      'PSU': '750W 80+ Gold Modular',
      'Cooling': 'Corsair H100i RGB 240mm AIO',
      'Case': 'NZXT H510 Elite'
    },
    tags: ['gaming', 'desktop', 'ryzen', 'custom-build', 'rgb'],
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    discount: 13,
    warranty: '3 Years Parts + 1 Year Labor',
    sku: 'AIT-RYZEN7-4070',
    metaTitle: 'Custom Gaming PC Ryzen 7 RTX 4070 - Pre-built Systems',
    metaDescription: 'Custom gaming PC with Ryzen 7 5800X and RTX 4070. 32GB RAM, RGB lighting, professional assembly. Best custom PC in Pakistan.'
  },
  {
    id: 'razer-keyboard-rgb',
    title: 'Razer BlackWidow V4 RGB Mechanical Keyboard',
    price: 12500,
    originalPrice: 15000,
    category: 'Keyboards',
    brand: 'Razer',
    image: 'products/razer-blackwidow.jpg',
    description: 'Premium mechanical gaming keyboard with Razer Green switches, per-key RGB lighting, and dedicated media controls.',
    availability: 'In Stock',
    specs: {
      'Switches': 'Razer Green Tactile',
      'Layout': 'Full-size (104 keys)',
      'Lighting': 'Razer Chroma RGB',
      'Connection': 'USB-C Detachable',
      'Polling Rate': '1000Hz',
      'Key Rollover': 'N-Key',
      'Software': 'Razer Synapse 3'
    },
    tags: ['keyboard', 'rgb', 'mechanical', 'razer', 'gaming'],
    rating: 4.6,
    reviewCount: 234,
    discount: 17,
    weight: 1200,
    warranty: '2 Years Razer Warranty',
    sku: 'RZ03-BWID-RGB'
  },
  {
    id: 'hyperx-headset-cloud3',
    title: 'HyperX Cloud III Wireless Gaming Headset',
    price: 9800,
    originalPrice: 11500,
    category: 'Headphones',
    brand: 'HyperX',
    image: 'products/hyperx-cloud3.jpg',
    description: 'Premium wireless gaming headset with 7.1 surround sound, noise-cancelling microphone, and 120-hour battery life.',
    availability: 'In Stock',
    specs: {
      'Driver': '53mm Neodymium',
      'Frequency': '10Hz - 21kHz',
      'Surround': 'DTS Headphone:X 2.0',
      'Microphone': 'Detachable noise-cancelling',
      'Battery': '120 hours',
      'Connectivity': '2.4GHz Wireless + Bluetooth',
      'Weight': '308g'
    },
    tags: ['headset', 'wireless', 'gaming', 'hyperx', '7.1-surround'],
    rating: 4.8,
    reviewCount: 445,
    discount: 15,
    weight: 308,
    warranty: '2 Years HyperX Warranty',
    sku: 'HX-CLOUD3-WL'
  },
  {
    id: 'logitech-mouse-gpro',
    title: 'Logitech G Pro X Superlight Wireless Gaming Mouse',
    price: 6500,
    category: 'Mice',
    brand: 'Logitech',
    image: 'products/logitech-gpro.jpg',
    description: 'Ultra-lightweight wireless gaming mouse with HERO 25K sensor, perfect for competitive gaming.',
    availability: 'In Stock',
    specs: {
      'Sensor': 'HERO 25K',
      'DPI': '100-25,600',
      'Weight': '<63g',
      'Battery': '70+ hours',
      'Switches': 'LIGHTSPEED wireless',
      'Feet': 'PTFE',
      'Buttons': '5 programmable'
    },
    tags: ['mouse', 'wireless', 'lightweight', 'competitive', 'logitech'],
    rating: 4.7,
    reviewCount: 892,
    weight: 63,
    warranty: '2 Years Logitech Warranty',
    sku: 'LOG-GPRO-SL'
  },
  {
    id: 'dell-monitor-27-165hz',
    title: 'Dell S2722DGM 27" 165Hz Curved Gaming Monitor',
    price: 62000,
    originalPrice: 68000,
    category: 'Monitors',
    brand: 'Dell',
    image: 'images/dell-x2721q-27-curved.png',
    description: 'Premium 27" curved gaming monitor with 165Hz refresh rate, 1ms response time, and FreeSync Premium support.',
    availability: 'Preorder',
    specs: {
      'Size': '27 inches',
      'Resolution': '2560 x 1440 (QHD)',
      'Panel': 'VA Curved (1000R)',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms (MPRT)',
      'HDR': 'HDR10',
      'Ports': 'HDMI 2.0, DisplayPort 1.2',
      'Stand': 'Tilt, Swivel, Height Adjust'
    },
    tags: ['monitor', 'gaming', 'curved', '165hz', 'qhd'],
    rating: 4.5,
    reviewCount: 167,
    discount: 9,
    warranty: '3 Years Dell Warranty',
    sku: 'DELL-S2722DGM'
  },
  {
    id: 'hp-omen-24-gaming',
    title: 'HP OMEN X24f 24" Gaming Monitor',
    price: 45000,
    originalPrice: 52000,
    category: 'Monitors',
    brand: 'HP',
    image: 'images/hp-omen-x24f-24-flat.png',
    description: '24" Full HD gaming monitor with 240Hz refresh rate, perfect for competitive gaming.',
    availability: 'In Stock',
    specs: {
      'Size': '24 inches',
      'Resolution': '1920 x 1080 (FHD)',
      'Panel': 'IPS Flat',
      'Refresh Rate': '240Hz',
      'Response Time': '1ms',
      'HDR': 'HDR400',
      'Ports': 'HDMI 2.0, DisplayPort 1.4',
      'Stand': 'Tilt, Height Adjust'
    },
    tags: ['monitor', 'gaming', 'flat', '240hz', 'fhd', 'competitive'],
    rating: 4.6,
    reviewCount: 234,
    discount: 13,
    warranty: '3 Years HP Warranty',
    sku: 'HP-OMEN-X24F'
  },
  {
    id: 'asus-rog-swift-pg27',
    title: 'ASUS ROG Swift PG27AQN 27" Gaming Monitor',
    price: 95000,
    originalPrice: 110000,
    category: 'Monitors',
    brand: 'ASUS',
    image: 'images/asus-rog-swift-pg27aqn-27-flat.png',
    description: 'Premium 27" QHD gaming monitor with 360Hz refresh rate and G-SYNC Ultimate.',
    availability: 'In Stock',
    specs: {
      'Size': '27 inches',
      'Resolution': '2560 x 1440 (QHD)',
      'Panel': 'Fast IPS Flat',
      'Refresh Rate': '360Hz',
      'Response Time': '1ms GTG',
      'HDR': 'HDR10, G-SYNC Ultimate',
      'Ports': 'HDMI 2.0, DisplayPort 1.4, USB Hub',
      'Stand': 'Full Ergonomic'
    },
    tags: ['monitor', 'gaming', 'flat', '360hz', 'qhd', 'gsync', 'premium'],
    featured: true,
    rating: 4.9,
    reviewCount: 445,
    discount: 14,
    warranty: '3 Years ASUS Warranty',
    sku: 'ASUS-PG27AQN'
  },
  {
    id: 'acer-predator-x34p',
    title: 'Acer Predator X34P 34" Ultrawide Gaming Monitor',
    price: 125000,
    originalPrice: 145000,
    category: 'Monitors',
    brand: 'Acer',
    image: 'images/acer-predator-x34p-34-curved.png',
    description: 'Immersive 34" curved ultrawide monitor with 120Hz refresh rate and G-SYNC.',
    availability: 'In Stock',
    specs: {
      'Size': '34 inches',
      'Resolution': '3440 x 1440 (UWQHD)',
      'Panel': 'IPS Curved (1900R)',
      'Refresh Rate': '120Hz',
      'Response Time': '4ms GTG',
      'HDR': 'HDR10, G-SYNC',
      'Ports': 'HDMI 2.0, DisplayPort 1.4',
      'Stand': 'Tilt, Swivel, Height Adjust'
    },
    tags: ['monitor', 'gaming', 'curved', 'ultrawide', '120hz', 'uwqhd'],
    featured: true,
    rating: 4.8,
    reviewCount: 312,
    discount: 14,
    warranty: '3 Years Acer Warranty',
    sku: 'ACER-X34P'
  },
  {
    id: 'msi-optix-g27cq4',
    title: 'MSI Optix G27CQ4 27" Curved Gaming Monitor',
    price: 55000,
    originalPrice: 62000,
    category: 'Monitors',
    brand: 'MSI',
    image: 'images/msi-optix-g27cq4-27-curved.png',
    description: '27" QHD curved gaming monitor with 165Hz refresh rate and 1ms response time.',
    availability: 'In Stock',
    specs: {
      'Size': '27 inches',
      'Resolution': '2560 x 1440 (QHD)',
      'Panel': 'VA Curved (1500R)',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms MPRT',
      'HDR': 'HDR Ready',
      'Ports': 'HDMI 2.0, DisplayPort 1.2',
      'Stand': 'Tilt'
    },
    tags: ['monitor', 'gaming', 'curved', '165hz', 'qhd'],
    rating: 4.5,
    reviewCount: 189,
    discount: 11,
    warranty: '3 Years MSI Warranty',
    sku: 'MSI-G27CQ4'
  },
  {
    id: 'lg-ultragear-32gn63t',
    title: 'LG UltraGear 32GN63T 32" Gaming Monitor',
    price: 68000,
    originalPrice: 78000,
    category: 'Monitors',
    brand: 'LG',
    image: 'images/lg-ultragear-32gn63t-32-flat.png',
    description: '32" QHD gaming monitor with 165Hz refresh rate and HDR10 support.',
    availability: 'In Stock',
    specs: {
      'Size': '32 inches',
      'Resolution': '2560 x 1440 (QHD)',
      'Panel': 'VA Flat',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms MBR',
      'HDR': 'HDR10',
      'Ports': 'HDMI 2.0, DisplayPort 1.4',
      'Stand': 'Tilt'
    },
    tags: ['monitor', 'gaming', 'flat', '165hz', 'qhd', '32-inch'],
    rating: 4.6,
    reviewCount: 267,
    discount: 13,
    warranty: '3 Years LG Warranty',
    sku: 'LG-32GN63T'
  },
  {
    id: 'samsung-odyssey-g8',
    title: 'Samsung Odyssey G8 34" Curved Gaming Monitor',
    price: 135000,
    originalPrice: 155000,
    category: 'Monitors',
    brand: 'Samsung',
    image: 'images/samsung-odyssey-g8-34-curved.png',
    description: 'Premium 34" OLED curved gaming monitor with 175Hz refresh rate.',
    availability: 'Limited Stock',
    specs: {
      'Size': '34 inches',
      'Resolution': '3440 x 1440 (UWQHD)',
      'Panel': 'OLED Curved (1800R)',
      'Refresh Rate': '175Hz',
      'Response Time': '0.1ms GTG',
      'HDR': 'HDR True Black 400',
      'Ports': 'HDMI 2.1, DisplayPort 1.4, USB-C',
      'Stand': 'Full Ergonomic'
    },
    tags: ['monitor', 'gaming', 'curved', 'ultrawide', '175hz', 'oled', 'premium'],
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    discount: 13,
    warranty: '3 Years Samsung Warranty',
    sku: 'SAM-ODYSSEY-G8'
  },
  {
    id: 'samsung-ssd-1tb',
    title: 'Samsung 980 PRO NVMe SSD 1TB',
    price: 18500,
    originalPrice: 21000,
    category: 'Storage',
    subcategory: 'SSDs',
    brand: 'Samsung',
    image: 'products/samsung-980pro.jpg',
    description: 'High-performance PCIe 4.0 NVMe SSD with exceptional speed for gaming and professional workloads.',
    availability: 'In Stock',
    specs: {
      'Capacity': '1TB',
      'Interface': 'PCIe 4.0 x4, NVMe 1.3c',
      'Form Factor': 'M.2 2280',
      'Sequential Read': 'Up to 7,000 MB/s',
      'Sequential Write': 'Up to 5,000 MB/s',
      'TBW': '600 TBW',
      'Warranty': '5 Years'
    },
    tags: ['ssd', 'nvme', 'storage', 'samsung', 'pcie4'],
    rating: 4.9,
    reviewCount: 1234,
    discount: 12,
    warranty: '5 Years Samsung Warranty',
    sku: 'SAM-980PRO-1TB'
  },
  {
    id: 'coolermaster-aio-240',
    title: 'Cooler Master MasterLiquid ML240L RGB V2',
    price: 14500,
    category: 'Cooling',
    subcategory: 'Liquid Coolers',
    brand: 'Cooler Master',
    image: 'products/cm-ml240l.jpg',
    description: 'All-in-one liquid cooler with dual 120mm ARGB fans and efficient cooling performance.',
    availability: 'In Stock',
    specs: {
      'Radiator Size': '240mm',
      'Fan Size': '2x 120mm ARGB',
      'Pump Speed': '4200 RPM ± 10%',
      'Socket Support': 'Intel LGA 1700/1200/115x, AMD AM4/AM5',
      'Tube Length': '410mm',
      'RGB': 'Addressable RGB',
      'Warranty': '2 Years'
    },
    tags: ['cooling', 'aio', 'rgb', 'liquid', 'coolermaster'],
    rating: 4.4,
    reviewCount: 89,
    warranty: '2 Years Cooler Master Warranty',
    sku: 'CM-ML240L-RGB'
  }
]

// Enhanced categories with better structure
export const CATEGORIES: Category[] = [
  {
    id: 'gaming-laptops',
    name: 'Gaming Laptops',
    slug: 'gaming-laptops',
    description: 'High-performance gaming laptops for ultimate mobility',
    icon: '💻',
    featured: true,
    productCount: 45
  },
  {
    id: 'desktop-pcs',
    name: 'Desktop PCs',
    slug: 'desktop-pcs',
    description: 'Custom and pre-built gaming desktop computers',
    icon: '🖥️',
    featured: true,
    productCount: 78
  },
  {
    id: 'keyboards',
    name: 'Keyboards',
    slug: 'keyboards',
    description: 'Mechanical and gaming keyboards',
    icon: '⌨️',
    featured: true,
    productCount: 156
  },
  {
    id: 'mice',
    name: 'Gaming Mice',
    slug: 'gaming-mice',
    description: 'Precision gaming mice for competitive play',
    icon: '🖱️',
    featured: true,
    productCount: 234
  },
  {
    id: 'headphones',
    name: 'Headphones & Headsets',
    slug: 'headphones-headsets',
    description: 'Gaming headsets and premium audio',
    icon: '🎧',
    featured: true,
    productCount: 189
  },
  {
    id: 'monitors',
    name: 'Gaming Monitors',
    slug: 'gaming-monitors',
    description: 'High refresh rate gaming displays',
    icon: '🖥️',
    featured: true,
    productCount: 67
  },
  {
    id: 'storage',
    name: 'Storage',
    slug: 'storage',
    description: 'SSDs, HDDs, and storage solutions',
    icon: '💾',
    featured: false,
    productCount: 123
  },
  {
    id: 'cooling',
    name: 'Cooling',
    slug: 'cooling',
    description: 'CPU coolers and thermal solutions',
    icon: '❄️',
    featured: false,
    productCount: 89
  }
]

// Enhanced brands data
export const BRANDS: Brand[] = [
  {
    id: 'msi',
    name: 'MSI',
    slug: 'msi',
    description: 'Gaming hardware and laptops',
    featured: true,
    productCount: 89
  },
  {
    id: 'razer',
    name: 'Razer',
    slug: 'razer',
    description: 'Gaming peripherals and accessories',
    featured: true,
    productCount: 156
  },
  {
    id: 'logitech',
    name: 'Logitech',
    slug: 'logitech',
    description: 'Computer peripherals and gaming gear',
    featured: true,
    productCount: 234
  },
  {
    id: 'hyperx',
    name: 'HyperX',
    slug: 'hyperx',
    description: 'Gaming headsets and memory',
    featured: true,
    productCount: 67
  },
  {
    id: 'samsung',
    name: 'Samsung',
    slug: 'samsung',
    description: 'Storage and display solutions',
    featured: true,
    productCount: 45
  },
  {
    id: 'dell',
    name: 'Dell',
    slug: 'dell',
    description: 'Monitors and computing solutions',
    featured: false,
    productCount: 34
  },
  {
    id: 'cooler-master',
    name: 'Cooler Master',
    slug: 'cooler-master',
    description: 'Cases, cooling, and power supplies',
    featured: false,
    productCount: 78
  }
]

export const PC_COMPONENTS: PCComponent[] = [
  // Cases
  { 
    id: 'nzxt-h510', 
    name: 'NZXT H510 Elite', 
    price: 18000, 
    category: 'case', 
    formFactor: 'ATX',
    brand: 'NZXT',
    specs: {
      'Type': 'Mid Tower',
      'Material': 'Steel, Tempered Glass',
      'Motherboard': 'ATX, mATX, Mini-ITX',
      'GPU Length': '381mm',
      'CPU Cooler': '165mm'
    }
  },
  { 
    id: 'cm-nr200', 
    name: 'Cooler Master NR200P', 
    price: 16500, 
    category: 'case', 
    formFactor: 'ITX',
    brand: 'Cooler Master',
    specs: {
      'Type': 'Mini-ITX',
      'Material': 'Steel, Mesh',
      'Motherboard': 'Mini-ITX',
      'GPU Length': '330mm',
      'CPU Cooler': '155mm'
    }
  },
  
  // CPUs
  { 
    id: 'i5-13400f', 
    name: 'Intel Core i5-13400F', 
    price: 45000, 
    watts: 148, 
    category: 'cpu', 
    socket: 'LGA1700',
    brand: 'Intel',
    specs: {
      'Cores': '10 (6P+4E)',
      'Threads': '16',
      'Base Clock': '2.5 GHz',
      'Boost Clock': '4.6 GHz',
      'Cache': '20MB'
    }
  },
  { 
    id: 'r5-7600', 
    name: 'AMD Ryzen 5 7600', 
    price: 38000, 
    watts: 105, 
    category: 'cpu', 
    socket: 'AM5',
    brand: 'AMD',
    specs: {
      'Cores': '6',
      'Threads': '12',
      'Base Clock': '3.8 GHz',
      'Boost Clock': '5.1 GHz',
      'Cache': '32MB'
    }
  },
  
  // GPUs
  { 
    id: 'rtx-4060', 
    name: 'NVIDIA GeForce RTX 4060', 
    price: 125000, 
    watts: 115, 
    category: 'gpu',
    brand: 'NVIDIA',
    specs: {
      'Memory': '8GB GDDR6',
      'Memory Bus': '128-bit',
      'CUDA Cores': '3072',
      'RT Cores': '24 (3rd gen)',
      'Tensor Cores': '96 (4th gen)'
    }
  },
  { 
    id: 'rtx-4070', 
    name: 'NVIDIA GeForce RTX 4070', 
    price: 195000, 
    watts: 200, 
    category: 'gpu',
    brand: 'NVIDIA',
    specs: {
      'Memory': '12GB GDDR6X',
      'Memory Bus': '192-bit',
      'CUDA Cores': '5888',
      'RT Cores': '46 (3rd gen)',
      'Tensor Cores': '184 (4th gen)'
    }
  }
]

// Mock reviews data
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev1',
    productId: 'gaming-laptop-rtx4060',
    userId: 'user1',
    userName: 'Ahmed Khan',
    rating: 5,
    title: 'Excellent gaming performance!',
    comment: 'This laptop handles all modern games at high settings. The RTX 4060 is a beast for 1440p gaming.',
    pros: ['Great performance', 'Good build quality', 'Excellent display'],
    cons: ['Battery life could be better'],
    verified: true,
    helpful: 15,
    createdAt: new Date('2024-09-15')
  },
  {
    id: 'rev2',
    productId: 'razer-keyboard-rgb',
    userId: 'user2',
    userName: 'Sarah Ali',
    rating: 4,
    title: 'Great keyboard for gaming',
    comment: 'Love the tactile feel and RGB lighting. Build quality is excellent.',
    pros: ['Tactile switches', 'Beautiful RGB', 'Solid build'],
    cons: ['A bit expensive'],
    verified: true,
    helpful: 8,
    createdAt: new Date('2024-09-20')
  }
]
