const DeliveryOrder = require('../models/deliveryorder');

// Get all delivery orders with optional filters
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { order_id: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } },
        { customer_phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await DeliveryOrder.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery orders',
      error: error.message
    });
  }
};

// Get delivery orders by user details (name, email, or phone)
exports.getOrdersByUser = async (req, res) => {
  try {
    const { name, email, phone } = req.query;

    // Ensure at least one parameter is provided
    if (!name && !email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'At least one search parameter (name, email, or phone) is required'
      });
    }

    // Build query with OR conditions for provided parameters
    const conditions = [];

    if (name) {
      conditions.push({ customer_name: { $regex: name, $options: 'i' } });
    }

    if (email) {
      conditions.push({ customer_email: { $regex: email, $options: 'i' } });
    }

    if (phone) {
      conditions.push({ customer_phone: { $regex: phone, $options: 'i' } });
    }

    const query = conditions.length > 1 ? { $or: conditions } : conditions[0];

    // Execute query
    const orders = await DeliveryOrder.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery orders by user',
      error: error.message
    });
  }
};

// Get single delivery order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await DeliveryOrder.findOne({ 
      order_id: req.params.id 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery order',
      error: error.message
    });
  }
};

// Create new delivery order
exports.createOrder = async (req, res) => {
  try {
    const order = new DeliveryOrder(req.body);
    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Delivery order created successfully',
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating delivery order',
      error: error.message
    });
  }
};

// Update delivery order
exports.updateOrder = async (req, res) => {
  try {
    const order = await DeliveryOrder.findOneAndUpdate(
      { order_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Delivery order updated successfully',
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating delivery order',
      error: error.message
    });
  }
};

// Update delivery order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const order = await DeliveryOrder.findOneAndUpdate(
      { order_id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Delivery order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery order status',
      error: error.message
    });
  }
};

// Update delivery order by email (partial update)
exports.updateOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for update'
      });
    }

    // Find and update order - only updates provided fields
    const order = await DeliveryOrder.findOneAndUpdate(
      { customer_email: email.toLowerCase() },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found with provided email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery order updated successfully',
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating delivery order',
      error: error.message
    });
  }
};

// Update delivery order by ID (partial update)
exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID parameter is required'
      });
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for update'
      });
    }

    // Find and update order - only updates provided fields
    const order = await DeliveryOrder.findOneAndUpdate(
      { order_id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found with provided ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery order updated successfully',
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating delivery order',
      error: error.message
    });
  }
};

// Delete delivery order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await DeliveryOrder.findOneAndDelete({ 
      order_id: req.params.id 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Delivery order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery order',
      error: error.message
    });
  }
};

// Get delivery order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await DeliveryOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: { $add: ['$total', '$delivery_fee'] } }
        }
      }
    ]);
    
    const totalOrders = await DeliveryOrder.countDocuments();
    const totalRevenue = await DeliveryOrder.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ['$total', '$delivery_fee'] } }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};