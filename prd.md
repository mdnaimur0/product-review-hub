# Full Stack Developer Task: Review Website Module

## Objective
Build a simple review platform where users can view products/services and submit reviews.

The goal is to evaluate your skills in:
* Next.js frontend development
* FastAPI backend development
* REST API design
* PostgreSQL database integration
* Clean code practices

---

## Project Requirements

### Backend (FastAPI + PostgreSQL)
Create a REST API using FastAPI.

#### Database Models

**User Fields:**
* `id`
* `name`
* `email`
* `created_at`

**Product Fields:**
* `id`
* `title`
* `description`
* `image_url`
* `created_at`

**Review Fields:**
* `id`
* `product_id`
* `user_id`
* `rating` (1-5)
* `comment`
* `created_at`

---

### API Requirements

#### Product APIs

* **Get all products**
  * **Endpoint:** `GET /api/products`
  * **Response:**
    ```json
    [
      {
        "id": 1,
        "title": "Laptop",
        "description": "Gaming laptop",
        "average_rating": 4.5
      }
    ]
    ```

* **Get product details with reviews**
  * **Endpoint:** `GET /api/products/{id}`
  * **Response:**
    ```json
    {
      "id": 1,
      "title": "Laptop",
      "reviews": [
        {
          "user": "John",
          "rating": 5,
          "comment": "Excellent product"
        }
      ]
    }
    ```

#### Review APIs

* **Create Review**
  * **Endpoint:** `POST /api/reviews`
  * **Request:**
    ```json
    {
      "product_id": 1,
      "user_id": 2,
      "rating": 5,
      "comment": "Very good"
    }
    ```

* **Update Review**
  * **Endpoint:** `PUT /api/reviews/{id}`

* **Delete Review**
  * **Endpoint:** `DELETE /api/reviews/{id}`

---

### Frontend (Next.js)
Create a responsive review website.

#### Pages Required

##### 1. Home Page
Display:
* Product cards
* Product image
* Product name
* Average rating
* Number of reviews

**Example Card Layout:**
```text
+-----------------------+
| Laptop                |
| ★★★★☆ 4.5            |
| 120 Reviews           |
| View Details          |
+-----------------------+
```

##### 2. Product Details Page

Show:

* Product information
* Average rating
* All user reviews
* Review submission form

**Review Form Fields:**

* Name
* Rating (1-5)
* Comment

**Behavior After Submitting:**

* Refresh review list
* Update average rating

---

### Technical Requirements

#### Frontend

Must use:

* Next.js
* JavaScript / TypeScript
* React components
* API integration using fetch/axios
* Proper loading and error handling
* Responsive UI

#### Backend

Must use:

* FastAPI
* Python
* PostgreSQL
* SQLAlchemy ORM
* REST API structure
* Proper validation

---

### Bonus Features (Optional)

#### 1. Authentication

Implement:

* Register
* Login
* JWT authentication

#### 2. Admin Panel

Admin can:

* Add products
* Remove products
* Delete inappropriate reviews

#### 3. Search & Filter

Allow users to:

* Search products
* Filter by rating

---

### Submission Requirements

The candidate should provide:

1. GitHub repository URL
2. Live frontend URL (Next.js)
3. Live backend API URL (FastAPI)
4. API documentation link (Swagger/OpenAPI)
5. Setup instructions
6. Database migration / schema
7. Environment configuration example (`.env.example`)

**Expected completion time:** 48 hours
