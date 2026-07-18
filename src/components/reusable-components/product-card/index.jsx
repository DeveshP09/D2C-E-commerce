import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { Button } from '../button'
import { Rating } from '../rating'
import { formatPrice } from '../../../utils/currency'
import styles from './styles.module.scss'

export const ProductCard = ({
  to,
  image,
  title,
  category,
  price,
  rating,
  soldOut = false,
  stockStatus = 'in-stock',
  onAddToCart,
}) => {
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!onAddToCart || adding) return
    setAdding(true)
    try {
      await onAddToCart()
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* Image links to the detail page; the CTA is kept outside the link
            so we never nest a <button> inside an <a>. */}
        <Link to={to} className={styles.frame} aria-label={title}>
          <img className={styles.image} src={image} alt={title} loading="lazy" />
          {soldOut && <span className={styles.ribbon}>Sold Out</span>}
        </Link>

        <div className={styles.cta}>
          <Button
            fullWidth
            size="medium"
            icon={<FiShoppingCart />}
            disabled={soldOut}
            loading={adding}
            onClick={handleAddToCart}
          >
            {soldOut ? 'Sold Out' : adding ? 'Adding…' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{category}</span>
        <Link to={to} className={styles.titleLink}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        {rating && <Rating rate={rating.rate} count={rating.count} />}
        <div className={styles.priceRow}>
          <p className={styles.price}>{formatPrice(price)}</p>
          {!soldOut && stockStatus === 'low-stock' && (
            <span className={`${styles.stock} ${styles.stockLow}`}>Only few left</span>
          )}
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  to: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  rating: PropTypes.shape({
    rate: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  }),
  soldOut: PropTypes.bool,
  stockStatus: PropTypes.oneOf(['in-stock', 'low-stock', 'sold-out']),
  onAddToCart: PropTypes.func,
}
