import { z } from 'zod'

/**
 * Product validation schemas
 */
export const ProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  title: z.string().min(1, 'Product title is required').max(200, 'Title too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  image: z.string().url('Invalid image URL').or(z.any()),
  gallery: z.array(z.string().url()).optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  availability: z.enum(['In Stock', 'Limited Stock', 'Preorder', 'Out of Stock']).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
  discount: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  weight: z.number().positive().optional(),
  warranty: z.string().optional(),
  featured: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  availability: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'rating_desc', 'newest']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  search: z.string().optional()
})

/**
 * User validation schemas
 */
export const UserRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const UserProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+92[0-9]{10}$/, 'Invalid Pakistani phone number').optional(),
  address: z.object({
    street: z.string().min(5, 'Street address too short').optional(),
    city: z.string().min(2, 'City name too short').optional(),
    province: z.string().min(2, 'Province name too short').optional(),
    postalCode: z.string().regex(/^[0-9]{5}$/, 'Invalid postal code').optional(),
    country: z.string().default('Pakistan')
  }).optional()
})

/**
 * Cart validation schemas
 */
export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
  price: z.number().positive(),
  title: z.string().min(1),
  image: z.string(),
  availability: z.string().optional()
})

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  totalItems: z.number().min(0),
  totalPrice: z.number().min(0),
  shippingCost: z.number().min(0).default(0),
  discount: z.number().min(0).default(0)
})

/**
 * Order validation schemas
 */
export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^\+92[0-9]{10}$/, 'Invalid Pakistani phone number'),
  address: z.string().min(10, 'Complete address required'),
  city: z.string().min(2, 'City required'),
  province: z.string().min(2, 'Province required'),
  postalCode: z.string().regex(/^[0-9]{5}$/, 'Invalid postal code'),
  country: z.string().default('Pakistan')
})

export const OrderSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['card', 'cod', 'bank_transfer']),
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  notes: z.string().max(500).optional()
})

/**
 * Newsletter subscription schema
 */
export const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    newProducts: z.boolean().default(true),
    deals: z.boolean().default(true),
    newsletter: z.boolean().default(true)
  }).optional()
})

/**
 * Contact form schema
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject too short').max(100, 'Subject too long'),
  message: z.string().min(10, 'Message too short').max(1000, 'Message too long'),
  phone: z.string().regex(/^\+92[0-9]{10}$/, 'Invalid Pakistani phone number').optional()
})

/**
 * Review schema
 */
export const ReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Review title too short').max(100, 'Review title too long'),
  comment: z.string().min(10, 'Review too short').max(500, 'Review too long'),
  recommend: z.boolean().default(true),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional()
})

// Type exports
export type Product = z.infer<typeof ProductSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>
export type UserRegistration = z.infer<typeof UserRegistrationSchema>
export type UserLogin = z.infer<typeof UserLoginSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type Order = z.infer<typeof OrderSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>
export type Newsletter = z.infer<typeof NewsletterSchema>
export type ContactForm = z.infer<typeof ContactFormSchema>
export type Review = z.infer<typeof ReviewSchema>