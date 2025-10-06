import { prisma } from './prisma'
import { cache } from 'react'

// Product Services
export const ProductService = {
  // Get all products with pagination and filters
  getProducts: cache(async (params: {
    page?: number
    limit?: number
    category?: string
    brand?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED'
    featured?: boolean
    sortBy?: 'createdAt' | 'price' | 'title' | 'averageRating'
    sortOrder?: 'asc' | 'desc'
  }) => {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      status = 'ACTIVE',
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit
    
    const where: any = {
      status,
      ...(category && {
        category: {
          slug: category
        }
      }),
      ...(brand && {
        brand: {
          slug: brand
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } }
        ]
      }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(featured !== undefined && { featured })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }),

  // Get single product by ID or slug
  getProduct: cache(async (idOrSlug: string) => {
    return await prisma.product.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  }),

  // Create product (Admin only)
  createProduct: async (data: any) => {
    try {
      console.log('ProductService.createProduct - Data received:', JSON.stringify(data, null, 2))
      
      const result = await prisma.product.create({
        data,
        include: {
          category: true,
          brand: true
        }
      })
      
      console.log('ProductService.createProduct - Success:', result.id)
      return result
    } catch (error) {
      console.error('ProductService.createProduct - Detailed error:', error)
      throw error
    }
  },

  // Update product
  updateProduct: async (id: string, data: any) => {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        brand: true
      }
    })
  },

  // Delete product
  deleteProduct: async (id: string) => {
    return await prisma.product.delete({
      where: { id }
    })
  },

  // Get featured products
  getFeaturedProducts: cache(async (limit: number = 8) => {
    return await prisma.product.findMany({
      where: {
        featured: true,
        status: 'ACTIVE'
      },
      include: {
        category: true,
        brand: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),

  // Search products
  searchProducts: cache(async (query: string, limit: number = 10) => {
    return await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      include: {
        category: true,
        brand: true
      },
      take: limit
    })
  })
}

// Category Services
export const CategoryService = {
  getCategories: cache(async () => {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })
  }),

  getFeaturedCategories: cache(async () => {
    return await prisma.category.findMany({
      where: { featured: true },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })
  }),

  createCategory: async (data: any) => {
    return await prisma.category.create({ data })
  },

  updateCategory: async (id: string, data: any) => {
    return await prisma.category.update({
      where: { id },
      data
    })
  },

  deleteCategory: async (id: string) => {
    return await prisma.category.delete({
      where: { id }
    })
  }
}

// User Services
export const UserService = {
  getUserById: cache(async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  }),

  getUserByEmail: cache(async (email: string) => {
    return await prisma.user.findUnique({
      where: { email }
    })
  }),

  getUserByUsername: cache(async (username: string) => {
    return await prisma.user.findUnique({
      where: { username }
    })
  }),

  createUser: async (data: any) => {
    return await prisma.user.create({ data })
  },

  updateUser: async (id: string, data: any) => {
    return await prisma.user.update({
      where: { id },
      data
    })
  },

  isAdmin: async (userId: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  }
}

// Order Services
export const OrderService = {
  getOrders: cache(async (params: {
    userId?: string
    page?: number
    limit?: number
    status?: string
    search?: string
  }) => {
    const { userId, page = 1, limit = 20, status, search } = params
    const skip = (page - 1) * limit

    const where: any = {
      ...(userId && { userId }),
      ...(status && { status: status as any })
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  images: true
                }
              }
            }
          },
          shippingAddress: true,
          billingAddress: true
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count({ where })
    ])

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }),

  createOrder: async (data: any) => {
    return await prisma.order.create({
      data,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  },

  updateOrderStatus: async (id: string, status: string) => {
    return await prisma.order.update({
      where: { id },
      data: { status: status as any }
    })
  },

  updateOrder: async (id: string, data: any) => {
    return await prisma.order.update({
      where: { id },
      data
    })
  }
}

// Cart Services
export const CartService = {
  getCart: cache(async (userId: string) => {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    })
  }),

  addToCart: async (userId: string, productId: string, quantity: number) => {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) throw new Error('Product not found')

    // Find existing cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    })

    if (existingItem) {
      // Update existing item
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity
          }
        }
      })
    } else {
      // Create new item
      return await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          price: product.price
        },
        include: {
          product: true
        }
      })
    }
  },

  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    // Find the cart item first
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    })

    if (!cartItem) {
      throw new Error('Cart item not found')
    }

    if (quantity <= 0) {
      return await prisma.cartItem.delete({
        where: { id: cartItem.id }
      })
    }

    return await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity }
    })
  },

  clearCart: async (userId: string) => {
    return await prisma.cartItem.deleteMany({
      where: { userId }
    })
  }
}

// Review Services
export const ReviewService = {
  getProductReviews: cache(async (productId: string) => {
    return await prisma.review.findMany({
      where: {
        productId,
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),

  createReview: async (data: any) => {
    return await prisma.review.create({
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
  },

  updateReviewStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    return await prisma.review.update({
      where: { id },
      data: { status }
    })
  }
}

// Analytics Services
export const AnalyticsService = {
  getDashboardStats: cache(async () => {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' }
      }),
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: { firstName: true, lastName: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.findMany({
        take: 5,
        include: {
          _count: {
            select: { orderItems: true }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        }
      }),
      prisma.product.findMany({
        where: {
          trackQuantity: true,
          quantity: {
            lte: prisma.product.fields.lowStockThreshold
          }
        },
        take: 10
      })
    ])

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
      topProducts,
      lowStockProducts
    }
  })
}