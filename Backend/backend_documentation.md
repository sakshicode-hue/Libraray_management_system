# Backend Documentation & Architecture

## 1. Overview
The backend is built using **FastAPI**, a modern, high-performance web framework for building APIs with Python. It follows a modular structure separating concerns into routers, controllers, schemas, and database logic. The system uses a **PostgreSQL** database for data persistence and implements **JWT (JSON Web Tokens)** for authentication.

## 2. Technologies Used
- **Language**: Python 3.x
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Database Driver**: `psycopg2` (Direct SQL execution)
- **Data Validation**: Pydantic
- **Authentication**: JWT (JSON Web Tokens)
- **Configuration**: `pydantic-settings` (.env file management)
- **CORS**: `fastapi.middleware.cors`

## 3. Architecture & Logic
The application follows a layered architecture:

### 3.1 Request Lifecycle
1.  **Middleware layer**:
    - `AuthMiddleware`: Intercepts requests to protected routes. It checks for a valid JWT token in cookies or the `Authorization` header. If valid, it attaches user info to the request state; otherwise, it raises a 401/403 error.
    - `CORSMiddleware`: Handles Cross-Origin Resource Sharing settings.

2.  **Router Layer (`app/routers/`)**:
    - Defines the HTTP endpoints (paths and methods).
    - Uses Pydantic models (`app/schemas/`) to validate incoming request bodies.
    - Delegates business logic to the Controller layer.

3.  **Controller Layer (`app/controllers/`)**:
    - Contains the core business logic.
    - Interacts directly with the database using raw SQL queries via `psycopg2`.
    - Handles exceptions and returns data to the router.

4.  **Database Layer (`app/database.py`)**:
    - Provides a `get_connection()` function to establish a connection to the PostgreSQL database using credentials from `app/core/config.py`.

### 3.2 Authentication Flow
- **Login/Signup**: Users provides credentials. The server verifies them and issues a JWT token set as a `token` cookie.
- **Protected Routes**: Middleware verifies the token signature and expiration before allowing access.
- **Public Routes**: explicitly defined in middleware (e.g., login, signup, home) are bypassed.

## 4. API Documentation

### 4.1 Users (`/req/users`)
- **POST** `/login`: Authenticate existing user.
- **POST** `/signup`: Register a new user.
- **POST** `/exist`: Check if an email already exists.
- **POST** `/auth-users`: Handle Google OAuth user creation/login.
- **POST** `/getbyid`: Retrieve user details by ID.
- **POST** `/delete`: Delete a user account.
- **POST** `/logout`: Log out the user.

### 4.2 Books (`/req/books`)
- **GET** `/getall`: Retrieve all books from the catalog.
- **POST** `/lend`: Lend a book to a user (Create a transaction).

### 4.3 Lendings (`/req/lenders`)
- **POST** `/getbyid`: Get lending history for a specific user.
- **POST** `/returnbook`: Process a book return.

### 4.4 Reservations (`/req/reservation`)
- **POST** `/reserve`: Reserve a book for a user.
- **POST** `/getbyid`: Get reservations for a user.

### 4.5 Notifications (`/req/notifications`)
- **POST** `/get`: Retrieve notifications for a user.
- **POST** `/add`: Create a new notification.
- **POST** `/markasread`: Mark a notification as read.

### 4.6 Mails (`/req/mail`)
- **POST** `/send-mail`: Send an OTP email.
- **POST** `/reset-mail`: Send a password reset email.
- **POST** `/issue-mail`: Send an email regarding a book issue.

### 4.7 OTP (`/req/otp`)
- **POST** `/verify`: Verify a One-Time Password.

## 5. Directory Structure
```
Backend/
├── app/
│   ├── controllers/    # Business logic & DB queries
│   ├── core/           # Configuration (settings.py)
│   ├── middleware/     # Auth & CORS middleware
│   ├── routers/        # API route definitions
│   ├── schemas/        # Pydantic models for validation
│   ├── database.py     # DB connection utility
│   └── main.py         # App entry point
├── requirements.txt    # Python dependencies
└── .env                # Environment variables
```
