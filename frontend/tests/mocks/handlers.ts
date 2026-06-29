import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const API_BASE = "http://localhost:8000";

const handlers = [
  http.get(`${API_BASE}/api/products`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Test Product",
        description: "A great product for testing",
        image_url: null,
        average_rating: 4.2,
        review_count: 3,
      },
      {
        id: 2,
        title: "Another Product",
        description: "Another excellent product",
        image_url: "https://example.com/image.jpg",
        average_rating: 3.8,
        review_count: 5,
      },
    ]);
  }),

  http.get(`${API_BASE}/api/products/:productId`, ({ params }) => {
    const id = Number(params.productId);
    return HttpResponse.json({
      id,
      title: "Test Product",
      description: "A detailed product description for testing purposes",
      image_url: null,
      created_at: "2025-01-15T10:30:00Z",
      reviews: [
        {
          id: 101,
          product_id: id,
          user_id: "user-1",
          user_name: "Alice",
          rating: 5,
          comment: "Amazing product!",
          created_at: "2025-02-01T14:20:00Z",
        },
        {
          id: 102,
          product_id: id,
          user_id: "user-2",
          user_name: "Bob",
          rating: 4,
          comment: "Really good, would recommend.",
          created_at: "2025-02-05T09:15:00Z",
        },
      ],
    });
  }),

  http.post(`${API_BASE}/api/reviews`, async () => {
    return HttpResponse.json(
      {
        id: 200,
        product_id: 1,
        user_id: "current-user",
        user_name: "Test User",
        rating: 5,
        comment: "Great!",
        created_at: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  http.get(`${API_BASE}/users/me`, () => {
    return HttpResponse.json({
      id: "current-user",
      email: "test@example.com",
      name: "Test User",
      is_active: true,
      is_superuser: false,
      is_verified: true,
    });
  }),

  http.get(`${API_BASE}/api/reviews/me`, () => {
    return HttpResponse.json([
      {
        id: 1,
        product_id: 1,
        user_id: "current-user",
        user_name: "Test User",
        rating: 5,
        comment: "Amazing product!",
        created_at: "2025-02-01T14:20:00Z",
      },
    ]);
  }),
];

export const server = setupServer(...handlers);
