const express = require('express');
const router = express.Router();

// Import controllers
const reservationController = require('../controllers/reservationController');
const takeawayController = require('../controllers/takeawayController');
const deliveryController = require('../controllers/deliveryController');
const menuController = require('../controllers/menuController');
const tokenController = require('../controllers/tokenController');
const firebaseAuth = require('../middleware/auth.middleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Firebase ID token for authentication
 *   
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         name:
 *           type: string
 *           example: Chocolate Cake
 *         description:
 *           type: string
 *           example: Rich chocolate layer cake
 *         price:
 *           type: number
 *           example: 4.5
 *         category:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, side]
 *           example: dessert
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [vegetarian]
 *         available:
 *           type: boolean
 *           default: true
 *     
 *     Reservation:
 *       type: object
 *       required:
 *         - customer_name
 *         - customer_phone
 *         - customer_email
 *         - reservation_time
 *         - party_size
 *       properties:
 *         booking_id:
 *           type: string
 *           description: Auto-generated booking identifier
 *         customer_name:
 *           type: string
 *           example: Alice
 *         customer_phone:
 *           type: string
 *           example: +1234567890
 *         customer_email:
 *           type: string
 *           example: alice@example.com
 *         reservation_time:
 *           type: string
 *           format: date-time
 *           example: 2025-11-01T19:00:00Z
 *         party_size:
 *           type: number
 *           example: 4
 *         composition:
 *           type: object
 *           properties:
 *             adults:
 *               type: number
 *             kids:
 *               type: number
 *             elders:
 *               type: number
 *             specially_abled:
 *               type: number
 *         preferences:
 *           type: object
 *           properties:
 *             table_area:
 *               type: string
 *             seating_type:
 *               type: string
 *             accessibility:
 *               type: string
 *             near:
 *               type: string
 *         parking:
 *           type: object
 *           properties:
 *             required:
 *               type: boolean
 *             type:
 *               type: string
 *               enum: [valet, self, '']
 *         kids_seats:
 *           type: number
 *         dietary:
 *           type: object
 *           properties:
 *             plan:
 *               type: string
 *             restrictions:
 *               type: array
 *               items:
 *                 type: string
 *             notes:
 *               type: string
 *         occasion:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *             details:
 *               type: string
 *         special_requests:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *     
 *     OrderItem:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Margherita Pizza
 *         quantity:
 *           type: number
 *           default: 1
 *           example: 2
 *         price:
 *           type: number
 *           default: 0
 *           example: 8.5
 *     
 *     TakeawayOrder:
 *       type: object
 *       required:
 *         - customer_name
 *         - customer_phone
 *         - customer_email
 *         - pickup_time
 *         - items
 *       properties:
 *         order_id:
 *           type: string
 *           description: Auto-generated order identifier
 *         customer_name:
 *           type: string
 *           example: Charlie
 *         customer_phone:
 *           type: string
 *           example: +1122334455
 *         customer_email:
 *           type: string
 *           example: charlie@example.com
 *         pickup_time:
 *           type: string
 *           format: date-time
 *           example: 2025-11-02T12:30:00Z
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         special_instructions:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, preparing, ready, completed, cancelled]
 *           default: pending
 *         total:
 *           type: number
 *           description: Auto-calculated total amount
 *     
 *     DeliveryOrder:
 *       type: object
 *       required:
 *         - customer_name
 *         - customer_phone
 *         - customer_email
 *         - delivery_address
 *         - delivery_time
 *         - items
 *       properties:
 *         order_id:
 *           type: string
 *           description: Auto-generated order identifier
 *         customer_name:
 *           type: string
 *           example: Dana
 *         customer_phone:
 *           type: string
 *           example: +1098765432
 *         customer_email:
 *           type: string
 *           example: dana@example.com
 *         delivery_address:
 *           type: string
 *           example: 123 Main St, Apt 4
 *         delivery_time:
 *           type: string
 *           format: date-time
 *           example: 2025-11-02T18:00:00Z
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         delivery_fee:
 *           type: number
 *           default: 5.00
 *         special_instructions:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, preparing, out_for_delivery, delivered, cancelled]
 *           default: pending
 *         total:
 *           type: number
 *           description: Auto-calculated total amount including delivery fee
 *     
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Resource not found
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Validation failed
 *         errors:
 *           type: object
 *   
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized - Missing or invalid token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             message: "Unauthorized: Invalid or expired token"
 *     
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationError'
 */

// ============================================
// MENU ROUTES
// ============================================

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     description: Retrieve all menu items with optional filters for category, search term, sorting
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, side]
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for menu items
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/menu', menuController.getAllMenuItems);

/**
 * @swagger
 * /menu/stats:
 *   get:
 *     summary: Get menu statistics
 *     description: Retrieve aggregated statistics about menu items (counts by category, average price, availability counts)
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Menu statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: number
 *                 byCategory:
 *                   type: object
 *                 averagePrice:
 *                   type: number
 *                 availableCount:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/menu/stats', menuController.getMenuStats);

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     description: Retrieve a single menu item by its MongoDB _id
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.get('/menu/:id', menuController.getMenuItemById);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create new menu item
 *     description: Add a new item to the menu
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *           example:
 *             name: Chocolate Cake
 *             description: Rich chocolate layer cake
 *             price: 4.5
 *             category: dessert
 *             tags: [vegetarian]
 *             available: true
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */
router.post('/menu', menuController.createMenuItem);

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update menu item
 *     description: Perform a full update of a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.put('/menu/:id', menuController.updateMenuItem);

/**
 * @swagger
 * /menu/{id}:
 *   patch:
 *     summary: Update menu item availability
 *     description: Update only the availability status of a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *           example:
 *             available: false
 *     responses:
 *       200:
 *         description: Menu item availability updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/menu/:id', menuController.updateMenuItemAvailability);

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete menu item
 *     description: Remove a menu item from the database
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       204:
 *         description: Menu item deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.delete('/menu/:id', menuController.deleteMenuItem);

// ============================================
// RESERVATION ROUTES
// ============================================

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Retrieve all reservations with optional filters (date ranges, status, pagination)
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by reservation status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by reservation date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */
router.get('/reservations', reservationController.getAllReservations);

/**
 * @swagger
 * /reservations/stats:
 *   get:
 *     summary: Get reservation statistics
 *     description: Retrieve aggregated statistics about reservations (counts, busiest times, status distribution)
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Reservation statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReservations:
 *                   type: number
 *                 byStatus:
 *                   type: object
 *                 busiestTimes:
 *                   type: array
 *       500:
 *         description: Internal server error
 */
router.get('/reservations/stats', reservationController.getReservationStats);

/**
 * @swagger
 * /reservations/search/user:
 *   get:
 *     summary: Search reservations by user details
 *     description: Find reservations by customer name, email, or phone number. At least one query parameter is required.
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by customer name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by customer email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search by customer phone number
 *     responses:
 *       200:
 *         description: List of matching reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: At least one query parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/reservations/search/user', reservationController.getReservationsByUser);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     description: Retrieve a single reservation by its booking_id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation booking_id
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.get('/reservations/:id', reservationController.getReservationById);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create new reservation
 *     description: Book a new table reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *           example:
 *             customer_name: Alice
 *             customer_phone: +1234567890
 *             customer_email: alice@example.com
 *             reservation_time: 2025-11-01T19:00:00Z
 *             party_size: 4
 *             preferences:
 *               table_area: window
 *               seating_type: booth
 *             special_requests: Vegetarian meal
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */
router.post('/reservations', reservationController.createReservation);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation
 *     description: Perform a full update of a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation booking_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.put('/reservations/:id', reservationController.updateReservation);

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     description: Update only the status of a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation booking_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *           example:
 *             status: confirmed
 *     responses:
 *       200:
 *         description: Reservation status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/reservations/:id/status', reservationController.updateReservationStatus);

/**
 * @swagger
 * /reservations/email/{email}:
 *   patch:
 *     summary: Update reservation by email
 *     description: Partially update a reservation using customer email
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             special_requests: Please add extra chairs
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/reservations/email/:email', reservationController.updateReservationByEmail);

/**
 * @swagger
 * /reservations/{id}:
 *   patch:
 *     summary: Update reservation by ID
 *     description: Partially update specific fields of a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation booking_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             party_size: 6
 *             special_requests: Birthday celebration
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/reservations/:id', reservationController.updateReservationById);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete reservation
 *     description: Cancel and remove a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation booking_id
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       204:
 *         description: Reservation deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.delete('/reservations/:id', reservationController.deleteReservation);

// ============================================
// TAKEAWAY ORDER ROUTES
// ============================================

/**
 * @swagger
 * /takeaway:
 *   get:
 *     summary: Get all takeaway orders
 *     description: Retrieve all takeaway orders with optional filters
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, completed, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by pickup date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of takeaway orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TakeawayOrder'
 *       500:
 *         description: Internal server error
 */
router.get('/takeaway', takeawayController.getAllOrders);

/**
 * @swagger
 * /takeaway/stats:
 *   get:
 *     summary: Get takeaway order statistics
 *     description: Retrieve aggregated statistics about takeaway orders
 *     tags: [Takeaway Orders]
 *     responses:
 *       200:
 *         description: Takeaway order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 byStatus:
 *                   type: object
 *                 totalRevenue:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/takeaway/stats', takeawayController.getOrderStats);

/**
 * @swagger
 * /takeaway/search/user:
 *   get:
 *     summary: Search takeaway orders by user details
 *     description: Find takeaway orders by customer name, email, or phone number. At least one query parameter is required. This endpoint requires authentication.
 *     tags: [Takeaway Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by customer name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by customer email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search by customer phone number
 *     responses:
 *       200:
 *         description: List of matching takeaway orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TakeawayOrder'
 *       400:
 *         description: At least one query parameter is required
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */
router.get('/takeaway/search/user', firebaseAuth , takeawayController.getOrdersByUser);

/**
 * @swagger
 * /takeaway/{id}:
 *   get:
 *     summary: Get takeaway order by ID
 *     description: Retrieve a single takeaway order by its order_id
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Takeaway order_id
 *     responses:
 *       200:
 *         description: Takeaway order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.get('/takeaway/:id', takeawayController.getOrderById);

/**
 * @swagger
 * /takeaway:
 *   post:
 *     summary: Create new takeaway order
 *     description: Place a new takeaway order
 *     tags: [Takeaway Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TakeawayOrder'
 *           example:
 *             customer_name: Charlie
 *             customer_phone: +1122334455
 *             customer_email: charlie@example.com
 *             pickup_time: 2025-11-02T12:30:00Z
 *             items:
 *               - name: Margherita Pizza
 *                 quantity: 1
 *                 price: 8.5
 *               - name: Soda
 *                 quantity: 2
 *                 price: 1.5
 *     responses:
 *       201:
 *         description: Takeaway order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */
router.post('/takeaway', takeawayController.createOrder);

/**
 * @swagger
 * /takeaway/{id}:
 *   put:
 *     summary: Update takeaway order
 *     description: Perform a full update of a takeaway order
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Takeaway order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TakeawayOrder'
 *     responses:
 *       200:
 *         description: Takeaway order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.put('/takeaway/:id', takeawayController.updateOrder);

/**
 * @swagger
 * /takeaway/{id}/status:
 *   patch:
 *     summary: Update takeaway order status
 *     description: Update only the status of a takeaway order
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Takeaway order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, completed, cancelled]
 *           example:
 *             status: ready
 *     responses:
 *       200:
 *         description: Takeaway order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/takeaway/:id/status', takeawayController.updateOrderStatus);

/**
 * @swagger
 * /takeaway/email/{email}:
 *   patch:
 *     summary: Update takeaway order by email
 *     description: Partially update a takeaway order using customer email
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             special_instructions: Please include extra napkins
 *     responses:
 *       200:
 *         description: Takeaway order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/takeaway/email/:email', takeawayController.updateOrderByEmail);

/**
 * @swagger
 * /takeaway/{id}:
 *   patch:
 *     summary: Update takeaway order by ID
 *     description: Partially update specific fields of a takeaway order
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Takeaway order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             pickup_time: 2025-11-02T13:00:00Z
 *             special_instructions: Extra spicy
 *     responses:
 *       200:
 *         description: Takeaway order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TakeawayOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/takeaway/:id', takeawayController.updateOrderById);

/**
 * @swagger
 * /takeaway/{id}:
 *   delete:
 *     summary: Delete takeaway order
 *     description: Cancel and remove a takeaway order
 *     tags: [Takeaway Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Takeaway order_id
 *     responses:
 *       200:
 *         description: Takeaway order deleted successfully
 *       204:
 *         description: Takeaway order deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.delete('/takeaway/:id', takeawayController.deleteOrder);

// ============================================
// DELIVERY ORDER ROUTES
// ============================================

/**
 * @swagger
 * /delivery:
 *   get:
 *     summary: Get all delivery orders
 *     description: Retrieve all delivery orders with optional filters
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by delivery date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of delivery orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryOrder'
 *       500:
 *         description: Internal server error
 */
router.get('/delivery', deliveryController.getAllOrders);

/**
 * @swagger
 * /delivery/stats:
 *   get:
 *     summary: Get delivery order statistics
 *     description: Retrieve aggregated statistics about delivery orders
 *     tags: [Delivery Orders]
 *     responses:
 *       200:
 *         description: Delivery order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 byStatus:
 *                   type: object
 *                 totalRevenue:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/delivery/stats', deliveryController.getOrderStats);

/**
 * @swagger
 * /delivery/search/user:
 *   get:
 *     summary: Search delivery orders by user details
 *     description: Find delivery orders by customer name, email, or phone number. At least one query parameter is required.
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by customer name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by customer email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search by customer phone number
 *     responses:
 *       200:
 *         description: List of matching delivery orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         description: At least one query parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/delivery/search/user', deliveryController.getOrdersByUser);

/**
 * @swagger
 * /delivery/{id}:
 *   get:
 *     summary: Get delivery order by ID
 *     description: Retrieve a single delivery order by its order_id
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery order_id
 *     responses:
 *       200:
 *         description: Delivery order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.get('/delivery/:id', deliveryController.getOrderById);

/**
 * @swagger
 * /delivery:
 *   post:
 *     summary: Create new delivery order
 *     description: Place a new delivery order
 *     tags: [Delivery Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryOrder'
 *           example:
 *             customer_name: Dana
 *             customer_phone: +1098765432
 *             customer_email: dana@example.com
 *             delivery_address: 123 Main St, Apt 4
 *             delivery_time: 2025-11-02T18:00:00Z
 *             items:
 *               - name: Burger
 *                 quantity: 2
 *                 price: 7.0
 *     responses:
 *       201:
 *         description: Delivery order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */
router.post('/delivery', deliveryController.createOrder);

/**
 * @swagger
 * /delivery/{id}:
 *   put:
 *     summary: Update delivery order
 *     description: Perform a full update of a delivery order
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryOrder'
 *     responses:
 *       200:
 *         description: Delivery order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.put('/delivery/:id', deliveryController.updateOrder);

/**
 * @swagger
 * /delivery/{id}/status:
 *   patch:
 *     summary: Update delivery order status
 *     description: Update only the status of a delivery order
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, out_for_delivery, delivered, cancelled]
 *           example:
 *             status: out_for_delivery
 *     responses:
 *       200:
 *         description: Delivery order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/delivery/:id/status', deliveryController.updateOrderStatus);

/**
 * @swagger
 * /delivery/email/{email}:
 *   patch:
 *     summary: Update delivery order by email
 *     description: Partially update a delivery order using customer email
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             delivery_address: 456 Oak Ave, Suite 2B
 *     responses:
 *       200:
 *         description: Delivery order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/delivery/email/:email', deliveryController.updateOrderByEmail);

/**
 * @swagger
 * /delivery/{id}:
 *   patch:
 *     summary: Update delivery order by ID
 *     description: Partially update specific fields of a delivery order
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery order_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *           example:
 *             delivery_time: 2025-11-02T19:00:00Z
 *             special_instructions: Ring doorbell twice
 *     responses:
 *       200:
 *         description: Delivery order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryOrder'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.patch('/delivery/:id', deliveryController.updateOrderById);

/**
 * @swagger
 * /delivery/{id}:
 *   delete:
 *     summary: Delete delivery order
 *     description: Cancel and remove a delivery order
 *     tags: [Delivery Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery order_id
 *     responses:
 *       200:
 *         description: Delivery order deleted successfully
 *       204:
 *         description: Delivery order deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 */
router.delete('/delivery/:id', deliveryController.deleteOrder);

// ============================================
// LIVEKIT TOKEN ROUTE
// ============================================

/**
 * @swagger
 * /getToken:
 *   post:
 *     summary: Get LiveKit access token
 *     description: Generate a LiveKit access token for the authenticated user. Requires Firebase authentication.
 *     tags: [LiveKit]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: LiveKit token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: LiveKit access token
 *                 roomName:
 *                   type: string
 *                   description: Room name for the session
 *                 participantName:
 *                   type: string
 *                   description: Participant name
 *                 email:
 *                   type: string
 *                   description: User email
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */
// router.post('/getToken', firebaseAuth, tokenController.getToken);

module.exports = router;