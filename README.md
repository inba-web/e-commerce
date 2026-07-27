# Inba Mart - Enterprise Multi-Vendor E-Commerce Platform

Inba Mart is a high-performance, responsive multi-vendor e-commerce marketplace built using the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It features role-based user portals, dynamic search recommendations, security rate limiting, secure password recovery flows, and integration with Razorpay.

---

## 1. System Architecture

Inba Mart utilizes a modular Model-View-Controller (MVC) pattern on the backend and a structured component-driven architecture on the frontend. The platform connects via RESTful APIs with strict boundaries for data flow.

```
                    ┌─────────────────────────┐
                    │      React Client       │
                    │   (Vite + TypeScript)   │
                    └───────────┬─────────────┘
                                │ (Axios HTTP API)
                                ▼
                    ┌─────────────────────────┐
                    │     Express Server      │
                    │     (Node.js REST)      │
                    └───────────┬─────────────┘
                                │ (Mongoose ODM)
                                ▼
                    ┌─────────────────────────┐
                    │      MongoDB Atlas      │
                    │    (Cloud Database)     │
                    └─────────────────────────┘
```

### Directory Structure

```
e-commerce/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Database Configurations
│   │   ├── controller/      # API Controllers (MVC Controllers)
│   │   ├── db/              # Seeding & Connection Logic
│   │   ├── domain/          # Enums and Constants
│   │   ├── middlewares/     # Authentication & Security Middlewares
│   │   ├── model/           # Mongoose Models (Schemas)
│   │   ├── routes/          # Express API Route Mappings
│   │   ├── service/         # Business Logic Layer
│   │   └── utils/           # JWT, Cloudinary, and Mail Utilities
│   └── .env                 # Environment Secret Keys
│
└── frontend/
    ├── src/
    │   ├── admin/           # Admin Dashboard Pages & Components
    │   ├── customer/        # Customer Navbar, Cart, Order, Auth, Profile
    │   ├── seller/          # Seller Dashboard, Earnings, Listings
    │   ├── context/         # Auth, Cart, Wishlist Context providers
    │   └── App.tsx          # Application Routes & Layouts
```

---

## 2. Core Technology Stack

- **Frontend Core:** React 19 (TypeScript), Vite 6, Tailwind CSS, Material UI (MUI v6)
- **Backend Core:** Node.js, Express 5, Mongoose 9, Nodemon
- **Authentication:** JSON Web Tokens (JWT), bcrypt (10 rounds password hashing)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Services Integration:** Cloudinary API (Image Storage), Razorpay SDK (Payments), Nodemailer (OTP Mail Delivery)
- **Security Middlewares:** Helmet (HTTP header security), CORS, Express Mongo Sanitize (NoSQL query sanitizer)

---

## 3. Dynamic Security Architecture (OWASP Top 10)

The application implements protective measures corresponding to the OWASP Top 10 vulnerabilities list:

1. **A01:2021-Broken Access Control:** Protected via `adminMiddleware` and authorization headers. Custom checks enforce roles (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`). Users cannot write/modify elements belonging to other identifiers.
2. **A02:2021-Cryptographic Failures:** All passwords are salted and hashed using `bcrypt` before storage. Temporary recovery OTP codes are hashed in the database. Successful checks return a short-lived (10-minute) JWT reset token.
3. **A03:2021-Injection:** Handled via `mongoSanitize()` middleware, stripping incoming requests of operators starting with `$` and `.` to defend against NoSQL injection vectors.
4. **A04:2021-Insecure Design:** Separated business logic (Service Layer) from transport protocols (Controller Layer) to ensure secure operations.
5. **A05:2021-Security Misconfiguration:** `helmet()` is configured to secure Express headers (XSS, Sniffing, Clickjacking protection). CORS settings are strictly managed via environment parameters rather than allowing open wildcards.
6. **A07:2021-Identification and Authentication Failures:** Armed with verification rate limiting. Restricts verification OTP requests and locks accounts/records after 5 unsuccessful verification trials. Enforces a 60-second cooldown period between resends.
7. **A08:2021-Software and Data Integrity Failures:** Inputs are processed inside validation layers. TypeScript compiler and strict configuration are enforced on frontend builds.

---

## 4. API Reference Documentation

### 4.1 Authentication & Recovery (`/auth`)

- **`POST /auth/signup`**
  Registers a new customer. Requires `fullName`, `email`, `mobile`, `password`.
- **`POST /auth/login`**
  Validates credentials. Returns user details and JWT Token.
- **`POST /auth/forgot-password`**
  Requests password recovery. Enforces rate limits and emails a 6-digit verification OTP.
- **`POST /auth/verify-reset-otp`**
  Validates OTP. Returns a short-lived JWT reset token. Lockout is activated on 5 invalid attempts.
- **`POST /auth/reset-password`**
  Accepts reset token and updates the customer's password. Checks complexity parameters on input.

### 4.2 Product Search & Management (`/products`)

- **`GET /products`**
  Retrieves catalog matching filters (`category`, `color`, `minPrice`, `maxPrice`, `sort`).
- **`GET /products/search?q={query}`**
  Returns search matching products. Operates autocomplete recommendations.
- **`GET /products/{productId}`**
  Fetches details of a single product.

### 4.3 Cart & Order Operations (`/api/cart`, `/api/orders`)

- **`GET /api/cart`**
  Retrieves items in the user's shopping cart.
- **`PUT /api/cart/add`**
  Adds a product listing to the active cart.
- **`POST /api/orders`**
  Creates checkout order matching customer delivery address.
- **`GET /api/orders/{orderId}`**
  Details payment status and delivery progress of an order.

### 4.4 Seller Portal (`/sellers`, `/api/sellers/product`, `/api/sellers/orders`)

- **`POST /sellers/signup`**
  Onboards a new merchant. Requires GSTIN, bank parameters, and company details.
- **`POST /sellers/login`**
  Merchant login controller.
- **`POST /api/sellers/product`**
  Adds new product inventory. Seller ID is extracted from the authorization context.
- **`GET /api/sellers/orders`**
  Queries orders containing the merchant's items.
- **`PATCH /api/sellers/orders/{itemId}/status`**
  Updates fulfillment stages (PENDING, PLACED, SHIPPED, DELIVERED).

### 4.5 Admin Controllers (`/admin`)

- **`GET /admin/sellers`**
  Queries list of sellers waiting for authorization check.
- **`PATCH /admin/sellers/{sellerId}/status`**
  Approve/Suspend vendor permissions.
- **`POST /admin/coupons`**
  Creates general discount codes.
- **`DELETE /admin/coupons/{id}`**
  Removes a coupon code.

---

## 5. Role-Based Access Control (RBAC) Matrix

Access levels are defined using user roles:

| Access Privilege | ROLE_CUSTOMER | ROLE_SELLER | ROLE_ADMIN | Guest |
| :--- | :---: | :---: | :---: | :---: |
| Browse Products & Search | Yes | Yes | Yes | Yes |
| Place Orders & Add to Cart | Yes | No | No | No |
| Add & Manage Product Listings | No | Yes | No | No |
| View Earnings & Seller Reports | No | Yes | No | No |
| Approve Sellers & Suspend accounts | No | No | Yes | No |
| Create & Delete Global Coupons | No | No | Yes | No |

---

## 6. Setup & Dynamic Credentials Configuration

### 6.1 Backend Configuration (`backend/.env`)

Configure the backend variables inside `backend/.env`. The application seeds the default administrator account dynamically on startup using these settings:

```env
MONGODB_URI=your_mongodb_uri
PORT=5000

# Seeding dynamic credentials (OWASP Best Practice)
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# External Service Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 7. Testing & Verification Guide

### 7.1 Super Admin Credentials & Verification Process

To log in as the administrative user:
1. Open the login dialog in the Navbar control.
2. Enter the configured dynamic credentials (from your `.env` file):
   - **Email:** `admin@inbamart.com` (or your configured `ADMIN_EMAIL`)
   - **Password:** `adminpassword` (or your configured `ADMIN_PASSWORD`)
3. Upon submission, the user section on the navigation bar reveals the `"Admin Dashboard"` entry.
4. Click `"Admin Dashboard"` to verify vendor status, view coupon stats, and review product approvals.

### 7.2 Running the Application

1. **Start the Backend System:**
   ```bash
   cd backend
   npm run dev
   ```
2. **Start the Frontend System:**
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173` to test search dropdown queries, password recovery otp flows, and responsive UI scaling.
