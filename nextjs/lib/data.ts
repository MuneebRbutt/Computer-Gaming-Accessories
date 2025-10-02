import type { StaticImageData } from 'next/image'

import Img1 from '../images/Image (1).png'
import Img2 from '../images/Image (2).png'
import Img3 from '../images/Image (3).png'
import Img4 from '../images/Image (4).png'
import Img5 from '../images/Image (5).png'
import Img6 from '../images/Image (6).png'
import Img7 from '../images/Image (7).png'
import Img8 from '../images/Image (8).png'
import Img9 from '../images/Image (9).png'
import Img10 from '../images/Image (10).png'
import Img11 from '../images/Image (11).png'
import Img12 from '../images/Image (12).png'
import Img13 from '../images/Image (13).png'
import Img14 from '../images/Image (14).png'
import Img15 from '../images/Image (15).png'
import Img16 from '../images/Image (16).png'
import Img17 from '../images/Image (17).png'
import Img18 from '../images/Image (18).png'
import Img19 from '../images/Image (19).png'
import Img20 from '../images/Image (20).png'
import Img21 from '../images/Image (21).png'
import Img22 from '../images/Image (22).png'

export interface Product {
  id: string
  title: string
  price: number
  category: string
  subcategory?: string
  brand: string
  image: string | StaticImageData
  gallery?: (string | StaticImageData)[]
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
    image: Img1,
    gallery: [Img1, Img2],
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
    image: Img3,
    gallery: [Img3, Img4],
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
    image: Img5,
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
    image: Img6,
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
    image: Img7,
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
    image: Img8,
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
    image: Img9,
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
    image: Img10,
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
