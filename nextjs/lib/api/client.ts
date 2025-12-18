/**
 * API Client for making requests to backend endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for NextAuth
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      response.status,
      error.error || `HTTP ${response.status}`,
      error.details
    )
  }

  return response.json()
}

// Cart API
export const cartApi = {
  get: () => apiRequest('/api/cart'),
  add: (productId: string, quantity: number = 1) =>
    apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (itemId: string, quantity: number) =>
    apiRequest(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  remove: (itemId: string) =>
    apiRequest(`/api/cart/${itemId}`, {
      method: 'DELETE',
    }),
  clear: () =>
    apiRequest('/api/cart', {
      method: 'DELETE',
    }),
}

// Wishlist API
export const wishlistApi = {
  get: () => apiRequest('/api/wishlist'),
  add: (productId: string) =>
    apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  remove: (productId: string) =>
    apiRequest(`/api/wishlist/${productId}`, {
      method: 'DELETE',
    }),
}

// Orders API
export const ordersApi = {
  get: (page: number = 1, limit: number = 20, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    })
    return apiRequest(`/api/orders?${params}`)
  },
  getById: (orderId: string) => apiRequest(`/api/orders/${orderId}`),
}

// Addresses API
export const addressesApi = {
  get: () => apiRequest('/api/addresses'),
  create: (address: any) =>
    apiRequest('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  update: (addressId: string, address: any) =>
    apiRequest(`/api/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
  delete: (addressId: string) =>
    apiRequest(`/api/addresses/${addressId}`, {
      method: 'DELETE',
    }),
  setDefault: (addressId: string) =>
    apiRequest(`/api/addresses/${addressId}/set-default`, {
      method: 'PUT',
    }),
}

// Reviews API
export const reviewsApi = {
  getByProduct: (productId: string) =>
    apiRequest(`/api/reviews?productId=${productId}`),
  create: (review: {
    productId: string
    rating: number
    title: string
    comment: string
    pros?: string[]
    cons?: string[]
  }) =>
    apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),
  markHelpful: (reviewId: string) =>
    apiRequest(`/api/reviews/${reviewId}/helpful`, {
      method: 'PUT',
    }),
}

// Support API
export const supportApi = {
  get: () => apiRequest('/api/support'),
  create: (ticket: { subject: string; message: string; priority?: string }) =>
    apiRequest('/api/support', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),
  getById: (ticketId: string) => apiRequest(`/api/support/${ticketId}`),
  update: (ticketId: string, updates: any) =>
    apiRequest(`/api/support/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  delete: (ticketId: string) =>
    apiRequest(`/api/support/${ticketId}`, {
      method: 'DELETE',
    }),
}

// PC Builder API
export const pcBuilderApi = {
  get: () => apiRequest('/api/pc-builder'),
  create: (build: { name: string; description?: string; public?: boolean }) =>
    apiRequest('/api/pc-builder', {
      method: 'POST',
      body: JSON.stringify(build),
    }),
  getById: (buildId: string) => apiRequest(`/api/pc-builder/${buildId}`),
  update: (buildId: string, updates: any) =>
    apiRequest(`/api/pc-builder/${buildId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  delete: (buildId: string) =>
    apiRequest(`/api/pc-builder/${buildId}`, {
      method: 'DELETE',
    }),
  addItem: (buildId: string, item: { productId: string; category: string; quantity?: number }) =>
    apiRequest(`/api/pc-builder/${buildId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  removeItem: (buildId: string, itemId: string) =>
    apiRequest(`/api/pc-builder/${buildId}/items/${itemId}`, {
      method: 'DELETE',
    }),
}

// Newsletter API
export const newsletterApi = {
  subscribe: (email: string, firstName?: string, lastName?: string) =>
    apiRequest('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, firstName, lastName }),
    }),
  unsubscribe: (email: string) =>
    apiRequest('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
}

// Checkout API
export const checkoutApi = {
  process: (checkoutData: {
    shippingAddressId: string
    billingAddressId: string
    paymentMethod: string
    shippingMethod?: string
    notes?: string
    discountAmount?: number
    taxAmount?: number
    shippingAmount?: number
  }) =>
    apiRequest('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),
}

// Payment API
export const paymentApi = {
  createIntent: (amount: number, currency: string = 'pkr') =>
    apiRequest('/api/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    }),
}

export { ApiError }

