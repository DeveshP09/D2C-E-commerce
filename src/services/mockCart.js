
export const mockAddToCart = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), 500)
  })