import PropTypes from 'prop-types'
import { FiLoader } from 'react-icons/fi'
import styles from './styles.module.scss'

export const Button = ({
  children,
  icon,
  iconPosition = 'left',
  size = 'medium',
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) => {
  const classNames = [
    styles.button,
    styles[size],
    styles[variant],
    fullWidth ? styles.fullWidth : '',
  ]
    .filter(Boolean)
    .join(' ')

  const leadingIcon = loading ? (
    <FiLoader className={styles.spinner} />
  ) : (
    icon && iconPosition === 'left' && icon
  )

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
}
