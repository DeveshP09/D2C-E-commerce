
export const ROUTES = {
  home: '/',
  categories: '/categories',
  bestSellers: '/best-sellers',
  newArrivals: '/new-arrivals',

  productDetail: (id, variant = {}) => {
    const params = new URLSearchParams()
    if (variant.color) params.set('color', variant.color)
    if (variant.size) params.set('size', variant.size)
    const query = params.toString()
    return `/product/${id}${query ? `?${query}` : ''}`
  },
}

export const ROUTE_PATHS = {
  productDetail: 'product/:id',
  categories: 'categories',
  notFound: '*',
}
