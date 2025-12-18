import { prisma } from './prisma'
import { generateOrderNumber } from './utils/order'

// Cache function for server-side caching
function cache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return fn as T
}

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
    // Generate order number if not provided
    if (!data.orderNumber) {
      data.orderNumber = await generateOrderNumber()
    }

    return await prisma.order.create({
      data,
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
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
  getDashboardStats: cache(async (range: string = '7d') => {
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      lowStockProducts,
      monthlyRevenue,
      conversionRate,
      averageOrderValue
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { 
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        }
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
            lte: 10 // Low stock threshold
          }
        },
        take: 10
      }),
      // Mock monthly revenue data for now
      Promise.resolve([12000, 15000, 18000, 22000, 19000, 25000, 28000]),
      // Mock conversion rate
      Promise.resolve(3.2),
      // Mock average order value
      Promise.resolve(125.50)
    ])

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
      topProducts,
      lowStockProducts,
      monthlyRevenue,
      conversionRate,
      averageOrderValue
    }
  })
}

// Wishlist Services
export const WishlistService = {
  getWishlist: cache(async (userId: string) => {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),

  addToWishlist: async (userId: string, productId: string) => {
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    })

    if (existing) {
      return existing
    }

    return await prisma.wishlistItem.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    })
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    const item = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    })

    if (!item) {
      throw new Error('Wishlist item not found')
    }

    return await prisma.wishlistItem.delete({
      where: { id: item.id }
    })
  },

  isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
    const item = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    })
    return !!item
  }
}

// Address Services
export const AddressService = {
  getAddresses: cache(async (userId: string) => {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  }),

  getAddress: async (id: string, userId: string) => {
    return await prisma.address.findFirst({
      where: {
        id,
        userId
      }
    })
  },

  createAddress: async (data: any) => {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: data.userId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    return await prisma.address.create({
      data
    })
  },

  updateAddress: async (id: string, userId: string, data: any) => {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
          id: { not: id }
        },
        data: {
          isDefault: false
        }
      })
    }

    return await prisma.address.update({
      where: { id },
      data
    })
  },

  deleteAddress: async (id: string, userId: string) => {
    return await prisma.address.delete({
      where: {
        id,
        userId
      }
    })
  },

  setDefaultAddress: async (id: string, userId: string) => {
    // Unset all other defaults
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true
      },
      data: {
        isDefault: false
      }
    })

    // Set this as default
    return await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    })
  }
}

// Support Ticket Services
export const SupportTicketService = {
  getTickets: cache(async (userId: string) => {
    return await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),

  getTicket: async (id: string, userId: string) => {
    return await prisma.supportTicket.findFirst({
      where: {
        id,
        userId
      }
    })
  },

  createTicket: async (data: any) => {
    return await prisma.supportTicket.create({
      data
    })
  },

  updateTicket: async (id: string, userId: string, data: any) => {
    return await prisma.supportTicket.update({
      where: { id },
      data
    })
  },

  deleteTicket: async (id: string, userId: string) => {
    return await prisma.supportTicket.delete({
      where: {
        id,
        userId
      }
    })
  }
}

// PC Build Services
export const PCBuildService = {
  getBuilds: cache(async (userId: string) => {
    return await prisma.pCBuild.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),

  getBuild: async (id: string, userId: string) => {
    return await prisma.pCBuild.findFirst({
      where: {
        id,
        userId
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true
              }
            }
          }
        }
      }
    })
  },

  createBuild: async (data: any) => {
    return await prisma.pCBuild.create({
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

  updateBuild: async (id: string, userId: string, data: any) => {
    return await prisma.pCBuild.update({
      where: { id },
      data
    })
  },

  deleteBuild: async (id: string, userId: string) => {
    return await prisma.pCBuild.delete({
      where: {
        id,
        userId
      }
    })
  },

  addItemToBuild: async (buildId: string, productId: string, category: string, quantity: number = 1) => {
    return await prisma.pCBuildItem.create({
      data: {
        buildId,
        productId,
        category,
        quantity
      },
      include: {
        product: true
      }
    })
  },

  removeItemFromBuild: async (itemId: string, buildId: string, userId: string) => {
    // Verify build belongs to user
    const build = await prisma.pCBuild.findFirst({
      where: {
        id: buildId,
        userId
      }
    })

    if (!build) {
      throw new Error('Build not found or unauthorized')
    }

    return await prisma.pCBuildItem.delete({
      where: { id: itemId }
    })
  }
}

// Newsletter Services
export const NewsletterService = {
  subscribe: async (email: string, firstName?: string, lastName?: string) => {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return existing
      }
      // Reactivate if unsubscribed
      return await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          status: 'ACTIVE',
          firstName,
          lastName,
          unsubscribedAt: null
        }
      })
    }

    return await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName,
        lastName,
        status: 'ACTIVE'
      }
    })
  },

  unsubscribe: async (email: string) => {
    return await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date()
      }
    })
  },

  getSubscribers: async (page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit
    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        skip,
        take: limit,
        orderBy: {
          subscribedAt: 'desc'
        }
      }),
      prisma.newsletterSubscriber.count()
    ])

    return {
      subscribers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }
}