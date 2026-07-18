import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import ProductService from '../../../services/ProductService'
import { mockAddToCart } from '../../../services/mockCart'
import { getProductVariants, getStockInfo, hasVariants } from '../../../data/productMeta'
import { useCart } from '../../../hooks/useCart'
import { Button } from '../../../components/reusable-components/button'
import { Rating } from '../../../components/reusable-components/rating'
import { formatPrice } from '../../../utils/currency'
import { ROUTES } from '../../../constants/routes'
import styles from './styles.module.scss'

const THUMB_COUNT = 4

const ProductDetailView = ({ productId }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let active = true

    ProductService.getById(productId)
      .then((data) => {
        if (!active) return
        if (!data || !data.id) {
          setError(new Error('Product not found'))
          return
        }
        setProduct(data)
      })
      .catch((err) => {
        if (active) setError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId])

  const variants = useMemo(() => getProductVariants(productId), [productId])

  const colorParam = searchParams.get('color')
  const sizeParam = searchParams.get('size')

  const selectedColor =
    variants.colors.find((color) => color.name === colorParam) ?? variants.colors[0]

  const firstAvailableSize = variants.sizes.find((size) => !size.soldOut) ?? variants.sizes[0]
  const requestedSize = variants.sizes.find((size) => size.label === sizeParam)
  const selectedSize =
    requestedSize && !requestedSize.soldOut ? requestedSize : firstAvailableSize

  const canonicalColor = selectedColor?.name
  const canonicalSize = selectedSize?.label

  const showVariants = product ? hasVariants(product.category) : false
  const productStock = getStockInfo(productId)

  useEffect(() => {
    if (!product || !showVariants) return
    if (canonicalColor === colorParam && canonicalSize === sizeParam) return

    const params = {}
    if (canonicalColor) params.color = canonicalColor
    if (canonicalSize) params.size = canonicalSize
    setSearchParams(params, { replace: true })
  }, [product, showVariants, canonicalColor, canonicalSize, colorParam, sizeParam, setSearchParams])

  const changeVariant = (colorName, sizeLabel) => {
    const params = {}
    if (colorName) params.color = colorName
    if (sizeLabel) params.size = sizeLabel
    setSearchParams(params, { replace: true })
  }

  const handleSelectColor = (color) => changeVariant(color.name, canonicalSize)

  const handleSelectSize = (size) => {
    if (size.soldOut) return
    setQuantity(1)
    changeVariant(canonicalColor, size.label)
  }

  const soldOut = showVariants ? !selectedSize || selectedSize.soldOut : productStock.soldOut
  const activeStock = showVariants ? (selectedSize?.stock ?? 0) : productStock.stock
  const activeStatus = showVariants ? selectedSize?.status : productStock.status
  const maxQuantity = Math.max(1, activeStock)

  const decrement = () => setQuantity((q) => Math.max(1, q - 1))
  const increment = () => setQuantity((q) => Math.min(maxQuantity, q + 1))

  const handleAddToCart = async () => {
    if (!product || soldOut || adding) return
    const variant = showVariants ? { color: canonicalColor, size: canonicalSize } : {}
    setAdding(true)
    try {
      await mockAddToCart({ id: product.id, ...variant, quantity })
      addItem(product, { ...variant, quantity })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <section className={styles.detail}>
        <div className={styles.grid}>
          <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
          <div className={styles.skeletonInfo}>
            <div className={styles.skeleton} style={{ width: '40%', height: '1rem' }} />
            <div className={styles.skeleton} style={{ width: '80%', height: '1.5rem' }} />
            <div className={styles.skeleton} style={{ width: '30%', height: '1rem' }} />
            <div className={styles.skeleton} style={{ width: '60%', height: '3rem' }} />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.detail}>
        <div className={styles.state}>
          <h2>Product not found</h2>
          <p>We couldn&apos;t load this product. It may not exist.</p>
          <Link to={ROUTES.home}>Back to products</Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.detail}>
      <div className={styles.grid}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className={styles.thumbs}>
            {Array.from({ length: THUMB_COUNT }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumb} ${index === activeImage ? styles.thumbActive : ''}`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={product.image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <span className={styles.brand}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          {product.rating && (
            <Rating rate={product.rating.rate} count={product.rating.count} />
          )}
          <p className={styles.price}>{formatPrice(product.price)}</p>

          {showVariants && (
            <>
              <div className={styles.variant}>
                <span className={styles.variantLabel}>
                  Colour: <strong>{selectedColor?.name}</strong>
                </span>
                <div className={styles.swatches}>
                  {variants.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      className={`${styles.swatch} ${
                        color.name === canonicalColor ? styles.swatchActive : ''
                      }`}
                      style={{ background: color.hex }}
                      onClick={() => handleSelectColor(color)}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.variant}>
                <span className={styles.variantLabel}>
                  Size: <strong>{selectedSize?.label}</strong>
                </span>
                <div className={styles.sizes}>
                  {variants.sizes.map((size) => {
                    const classNames = [
                      styles.size,
                      size.label === canonicalSize ? styles.sizeActive : '',
                      size.soldOut ? styles.sizeSoldOut : '',
                      size.status === 'low-stock' ? styles.sizeLow : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <button
                        key={size.label}
                        type="button"
                        className={classNames}
                        disabled={size.soldOut}
                        onClick={() => handleSelectSize(size)}
                      >
                        {size.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {!soldOut && activeStatus === 'low-stock' && (
            <span className={styles.lowNote}>Only {activeStock} left</span>
          )}

          <div className={styles.purchase}>
            <div className={styles.qty}>
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1 || soldOut}
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= maxQuantity || soldOut}
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </div>

            <Button
              size="large"
              icon={<FiShoppingCart />}
              disabled={soldOut}
              loading={adding}
              onClick={handleAddToCart}
            >
              {soldOut ? 'Sold Out' : adding ? 'Adding…' : 'Add to Cart'}
            </Button>
          </div>

          <p className={styles.description}>{product.description}</p>
        </div>
      </div>
    </section>
  )
}

ProductDetailView.propTypes = {
  productId: PropTypes.number.isRequired,
}

export const ProductDetail = () => {
  const { id } = useParams()
  return <ProductDetailView key={id} productId={Number(id)} />
}

export const Component = ProductDetail
