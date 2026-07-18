import { useEffect, useState } from 'react'
import ProductService from '../../../services/ProductService'
import { mockAddToCart } from '../../../services/mockCart'
import { getStockInfo, getDefaultVariant, hasVariants } from '../../../data/productMeta'
import { ProductCard } from '../../../components/reusable-components/product-card'
import { useCart } from '../../../hooks/useCart'
import { ROUTES } from '../../../constants/routes'
import styles from './styles.module.scss'

const SKELETON_COUNT = 8

export const ProductListing = () => {
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    ProductService.list()
      .then((data) => {
        if (active) setProducts(data)
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
  }, [])

  if (loading) {
    return (
      <section className={styles.listing}>
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.listing}>
        <div className={styles.state}>
          <h2>Something went wrong</h2>
          <p>We couldn&apos;t load products. Please try again.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.listing}>
      <div className={styles.grid}>
        {products.map((product) => {
          const { soldOut, status } = getStockInfo(product.id)
          return (
            <ProductCard
              key={product.id}
              to={ROUTES.productDetail(product.id)}
              image={product.image}
              title={product.title}
              category={product.category}
              price={product.price}
              rating={product.rating}
              soldOut={soldOut}
              stockStatus={status}
              onAddToCart={async () => {
                const variant = hasVariants(product.category)
                  ? getDefaultVariant(product.id)
                  : {}
                await mockAddToCart({ id: product.id, ...variant })
                addItem(product, variant)
              }}
            />
          )
        })}
      </div>
    </section>
  )
}

export const Component = ProductListing
