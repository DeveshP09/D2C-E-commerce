import PropTypes from 'prop-types'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { formatCount } from '../../../utils/number'
import styles from './styles.module.scss'

const STARS = [1, 2, 3, 4, 5]

export const Rating = ({ rate, count }) => {
  return (
    <div className={styles.rating}>
      <span className={styles.value}>{rate.toFixed(1)}</span>

      <span className={styles.stars}>
        {STARS.map((position) => {
          if (rate >= position) return <FaStar key={position} />
          if (rate >= position - 0.5) return <FaStarHalfAlt key={position} />
          return <FaRegStar key={position} />
        })}
      </span>

      <span className={styles.count}>({formatCount(count)})</span>
    </div>
  )
}

Rating.propTypes = {
  rate: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
}
