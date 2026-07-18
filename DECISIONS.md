# Decisions

## The one I went back and forth on: Context vs Redux for the cart

The brief pointed at the Context API for state, but Redux Toolkit was on the
table too and it's what I'd normally reach for. I ended up choosing Context with
a `useReducer` cart slice, and I think it's the honest fit here rather than the
more impressive-sounding option.

The reasoning is that the cart is the only piece of genuinely global state in
this app. Everything else is either server data fetched per page or local UI
state. Standing up a Redux store, slices and the provider for a single reducer
felt like paying setup cost for scale that doesn't exist yet. Context keeps the
dependency list lean, and the reducer still gives me one testable place for the
add / remove / quantity logic. Persistence is just a small effect that writes to
localStorage on change and hydrates on load, so I didn't need redux-persist
either.

Where Redux would genuinely have won: devtools and time-travel while debugging,
and a cleaner scaling story once there are more cross-cutting concerns — auth,
wishlist, orders. If this were a real product that I expected to grow, I'd
probably start with it. For a two-route assignment, Context was the lighter and
more defensible call, but it's close and I'd happily argue the other side.

A related sub-decision that fell out of this: cart lines are keyed by
`productId-colour-size` rather than just the id, so the same shirt in two sizes
is two separate lines. That one felt clearly right, so it wasn't much of a
debate — but it shaped the reducer more than anything else.

## What I'd clean up with more time

The most obvious thing is styling tokens. Right now each SCSS module redeclares
its own `$color-primary`, spacing and breakpoint values. It works, but they've
already started to drift between files. I'd pull them into a shared
`styles/_variables.scss` and auto-inject it through Vite — that was always the
intended setup, I just didn't get back to it.

After that, a few honest gaps: the cart drawer's quantity stepper doesn't cap at
the (simulated) stock and it should; the mock Add-to-Cart has a loading state but
no failure path, so the error/toast half of that idea is missing; and there are
no tests yet — the variant selector (sold-out state, disabled CTA, quantity cap)
is the first thing I'd cover. Search and the Best Sellers / New Arrivals links
are also still placeholders.
