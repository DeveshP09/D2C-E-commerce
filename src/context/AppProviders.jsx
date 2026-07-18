import PropTypes from 'prop-types'
import { CartProvider } from './CartProvider'

export const AppProviders = ({ children }) => {
  return <CartProvider>{children}</CartProvider>
}

AppProviders.propTypes = {
  children: PropTypes.node,
}
