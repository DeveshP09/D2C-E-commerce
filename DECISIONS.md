# Decisions

## Context vs Redux for the cart

The brief pointed at the Context API for state, over the Redux Toolkit. I ended up choosing Context with
a `useReducer` cart slice, and I think it's the honest fit here rather than the more impressive option.

The reason is that the cart is the only global state in
this app currently. Everything else is either server data fetched per page or local UI
state. Standing up a Redux store, slices and the provider for a single reducer
felt like paying setup cost for scale that doesn't exist yet. Context keeps the
dependency list lean, and the reducer still gives me one testable place for the
add / remove / quantity logic. Persistence was just a small effect that writes to
localStorage on change and hydrates on load, so I didn't need redux-persist.

Where Redux would genuinely have won: devtools for debugging,
and a cleaner scaling story if it had more concerns — auth,
wishlist, orders. If this were a real product requirement, I'd
probably start with it. For current scope, Context was the lighter and
more feasible call.

A related sub-decision that fell out: cart lines are keyed by
`productId-colour-size` rather than just the id, so the same shirt in two sizes
is two separate lines. That one felt clearly right, but it shaped the reducer more than anything else.

## What I'd clean up with more time

Currently, styling tokens are scattered across each SCSS module. Each module redeclares
its own `$color-primary`, spacing and breakpoint values. It works, but they could be consolidated into a shared scss file and auto-injected through Vite. I just didn't get back to it.

Few honest gaps: 
no tests yet — the variant selector (sold-out state, disabled CTA, quantity cap)

For search/filtering I'd add keyword search on title, plus category, price-range
and rating filters, with sort by price/rating and popularity (`rating.count`) as
"Best Sellers". This all i would love to implement.

## More design decisions

- Centralized config routing
- Data layer: ApiClient wrapper, async add-to-cart
- Error handling: App-level error boundary
- Path constants