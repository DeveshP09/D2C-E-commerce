import { useEffect, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import { CartContext } from './context'

const STORAGE_KEY = 'cart'

const init = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const line = action.payload
      const existing = state.find((item) => item.key === line.key)
      if (existing) {
        return state.map((item) =>
          item.key === line.key
            ? { ...item, quantity: item.quantity + line.quantity }
            : item,
        )
      }
      return [...state, line]
    }
    case 'REMOVE':
      return state.filter((item) => item.key !== action.payload)
    case 'SET_QUANTITY':
      return state.map((item) =>
        item.key === action.payload.key
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item,
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, undefined, init)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      items,
      itemCount,
      subtotal,
      addItem: (product, options = {}) => {
        const { color = null, size = null, quantity = 1 } = options
        const key = [product.id, color, size].filter(Boolean).join('-')
        dispatch({
          type: 'ADD',
          payload: {
            key,
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            color,
            size,
            quantity,
          },
        })
      },
      removeItem: (key) => dispatch({ type: 'REMOVE', payload: key }),
      setQuantity: (key, quantity) =>
        dispatch({ type: 'SET_QUANTITY', payload: { key, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node,
}
