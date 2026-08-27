# Nxt Trendz

> A responsive e-commerce storefront built with React, featuring authenticated shopping, product discovery, detailed product views, and a persistent cart experience.

<p align="center">
  <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png" alt="Nxt Trendz logo" width="180" />
</p>

<p align="center">
  <a href="#features">Features</a> | <a href="#tech-stack">Tech Stack</a> | <a href="#getting-started">Getting Started</a> | <a href="#project-structure">Project Structure</a>
</p>

## Overview

Nxt Trendz is a polished shopping experience inspired by modern retail platforms. Users can sign in, browse products and exclusive deals, refine results using multiple filters, inspect product details, choose a quantity, and manage items in a persistent cart.

The project demonstrates practical React application patterns including protected routing, API integration, asynchronous UI states, reusable components, responsive layouts, and browser storage.

## Preview

![Nxt Trendz storefront preview](https://assets.ccbp.in/frontend/content/react-js/nxt-trendz-products-filter-group-output-v0.gif)

## Features

- **Authentication:** Login through the API with JWT token storage in cookies.
- **Protected navigation:** Home, Products, Product Details, and Cart routes require authentication.
- **Product discovery:** Browse the complete catalog and exclusive Prime Deals.
- **Search and filtering:** Search by title and filter by category and minimum rating.
- **Sorting:** Sort products by price from high to low or low to high.
- **Resilient API states:** Dedicated loading, empty-results, failure, and retry experiences.
- **Product details:** View pricing, brand, availability, reviews, description, and similar products.
- **Cart workflow:** Add products with a chosen quantity, update quantities, remove items, and view a live subtotal.
- **Persistent cart:** Cart contents are retained in `localStorage` between page visits.
- **Responsive UI:** Desktop and mobile navigation and layouts adapt across screen sizes.
- **Accessible interactions:** Semantic form controls, descriptive image alt text, and keyboard-friendly search.

## Tech Stack

- React 17
- React Router DOM 5
- JavaScript (ES6+)
- CSS3 with responsive media queries
- Fetch API
- `js-cookie` for JWT cookie management
- `react-loader-spinner` for loading states
- `react-icons` for interface controls
- Create React App / React Scripts
- Jest and React Testing Library
- ESLint and Prettier

## Application Routes

| Route | Description | Access |
| --- | --- | --- |
| `/login` | User authentication | Public |
| `/` | Store home page | Protected |
| `/products` | Product catalog, deals, filters, and sorting | Protected |
| `/products/:id` | Product details and similar products | Protected |
| `/cart` | Persistent shopping cart and order summary | Protected |
| `/not-found` | Fallback route | Public |

## Getting Started

### Prerequisites

- Node.js 24.x
- npm 6 or later

### Installation

```bash
git clone <https://github.com/paranthaman21/nxtE-Commerce>
cd nxtE-Commerce
npm install
```

### Run locally

```bash
npm start
```

The app opens at `http://localhost:3000`.

### Production build

```bash
npm run build
```

### Quality checks

```bash
npm test
npm run lint
```

## Demo Credentials

Use the following credentials to explore the authenticated experience:

```text
Username: raja
Password: raja@2021
```

## API Integration

The app consumes the Nxt Trendz API and sends the JWT token as a Bearer token for authenticated requests.

| Endpoint | Purpose |
| --- | --- |
| `POST https://apis.ccbp.in/login` | Authenticate a user and receive a JWT |
| `GET https://apis.ccbp.in/products` | Fetch products with search, category, rating, and sort parameters |
| `GET https://apis.ccbp.in/products/:id` | Fetch product details and similar products |
| `GET https://apis.ccbp.in/prime-deals` | Fetch exclusive Prime Deals |

Example catalog request:

```text
https://apis.ccbp.in/products?sort_by=PRICE_HIGH&category=2&title_search=&rating=4
```

## Project Structure

```text
src/
|-- App.js                         # Route configuration
|-- App.css                        # Global application styles
|-- color-palette.css              # Shared color tokens
|-- index.js                       # React entry point and BrowserRouter
`-- components/
  |-- AllProductsSection/        # Catalog data fetching and product states
  |-- Cart/                      # Cart persistence, quantities, and totals
  |-- FiltersGroup/              # Category and rating filters
  |-- Header/                    # Responsive navigation and logout
  |-- Home/                      # Store landing page
  |-- LoginForm/                 # Authentication form
  |-- NotFound/                  # Unknown route experience
  |-- PrimeDealsSection/         # Exclusive deals data and presentation
  |-- ProductCard/               # Reusable product preview
  |-- ProductItemDetails/        # Product details and add-to-cart flow
  |-- Products/                  # Catalog page composition
  |-- ProductsHeader/            # Sorting controls and result header
  |-- ProtectedRoute/            # Cookie-based route guard
  `-- SimilarProductItem/        # Related product preview
```

## Engineering Highlights

- Centralized route protection keeps unauthenticated users inside the login flow.
- Product filters are composed into a single API request so multiple selections work together.
- API responses are mapped into UI-friendly models before reaching reusable product cards.
- Cart updates are synchronized between React state and `localStorage`.
- Components separate data fetching, page composition, filtering controls, and product presentation.

## Resume Summary

Built a responsive React e-commerce application with JWT authentication, protected routes, REST API integration, multi-criteria product filtering, sorting, loading and error handling, product detail views, and a persistent local-storage shopping cart.

## License

This project was created for learning and portfolio demonstration purposes.
