import { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { ROUTES } from '../../../constants/routes'
import styles from './styles.module.scss'

const nav_links = [
  { label: 'All products', to: ROUTES.home },
  { label: 'Best Sellers', to: ROUTES.bestSellers },
  { label: 'Categories', to: ROUTES.categories },
  { label: 'New Arrivals', to: ROUTES.newArrivals },
]

export const Navbar = ({ cartCount = 0, onCartClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <NavLink to={ROUTES.home} className={styles.logo} onClick={() => setMenuOpen(false)}>
        Devesh Shop
      </NavLink>

      <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        {nav_links.map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              end
              className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <div className={styles.search}>
          <FiSearch className={styles.searchIcon} />
          <input type="search" placeholder="Search..." className={styles.searchInput} />
        </div>

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Cart"
          onClick={onCartClick}
        >
          <FiShoppingCart className={styles.icon} />
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>

        <button type="button" className={styles.iconButton}>
          <FiUser className={styles.icon} />
        </button>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.menuToggle}`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX className={styles.icon} /> : <FiMenu className={styles.icon} />}
        </button>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
}
