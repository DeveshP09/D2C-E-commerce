# Mini E-Commerce

A small storefront — product listing, product detail with variants, and a
persistent cart. Product data comes from the [Fake Store API](https://fakestoreapi.com).

## Setup
Clone the repository and install dependencies:

```bash
npm install
npm run dev       # dev server
npm run build     # production build
```

## Live Url
https://devesh-d2c.netlify.app/

## Design decisions

- **Context + useReducer for the cart, not Redux.** The cart is the only real
  global state, so a full store felt like overkill. Context keeps it dependency-free
  and the reducer keeps the update logic in one place.

- **Cart persists via localStorage.** The reducer state is hydrated on load and
  written back on every change, so the cart survives a refresh. Totals (subtotal,
  item count) are derived on read, never stored.

- **Variant / stock is generated from the product id.** The Fake Store
  API has no colours, sizes or stock, so these are derived deterministically from
  the id (no random values). The same product always shows the same variants across 
  refreshes and deep-links. Colours/sizes only apply to clothing categories.

- **Selected variant lives in the URL** (`?color=&size=`) so a product page is
  shareable/deep-linkable. Variant changes use `replace`, so the back button returns to the listing 

- **Centralized routing.** `createBrowserRouter` is assembled in one
  place; each feature owns its own `routes.jsx`. Pages are lazy-loaded, with an
  app-level error boundary and a 404 route.

- **Data is fetched inside the pages**

- **The cart is a slide-in drawer** kept in the layout, so it stays mounted and
  the count updates as you navigate.
