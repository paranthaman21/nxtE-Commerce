# Nxt Trendz - Technical Project Documentation

**Document type:** Software Design Document and Codebase Handbook  
**Audience:** Developers, reviewers, maintainers, and portfolio evaluators  
**Application:** React e-commerce storefront  
**Status:** Learning and portfolio project

## 1. Purpose of This Document

This document explains how the Nxt Trendz application is organized and how its major features work in code. It is written as an onboarding guide for a software development team member.

Read the sections in order for a full walkthrough. When debugging a feature, start with the relevant user journey in Section 8, then follow the file map in Section 5.

## 2. Product Summary

Nxt Trendz is an authenticated online shopping experience. A user can:

1. Sign in through the login API.
2. Browse the home page and product catalog.
3. Search, filter, and sort products.
4. Open a product details page.
5. Select a quantity and add a product to the cart.
6. Change quantities or remove items from the cart.
7. Log out and return to the login page.

The app communicates with the Nxt Trendz API for authentication and product data. Cart contents are managed in the browser with `localStorage`.

## 3. System Context

```text
+-------------------+       HTTP requests        +----------------------+
|                   | -------------------------> |                      |
|  React Frontend   |                            |  Nxt Trendz API      |
|                   | <------------------------- |                      |
+---------+---------+       JSON responses       +----------------------+
          |
          | JWT token
          v
+-------------------+       cart JSON            +----------------------+
| Browser Cookies   | <------------------------> | Browser localStorage |
| jwt_token         |                            | nxt_cart             |
+-------------------+                            +----------------------+
```

### External services

| Service | Use |
| --- | --- |
| Nxt Trendz Login API | Authenticates the user and returns a JWT token. |
| Nxt Trendz Products API | Returns catalog products and product details. |
| Nxt Trendz Prime Deals API | Returns exclusive deal products. |
| CCBP asset URLs | Provide product, logo, rating, and state images. |

## 4. Technology and Runtime

- React 17 with class and function components.
- React Router DOM 5 for routing and redirects.
- JavaScript ES6+.
- CSS3 and responsive media queries.
- Fetch API for HTTP requests.
- `js-cookie` for JWT cookie access.
- `react-loader-spinner` for loading feedback.
- `react-icons` for quantity controls.
- Create React App through `react-scripts`.
- Jest and React Testing Library dependencies for tests.
- ESLint, Airbnb configuration, Prettier, Husky, and lint-staged for quality workflows.

The project expects Node.js 24.x and npm 6 or later according to `package.json`.

## 5. Repository and File Responsibilities

```text
nxtE-Commerce/
|-- package.json
|-- public/
|-- build/
|-- README.md
|-- CASE_STUDY.md
|-- PROJECT_DOCUMENTATION.md
`-- src/
    |-- App.js
    |-- App.css
    |-- color-palette.css
    |-- index.js
    |-- setupTests.js
    `-- components/
        |-- AllProductsSection/
        |-- Cart/
        |-- FiltersGroup/
        |-- Header/
        |-- Home/
        |-- LoginForm/
        |-- NotFound/
        |-- PrimeDealsSection/
        |-- ProductCard/
        |-- ProductItemDetails/
        |-- Products/
        |-- ProductsHeader/
        |-- ProtectedRoute/
        `-- SimilarProductItem/
```

### Root files

| File | Responsibility |
| --- | --- |
| `package.json` | Dependencies, scripts, runtime requirements, and Jest configuration. |
| `README.md` | Concise project overview and setup guide. |
| `CASE_STUDY.md` | Portfolio-oriented product and engineering narrative. |
| `PROJECT_DOCUMENTATION.md` | Detailed technical onboarding and code reference. |
| `public/index.html` | HTML shell containing the root element. |
| `src/index.js` | React entry point; mounts `App` inside `StrictMode` and `BrowserRouter`. |
| `src/App.js` | Declares the route table and protected route boundaries. |
| `src/App.css` | Application-level styling. |
| `src/color-palette.css` | Shared color definitions. |
| `src/setupTests.js` | Test environment setup. |

## 6. Application Bootstrap and Routing

### Startup sequence

1. `src/index.js` imports React, ReactDOM, `BrowserRouter`, and `App`.
2. React renders the application into the HTML element with `id="root"`.
3. `BrowserRouter` makes route information available to components.
4. `App` selects the component that matches the current path.

### Route table

| Path | Component | Protection | Responsibility |
| --- | --- | --- | --- |
| `/login` | `LoginForm` | Public | Collects credentials and creates a session. |
| `/` | `Home` | Protected | Displays the store home experience. |
| `/products` | `Products` | Protected | Combines Prime Deals and the catalog. |
| `/products/:id` | `ProductItemDetails` | Protected | Loads and displays one product. |
| `/cart` | `Cart` | Protected | Displays and updates the local cart. |
| `/not-found` | `NotFound` | Public | Handles the explicit not-found page. |
| Any unmatched path | Redirect | Public | Redirects to `/not-found`. |

### Protected route behavior

`src/components/ProtectedRoute/index.js` reads `jwt_token` with `js-cookie`.

- When the cookie is missing, it returns a redirect to `/login`.
- When the cookie exists, it renders the supplied React Router `Route`.

This is a client-side route guard. It controls navigation in the browser; the API still validates the Bearer token on requests.

## 7. Authentication Flow

```text
LoginForm
   |
   | POST /login { username, password }
   v
Nxt Trendz API
   |
   | success: jwt_token
   v
Cookies.set('jwt_token', token, { expires: 30 })
   |
   v
history.replace('/')
```

### Login implementation

`LoginForm` owns the username, password, error visibility, and error message state.

1. Input handlers update `username` and `password`.
2. Form submission prevents the browser's default submit behavior.
3. The component sends a `POST` request to `https://apis.ccbp.in/login`.
4. A successful response stores the returned `jwt_token` for 30 days and redirects to `/`.
5. An unsuccessful response displays the API's `error_msg`.
6. If a token already exists while the login page renders, the user is redirected to `/`.

### Logout implementation

`Header` owns the logout action. It removes `jwt_token` and calls `history.replace('/login')`.

## 8. Main User Journeys

### Journey A: Open a protected page

```text
Browser path
    |
    v
ProtectedRoute reads jwt_token
    |
    +-- missing --> Redirect to /login
    |
    `-- present --> Render requested page
```

### Journey B: Load the Products page

```text
Products
  |-- Header
  |-- PrimeDealsSection --> GET /prime-deals
  `-- AllProductsSection --> GET /products
                              |
                              +-- IN_PROGRESS --> loader
                              +-- SUCCESS --> product cards
                              +-- SUCCESS + [] --> no-products view
                              `-- FAILURE --> error view + Try Again
```

`Products` is a composition component. It does not fetch data itself; it renders `Header`, `PrimeDealsSection`, and `AllProductsSection`.

### Journey C: Search and filter the catalog

`AllProductsSection` stores the active catalog controls:

| State value | Meaning |
| --- | --- |
| `activeOptionId` | Current price sort option. Defaults to `PRICE_HIGH`. |
| `activeCategoryOption` | Selected category ID, or an empty string. |
| `activeRatingId` | Selected minimum rating ID, or an empty string. |
| `searchInput` | Current title search text. |
| `productsList` | Normalized products returned by the API. |
| `apiStatus` | Current request status. |

The request is constructed from all active values:

```text
GET https://apis.ccbp.in/products
    ?sort_by=<sort>
    &category=<category>
    &title_search=<search>
    &rating=<rating>
```

Interaction behavior:

- Typing updates `searchInput`.
- Pressing Enter calls `getProducts`.
- Selecting a sort option updates `activeOptionId` and fetches products.
- Selecting a category updates `activeCategoryOption` and fetches products.
- Selecting a rating updates `activeRatingId` and fetches products.
- Clear Filters resets category, rating, and search, then fetches the default catalog.

The JWT is read from the cookie and sent as `Authorization: Bearer <token>`.

### Journey D: Open product details

`ProductCard` links a product to `/products/:id`. `ProductItemDetails` reads the route ID from `match.params.id` and requests:

```text
GET https://apis.ccbp.in/products/<id>
Authorization: Bearer <jwt_token>
```

The component tracks:

- `productData`: fetched product object.
- `quantity`: selected quantity, starting at 1.
- `apiStatus`: request lifecycle state.

A successful view renders product information and maps `similar_products` into `SimilarProductItem` components. The decrement action uses `Math.max(1, quantity - 1)`, so the details page cannot add a zero or negative quantity.

### Journey E: Add to cart

When Add to Cart is pressed, `ProductItemDetails` creates a cart item containing:

```text
id, title, brand, price, imageUrl, quantity
```

The component reads the existing `nxt_cart` array from `localStorage`.

- If the product already exists, its quantity is increased.
- Otherwise, the new item is appended.
- The updated array is written back to `localStorage`.
- The user is redirected to `/cart`.

### Journey F: Manage the cart

`Cart` loads `nxt_cart` in a `useEffect` when it mounts. Its React state is the rendered source for the current page, and every update also writes to `localStorage`.

For each item, the cart displays:

- Product image, title, and brand.
- Quantity decrement and increment controls.
- Line total: `price * quantity`.

The subtotal is calculated with `reduce`:

```text
subtotal = sum of (item.price * item.quantity)
```

When quantity becomes zero, the item is filtered out of the cart. An empty cart renders a dedicated empty state and a link back to Products.

## 9. Component Reference

### `Header`

**Location:** `src/components/Header/`

Responsibilities:

- Shows the Nxt Trendz logo.
- Provides Home, Products, and Cart navigation.
- Provides desktop and mobile navigation presentations.
- Logs the user out by removing the JWT cookie.

It uses `withRouter` so it can access `history` for logout redirects.

### `Home`

**Location:** `src/components/Home/`

Renders the protected store home page and its responsive presentation. It uses `Header` as the shared navigation layer.

### `Products`

**Location:** `src/components/Products/`

Composes the Products page from `Header`, `PrimeDealsSection`, and `AllProductsSection`.

### `PrimeDealsSection`

**Location:** `src/components/PrimeDealsSection/`

Fetches exclusive deals from `https://apis.ccbp.in/prime-deals`, maps API product fields into the product card model, and renders the result through `ProductCard`.

It has loading, success, and failure presentations. The failure state displays a registration/deals asset.

### `AllProductsSection`

**Location:** `src/components/AllProductsSection/`

Owns catalog state, API requests, filter values, sort values, and catalog-level status views.

Important internal collections:

- `categoryOptions`: Clothing, Electronics, Appliances, Grocery, and Toys.
- `sortbyOptions`: Price High-Low and Price Low-High.
- `ratingsList`: one-to-four-star minimum rating options.

It delegates filter controls to `FiltersGroup`, sort controls to `ProductsHeader`, and individual product rendering to `ProductCard`.

### `FiltersGroup`

**Location:** `src/components/FiltersGroup/`

Renders category and rating controls and calls the callbacks provided by `AllProductsSection`. It also exposes the Clear Filters action.

### `ProductsHeader`

**Location:** `src/components/ProductsHeader/`

Renders the catalog heading and sort selection. It receives the active sort ID, available sort options, and the change callback.

### `ProductCard`

**Location:** `src/components/ProductCard/`

Renders a reusable product summary and links to the product details route. It is reused by the main catalog, Prime Deals, and other product-list experiences.

### `ProductItemDetails`

**Location:** `src/components/ProductItemDetails/`

Fetches one product, displays its full details, manages quantity, adds the item to local storage, and renders similar products.

### `SimilarProductItem`

**Location:** `src/components/SimilarProductItem/`

Renders a related product preview from the `similar_products` response collection.

### `Cart`

**Location:** `src/components/Cart/`

Loads, displays, updates, and persists shopping cart items. It owns quantity changes and subtotal calculation.

### `LoginForm`

**Location:** `src/components/LoginForm/`

Owns login form state, login API submission, JWT storage, redirect behavior, and error display.

### `NotFound`

**Location:** `src/components/NotFound/`

Provides the fallback experience for invalid application paths.

## 10. API Contracts

### Login

```text
POST https://apis.ccbp.in/login
Content-Type: application/json

{
  "username": "raja",
  "password": "raja@2021"
}
```

Successful responses provide `jwt_token`. Failed responses provide `error_msg`.

### Product collection

```text
GET https://apis.ccbp.in/products
  ?sort_by=PRICE_HIGH
  &category=2
  &title_search=machine
  &rating=4
Authorization: Bearer <jwt_token>
```

The component maps each response item:

```text
API field     UI field
-----------   ---------
title         title
brand         brand
price         price
id            id
image_url     imageUrl
rating        rating
```

### Prime Deals

```text
GET https://apis.ccbp.in/prime-deals
Authorization: Bearer <jwt_token>
```

The `prime_deals` array is mapped into the same product card model.

### Product details

```text
GET https://apis.ccbp.in/products/<id>
Authorization: Bearer <jwt_token>
```

The details response is used directly for fields such as `image_url`, `total_reviews`, `description`, `availability`, and `similar_products`.

## 11. Styling and Responsive Behavior

Each feature component keeps its styles in a colocated `index.css` file. Shared application styles live in `App.css`, and shared palette values live in `color-palette.css`.

The UI supports separate desktop and mobile navigation patterns. Product grids, catalog controls, product details, and cart layouts use responsive CSS rules to adapt to smaller viewports.

Images are sourced from the CCBP asset service. Important state images include the no-products, products-failure, empty-cart, login, and exclusive-deals assets.

## 12. Development Commands

```bash
npm install
npm start
npm test
npm run lint
npm run lint:fix
npm run format
npm run build
```

| Command | Purpose |
| --- | --- |
| `npm install` | Installs dependencies. |
| `npm start` | Starts the local development server. |
| `npm test` | Runs the Create React App test runner. |
| `npm run lint` | Reports ESLint issues. |
| `npm run lint:fix` | Applies available ESLint fixes in `src/`. |
| `npm run format` | Formats source files with Prettier. |
| `npm run build` | Creates an optimized production build. |

## 13. Testing Checklist

When changing the application, verify the following behavior:

### Authentication

- Login succeeds with valid credentials.
- Login displays the API error for invalid credentials.
- A user without `jwt_token` cannot open protected pages.
- Logout removes the token and redirects to `/login`.

### Catalog

- Initial catalog request includes the default sort and empty filter values.
- Search runs when Enter is pressed.
- Category and rating selections trigger a new request.
- Multiple filter values are sent together.
- Sort selection changes the request and product order.
- Loading, no-products, failure, and retry states render correctly.

### Product details

- The route ID is used in the details request.
- Quantity starts at one.
- Decrement does not go below one.
- Similar products render from the API response.
- Repeatedly adding a product merges its quantity.

### Cart

- Existing cart data loads from `localStorage`.
- Increment and decrement update the displayed quantity.
- Quantity zero removes the item.
- Subtotal reflects current quantities.
- Updated cart data survives a page reload.

## 14. Known Boundaries and Maintenance Notes

- The cart is browser-local; it is not synchronized to a server or user account.
- The Checkout button is a presentation control and does not implement payment or order creation.
- API URLs are currently embedded in component code rather than supplied through environment variables.
- Authentication is represented by the presence of a cookie; token expiry and refresh are delegated to the API and are not handled by a refresh workflow.
- The application uses React Router 5 and React 17, so future upgrades should account for the older routing and lifecycle APIs.
- External asset URLs and API availability are required for the full experience.

## 15. Safe Change Guide

Before changing a feature, identify its owner:

| Change | Start here |
| --- | --- |
| Add a route | `src/App.js` |
| Change login behavior | `src/components/LoginForm/index.js` |
| Change route protection | `src/components/ProtectedRoute/index.js` |
| Add a catalog filter | `AllProductsSection` state, request construction, and `FiltersGroup` callbacks |
| Change sorting | `ProductsHeader` and `AllProductsSection` |
| Change product card appearance | `src/components/ProductCard/` |
| Change product details or add-to-cart behavior | `src/components/ProductItemDetails/index.js` |
| Change cart persistence or totals | `src/components/Cart/index.js` |
| Change navigation or logout | `src/components/Header/index.js` |
| Change responsive presentation | The relevant component's `index.css` |

After a change, run the narrowest relevant test first, then run lint and build before opening a pull request.

## 16. Onboarding Summary

A new team member can understand the application with this sequence:

1. Read `src/index.js` to see how the application starts.
2. Read `src/App.js` to understand the route and protection model.
3. Read `ProtectedRoute` and `LoginForm` to understand authentication.
4. Read `Products`, then `AllProductsSection`, to understand catalog composition and API state.
5. Read `FiltersGroup` and `ProductsHeader` to understand catalog controls.
6. Read `ProductCard` and `ProductItemDetails` to understand the shopping path.
7. Read `Cart` to understand browser persistence and totals.
8. Read the relevant `index.css` files to understand responsive presentation.
9. Run `npm start`, sign in with the demo credentials in `README.md`, and manually trace the journeys in Section 8.

This order follows the application's real control flow: bootstrap, route boundary, data loading, product interaction, and persistence.
