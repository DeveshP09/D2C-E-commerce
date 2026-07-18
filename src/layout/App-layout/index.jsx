import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components/layout-components/Navbar'
import { CartDrawer } from '../../components/layout-components/CartDrawer'
import { useCart } from '../../hooks/useCart'
import styles from './styles.module.scss'

export const AppLayout = () => {
  const { itemCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className={styles.root}>
      <header className={styles.navbar}>
        <Navbar cartCount={itemCount} onCartClick={() => setIsCartOpen(true)} />
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
