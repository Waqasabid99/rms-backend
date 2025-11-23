# Backend API — Endpoints Reference

This document lists all API endpoints defined in `backend/routes/index.js`. Paths below are relative to where the router is mounted. For example, if the router is mounted at `/api`, then the full path for `/reservations` becomes `/api/reservations`.

Common response codes (typical):
- 200 — OK (successful GET/PUT/PATCH)
- 201 — Created (successful POST)
- 204 — No Content (successful DELETE, sometimes)
- 400 — Bad Request (validation error)
- 404 — Not Found (resource does not exist)
- 500 — Internal Server Error

## Reservations

- GET `/reservations`
  - Description: Get all reservations. Supports optional query filters (implemented in controller).
  - Query params (controller-dependent): possible filters such as date ranges, status, page/limit, etc.
  - Success: 200 + array of reservations

- GET `/reservations/stats`
  - Description: Get reservation statistics (aggregations such as counts, busiest times, etc.).
  - Success: 200 + stats object

## Menu

- GET `/menu`
  - Description: Get all menu items. Supports optional query filters (category, search, sorting).
  - Query params: `category`, `search`, `sortBy`, `order`
  - Success: 200 + array of menu items

- GET `/menu/stats`
  - Description: Get menu statistics (counts by category, average price, availability counts).
  - Success: 200 + stats object

- GET `/menu/:id`
  - Description: Get single menu item by MongoDB `_id`.
  - Path params: `id` — menu item id
  - Success: 200 + menu item object

- POST `/menu`
  - Description: Create a new menu item.
  - Body: menu item payload (see models for required fields)
  - Success: 201 + created menu item

- PUT `/menu/:id`
  - Description: Full update of a menu item by id.
  - Path params: `id` — menu item id
  - Body: full menu item object
  - Success: 200 + updated menu item

- PATCH `/menu/:id`
  - Description: Update menu item availability only (partial update).
  - Path params: `id` — menu item id
  - Body: { available: boolean }
  - Success: 200 + updated menu item

- DELETE `/menu/:id`
  - Description: Delete a menu item by id.
  - Path params: `id` — menu item id
  - Success: 204 or 200

- GET `/reservations/search/user`
  - Description: Search reservations by user details.
  - Query params:
    - `name` (optional) - Search by customer name
    - `email` (optional) - Search by customer email
    - `phone` (optional) - Search by customer phone
  - Note: At least one query parameter is required
  - Success: 200 + array of matching reservations

- GET `/reservations/:id`
  - Description: Get a single reservation by `booking_id` (the `:id` path param).
  - Path params: `id` — reservation booking id
  - Success: 200 + reservation object
  - 404 if not found

- POST `/reservations`
  - Description: Create a new reservation.
  - Body: reservation payload (see controller/model for required fields such as name, date, party size, contact info, ...)
  - Success: 201 + created reservation object

- PUT `/reservations/:id`
  - Description: Replace or fully update a reservation by `:id` (full update).
  - Path params: `id` — reservation id
  - Body: updated reservation object
  - Success: 200 + updated reservation

- PATCH `/reservations/:id/status`
  - Description: Update **only** the status of a reservation.
  - Path params: `id` — reservation id
  - Body: { status: "new-status" }
  - Success: 200 + updated reservation/status

- PATCH `/reservations/email/:email`
  - Description: Update a reservation by customer email (partial update).
  - Path params: `email` — customer's email address
  - Body: Fields to update
  - Success: 200 + updated reservation
  - 404 if no reservation found for email

- PATCH `/reservations/:id`
  - Description: Update specific fields of a reservation (partial update).
  - Path params: `id` — reservation id
  - Body: Fields to update
  - Success: 200 + updated reservation

- DELETE `/reservations/:id`
  - Description: Delete a reservation by `:id`.
  - Path params: `id` — reservation id
  - Success: 204 or 200

## Takeaway Orders

- GET `/takeaway`
  - Description: Get all takeaway orders. Supports optional query filters.
  - Success: 200 + array of takeaway orders

- GET `/takeaway/stats`
  - Description: Get takeaway order statistics.
  - Success: 200 + stats object

- GET `/takeaway/:id`
  - Description: Get a single takeaway order by `order_id`.
  - Path params: `id` — takeaway order id
  - Success: 200 + order object

- GET `/takeaway/search/user`
  - Description: Search takeaway orders by user details.
  - Query params:
    - `name` (optional) - Search by customer name
    - `email` (optional) - Search by customer email
    - `phone` (optional) - Search by customer phone
  - Note: At least one query parameter is required
  - Note: This endpoint is protected — requires a Firebase ID token in the Authorization header (see Authentication section below).
  - Success: 200 + array of matching orders

- POST `/takeaway`
  - Description: Create a new takeaway order.
  - Body: order payload (items, customer info, totals, etc.)
  - Success: 201 + created order

- PUT `/takeaway/:id`
  - Description: Update a takeaway order (full update).
  - Path params: `id` — takeaway order id
  - Body: updated order object
  - Success: 200 + updated order

- PATCH `/takeaway/:id/status`
  - Description: Update only the status of a takeaway order.
  - Path params: `id` — takeaway order id
  - Body: { status: "new-status" }
  - Success: 200 + updated status

- PATCH `/takeaway/email/:email`
  - Description: Update a takeaway order by customer email (partial update).
  - Path params: `email` — customer's email address
  - Body: Fields to update
  - Success: 200 + updated order
  - 404 if no order found for email

- PATCH `/takeaway/:id`
  - Description: Update specific fields of a takeaway order (partial update by order id).
  - Path params: `id` — takeaway order id
  - Body: Fields to update
  - Success: 200 + updated order

- DELETE `/takeaway/:id`
  - Description: Delete a takeaway order by id.
  - Path params: `id` — takeaway order id
  - Success: 204 or 200

## Delivery Orders

- GET `/delivery`
  - Description: Get all delivery orders. Supports optional query filters.
  - Success: 200 + array of delivery orders

- GET `/delivery/stats`
  - Description: Get delivery order statistics.
  - Success: 200 + stats object

- GET `/delivery/:id`
  - Description: Get a single delivery order by `order_id`.
  - Path params: `id` — delivery order id
  - Success: 200 + order object

- GET `/delivery/search/user`
  - Description: Search delivery orders by user details.
  - Query params:
    - `name` (optional) - Search by customer name
    - `email` (optional) - Search by customer email
    - `phone` (optional) - Search by customer phone
  - Note: At least one query parameter is required
  - Success: 200 + array of matching orders

- POST `/delivery`
  - Description: Create a new delivery order.
  - Body: order payload (items, delivery address, contact, totals, etc.)
  - Success: 201 + created order

- PUT `/delivery/:id`
  - Description: Update a delivery order (full update).
  - Path params: `id` — delivery order id
  - Body: updated order object
  - Success: 200 + updated order

- PATCH `/delivery/:id/status`
  - Description: Update only the status of a delivery order.
  - Path params: `id` — delivery order id
  - Body: { status: "new-status" }
  - Success: 200 + updated status

- PATCH `/delivery/email/:email`
  - Description: Update a delivery order by customer email (partial update).
  - Path params: `email` — customer's email address
  - Body: Fields to update
  - Success: 200 + updated order
  - 404 if no order found for email

- PATCH `/delivery/:id`
  - Description: Update specific fields of a delivery order (partial update by order id).
  - Path params: `id` — delivery order id
  - Body: Fields to update
  - Success: 200 + updated order

- DELETE `/delivery/:id`
  - Description: Delete a delivery order by id.
  - Path params: `id` — delivery order id
  - Success: 204 or 200

## LiveKit / Token (Authenticated)

- POST `/getToken`
  - Description: Generate a LiveKit access token for the authenticated user. Requires Firebase authentication middleware.
  - Authentication: Requires `Authorization: Bearer <Firebase ID token>` header. The middleware attaches `req.user.email` to the request and the controller uses that email to create a room/participant name and a LiveKit token.
  - Success: 200 + { token, roomName, participantName, email }

Example (get LiveKit token — protected):

```bash
curl -X POST http://localhost:3000/api/getToken \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json"
```

## Authentication

- Some endpoints are protected by Firebase authentication middleware. To access them you must provide a valid Firebase ID token in the `Authorization` header using the `Bearer` scheme.

- Example header:

```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

The protected endpoints in this API (current):
- `GET /takeaway/search/user` (requires auth)
- `POST /getToken` (requires auth)

If you want, I can add a short section describing how to mint a Firebase ID token for testing (using the Firebase Admin SDK or the client SDK) and include a curl example that uses a real token from your dev Firebase project.

## Examples

Assuming the router is mounted at `/api` and a local server at `http://localhost:3000`:

- List reservations:

```bash
curl -v http://localhost:3000/api/reservations
```

- Search reservations by user (example):

```bash
curl -v "http://localhost:3000/api/reservations/search/user?email=alice%40example.com"
```

- Search takeaway orders by user (example):

```bash
curl -v "http://localhost:3000/api/takeaway/search/user?phone=%2B1122334455"
```

- Search delivery orders by user (example):

```bash
curl -v "http://localhost:3000/api/delivery/search/user?name=Dana"
```

- Create a reservation (example JSON body — fields depend on controller/model):

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Alice","customer_email":"alice@example.com","customer_phone":"+1234567890","reservation_time":"2025-11-01T19:00:00Z","party_size":4}'
```

- Update takeaway order status:

```bash
curl -X PATCH http://localhost:3000/api/takeaway/123/status \
  -H "Content-Type: application/json" \
  -d '{"status":"ready"}'
```

- Partial update takeaway order by email (example):

```bash
curl -X PATCH http://localhost:3000/api/takeaway/email/charlie%40example.com \
  -H "Content-Type: application/json" \
  -d '{"special_instructions":"Please include extra napkins"}'
```

- Partial update delivery order by ID (example):

```bash
curl -X PATCH http://localhost:3000/api/delivery/DO123456 \
  -H "Content-Type: application/json" \
  -d '{"status":"out_for_delivery"}'
```

## Notes & Next Steps

- This README lists endpoints and common behaviors inferred from `backend/routes/index.js`. For exact request/response shapes, validation rules, and query parameters, check the respective controller files in `backend/controllers/` and model definitions in `backend/models/`.
- Consider adding request/response examples for each endpoint based on the controllers' implementations.
- Consider adding request/response examples for each endpoint based on the controllers' implementations.

## Request Fields — Required vs Optional

Below are the expected request body fields for create/update endpoints. Required fields are those the model/controller enforces when creating resources. Optional fields are accepted but either have defaults or are not required for creation. These are inferred from the Mongoose models in `backend/models/` and the controllers' behavior.

### Reservations (model: `Reservation`)
- Primary identifier: `booking_id` (string) — auto-generated default. Not required when creating a reservation (the model will generate one).
    - Required (create):
    - `customer_name` (string)
    - `customer_phone` (string)
    - `customer_email` (string)
    - `reservation_time` (string) — ISO datetime or datetime string accepted by your application
    - `party_size` (number)
    - Optional:
    - `composition` (object) — { adults, kids, elders, specially_abled } (numbers)
    - `preferences` (object) — { table_area, seating_type, accessibility, near }
    - `parking` (object) — { required (bool), type (valet|self|"") }
    - `kids_seats` (number)
    - `dietary` (object) — { plan, restrictions[], notes }
    - `occasion` (object) — { type, details }
    - `special_requests` (string)
    - `status` (enum: `pending|confirmed|cancelled|completed`) — defaults to `pending`

Example create reservation body (minimal):

```json
{
  "customer_name": "Alice",
  "customer_phone": "+1234567890",
  "customer_email": "alice@example.com",
  "reservation_time": "2025-11-01T19:00:00Z",
  "party_size": 4
}
```

Example create reservation body (with optional fields):

```json
{
  "customer_name": "Bob",
  "customer_phone": "+1987654321",
  "customer_email": "bob@example.com",
  "reservation_time": "2025-11-01T20:00:00Z",
  "party_size": 2,
  "preferences": { "table_area": "window", "seating_type": "booth" },
  "special_requests": "Vegetarian meal",
  "status": "confirmed"
}
```

### Takeaway Orders (model: `TakeawayOrder`)
- Primary identifier: `order_id` (string) — auto-generated default. Not required when creating an order.
- Required (create):
  - `customer_name` (string)
  - `customer_phone` (string)
  - `customer_email` (string)
  - `pickup_time` (string) — datetime/string
  - `items` (array) — must include at least one item; each item requires `name` (string). `quantity` and `price` have defaults.
- Optional:
  - `items[].quantity` (number) — defaults to 1
  - `items[].price` (number) — defaults to 0
  - `special_instructions` (string)
  - `status` (enum: `pending|preparing|ready|completed|cancelled`) — defaults to `pending`
  - `total` (number) — calculated automatically before save; controllers/models compute this (you can omit it)

Example create takeaway order body:

```json
{
  "customer_name": "Charlie",
  "customer_phone": "+1122334455",
  "customer_email": "charlie@example.com",
  "pickup_time": "2025-11-02T12:30:00Z",
  "items": [
    { "name": "Margherita Pizza", "quantity": 1, "price": 8.5 },
    { "name": "Soda", "quantity": 2, "price": 1.5 }
  ]
}
```

### Delivery Orders (model: `DeliveryOrder`)
- Primary identifier: `order_id` (string) — auto-generated default. Not required when creating an order.
- Required (create):
  - `customer_name` (string)
  - `customer_phone` (string)
  - `customer_email` (string)
  - `delivery_address` (string)
  - `delivery_time` (string) — datetime/string
  - `items` (array) — must include at least one item with `name`
- Optional:
  - `items[].quantity` (number) — defaults to 1
  - `items[].price` (number) — defaults to 0
  - `delivery_fee` (number) — default 5.00 in model
  - `special_instructions` (string)
  - `status` (enum: `pending|preparing|out_for_delivery|delivered|cancelled`) — defaults to `pending`
  - `total` (number) — calculated automatically before save; controllers/models compute this (you can omit it)

Example create delivery order body:

```json
{
  "customer_name": "Dana",
  "customer_phone": "+1098765432",
  "customer_email": "dana@example.com",
  "delivery_address": "123 Main St, Apt 4",
  "delivery_time": "2025-11-02T18:00:00Z",
  "items": [
    { "name": "Burger", "quantity": 2, "price": 7.0 }
  ]
}
```

### Menu Items (model: `Menu`)
- Primary identifier: `_id` (MongoDB ObjectId) — used in menu endpoints (`/menu/:id`).
- Required (create):
  - `name` (string)
  - `description` (string)
  - `price` (number)
  - `category` (string) — one of: `appetizer`, `main`, `dessert`, `beverage`, `side`
- Optional:
  - `tags` (array of strings)
  - `available` (boolean) — defaults to `true`

Example create menu item body:

```json
{
  "name": "Chocolate Cake",
  "description": "Rich chocolate layer cake",
  "price": 4.5,
  "category": "dessert",
  "tags": ["vegetarian"],
  "available": true
}
```

### Notes on validation and defaults
- Many fields have server-side defaults (e.g., `booking_id` / `order_id`, `status` values, `delivery_fee`) and computed values (`total`). When creating resources, omit auto-generated/computed fields — they will be filled by the model/hooks.
- Controllers return `400` for Mongoose validation errors and `404` for not-found when updating/deleting/fetching by ID.
- Check the exact enum values and nested object shapes in the model files located at `backend/models/` if you need stricter client-side validation.
