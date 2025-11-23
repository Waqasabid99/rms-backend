const express = require('express');
const router = express.Router();

// Import controllers
const reservationController = require('../controllers/reservationController');
const takeawayController = require('../controllers/takeawayController');
const deliveryController = require('../controllers/deliveryController');
const menuController = require('../controllers/menuController');
const tokenController = require('../controllers/tokenController');
const firebaseAuth = require('../middleware/auth.middleware');
// ============================================
// MENU ROUTES
// ============================================

// Get all menu items (with optional filters)
router.get('/menu', menuController.getAllMenuItems);

// Get menu statistics
router.get('/menu/stats', menuController.getMenuStats);

// Get single menu item by ID
router.get('/menu/:id', menuController.getMenuItemById);

// Create new menu item
router.post('/menu', menuController.createMenuItem);

// Update menu item
router.put('/menu/:id', menuController.updateMenuItem);

// Update menu item availability only
router.patch('/menu/:id', menuController.updateMenuItemAvailability);

// Delete menu item
router.delete('/menu/:id', menuController.deleteMenuItem);

// ============================================
// RESERVATION ROUTES
// ============================================

// Get all reservations (with optional filters)
router.get('/reservations', reservationController.getAllReservations);

// Get reservation statistics
router.get('/reservations/stats', reservationController.getReservationStats);

// Get reservations by user details (name, email, or phone)
router.get('/reservations/search/user', reservationController.getReservationsByUser);

// Get single reservation by booking_id
router.get('/reservations/:id', reservationController.getReservationById);

// Create new reservation
router.post('/reservations', reservationController.createReservation);

// Update reservation (full update)
router.put('/reservations/:id', reservationController.updateReservation);

// Update reservation status only (must come before the general PATCH route)
router.patch('/reservations/:id/status', reservationController.updateReservationStatus);

// Update reservation by email (partial update)
router.patch('/reservations/email/:email', reservationController.updateReservationByEmail);

// Update reservation by ID (partial update)
router.patch('/reservations/:id', reservationController.updateReservationById);

// Delete reservation
router.delete('/reservations/:id', reservationController.deleteReservation);

// ============================================
// TAKEAWAY ORDER ROUTES
// ============================================

// Get all takeaway orders (with optional filters)
router.get('/takeaway', takeawayController.getAllOrders);

// Get takeaway order statistics
router.get('/takeaway/stats', takeawayController.getOrderStats);

// Get takeaway orders by user details (name, email, or phone)
router.get('/takeaway/search/user', firebaseAuth , takeawayController.getOrdersByUser);

// Get single takeaway order by order_id
router.get('/takeaway/:id', takeawayController.getOrderById);

// Create new takeaway order
router.post('/takeaway', takeawayController.createOrder);

// Update takeaway order
router.put('/takeaway/:id', takeawayController.updateOrder);

// Update takeaway order status only (must come before the general PATCH route)
router.patch('/takeaway/:id/status', takeawayController.updateOrderStatus);

// Update takeaway order by email (partial update)
router.patch('/takeaway/email/:email', takeawayController.updateOrderByEmail);

// Update takeaway order by ID (partial update)
router.patch('/takeaway/:id', takeawayController.updateOrderById);

// Delete takeaway order
router.delete('/takeaway/:id', takeawayController.deleteOrder);

// ============================================
// DELIVERY ORDER ROUTES
// ============================================

// Get all delivery orders (with optional filters)
router.get('/delivery', deliveryController.getAllOrders);

// Get delivery order statistics
router.get('/delivery/stats', deliveryController.getOrderStats);

// Get delivery orders by user details (name, email, or phone)
router.get('/delivery/search/user', deliveryController.getOrdersByUser);

// Get single delivery order by order_id
router.get('/delivery/:id', deliveryController.getOrderById);

// Create new delivery order
router.post('/delivery', deliveryController.createOrder);

// Update delivery order
router.put('/delivery/:id', deliveryController.updateOrder);

// Update delivery order status only (must come before the general PATCH route)
router.patch('/delivery/:id/status', deliveryController.updateOrderStatus);

// Update delivery order by email (partial update)
router.patch('/delivery/email/:email', deliveryController.updateOrderByEmail);

// Update delivery order by ID (partial update)
router.patch('/delivery/:id', deliveryController.updateOrderById);

// Delete delivery order
router.delete('/delivery/:id', deliveryController.deleteOrder);

// LiveKit API routes
router.post('/getToken', firebaseAuth, tokenController.getToken); 

module.exports = router;