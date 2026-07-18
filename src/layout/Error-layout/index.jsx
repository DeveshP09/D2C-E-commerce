import { Link, useRouteError } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'
import { ROUTES } from '../../constants/routes'
import styles from './styles.module.scss'

export const ErrorLayout = () => {
  const error = useRouteError()
  const isNotFound = !error || error.status === 404

  return (
    <section className={styles.error}>
      <FiAlertTriangle className={styles.icon} />
      <h1 className={styles.code}>{isNotFound ? '404' : 'Something went wrong'}</h1>
      <p className={styles.message}>
        {isNotFound
          ? "The page you're looking for doesn't exist or has moved."
          : error?.message || 'An unexpected error occurred.'}
      </p>
      <Link to={ROUTES.home} className={styles.link}>
        Back to home
      </Link>
    </section>
  )
}