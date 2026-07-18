
const LOW_STOCK = 3

const classify = (stock) => {
  const soldOut = stock === 0
  const status = soldOut
    ? 'sold-out'
    : stock <= LOW_STOCK
      ? 'low-stock'
      : 'in-stock'
  return { stock, soldOut, status }
}

export const getStockInfo = (id) => classify(id % 7)

const COLOR_PALETTE = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f4f4f4' },
  { name: 'Navy', hex: '#1f3a5f' },
  { name: 'Olive', hex: '#5b6236' },
  { name: 'Sand', hex: '#c9b18b' },
  { name: 'Crimson', hex: '#8c2f39' },
]

const SIZES = ['S', 'M', 'L', 'XL']

const VARIANT_CATEGORIES = ["men's clothing", "women's clothing"]

export const hasVariants = (category) => VARIANT_CATEGORIES.includes(category)

export const getColors = (id) => {
  const count = 2 + (id % 3) // 2..4 colours
  const start = id % COLOR_PALETTE.length
  return Array.from({ length: count }, (_, i) => COLOR_PALETTE[(start + i) % COLOR_PALETTE.length])
}

export const getSizes = (id) =>
  SIZES.map((label, index) => ({ label, ...classify((id + index * 3) % 7) }))

export const getProductVariants = (id) => ({
  colors: getColors(id),
  sizes: getSizes(id),
})

export const getDefaultVariant = (id) => {
  const colors = getColors(id)
  const sizes = getSizes(id)
  const size = sizes.find((s) => !s.soldOut) ?? sizes[0]
  return {
    color: colors[0]?.name ?? null,
    size: size?.label ?? null,
  }
}
