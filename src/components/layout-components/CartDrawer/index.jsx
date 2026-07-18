import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../../../hooks/useCart'
import { Button } from '../../reusable-components/button'
import { formatPrice } from '../../../utils/currency'
import { ROUTES } from '../../../constants/routes'
import styles from './styles.module.scss'

const productPath = (item) =>
  ROUTES.productDetail(item.id, { color: item.color, size: item.size })


export const CartDrawer = ({ isOpen, onClose }) => {
  const { items, subtotal, itemCount, removeItem, setQuantity } = useCart()

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const grandTotal = subtotal

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
      />
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.heading}>Your Cart ({itemCount})</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close cart"
          >
            <FiX />
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <FiShoppingCart className={styles.emptyIcon} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item.key} className={styles.item}>
                  <Link to={productPath(item)} onClick={onClose} className={styles.thumbLink}>
                    <img className={styles.thumb} src={item.image} alt={item.title} />
                  </Link>

                  <div className={styles.details}>
                    <Link to={productPath(item)} onClick={onClose} className={styles.nameLink}>
                      <p className={styles.name}>{item.title}</p>
                    </Link>
                    {(item.color || item.size) && (
                      <span className={styles.variant}>
                        {[item.color, item.size].filter(Boolean).join(' / ')}
                      </span>
                    )}
                    <span className={styles.unit}>{formatPrice(item.price)}</span>

                    <div className={styles.qty}>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.title}`}
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>

            <footer className={styles.summary}>
              <div className={styles.row}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`${styles.row} ${styles.total}`}>
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <Button fullWidth size="large">
                Checkout
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

CartDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
