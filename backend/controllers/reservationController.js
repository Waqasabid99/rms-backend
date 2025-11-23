const Reservation = require("../models/reservation");

// Get all reservations with optional filters
exports.getAllReservations = async (req, res) => {
  try {
    const { status, search, sortBy = "createdAt", order = "desc" } = req.query;

    // Build query
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: "i" } },
        { booking_id: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { customer_phone: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with sorting
    const reservations = await Reservation.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reservations",
      error: error.message,
    });
  }
};

// Get reservations by user details (name, email, or phone)
exports.getReservationsByUser = async (req, res) => {
  try {
    const { name, email, phone } = req.query;

    // Ensure at least one parameter is provided
    if (!name && !email && !phone) {
      return res.status(400).json({
        success: false,
        message:
          "At least one search parameter (name, email, or phone) is required",
      });
    }

    // Build query with OR conditions for provided parameters
    const conditions = [];

    if (name) {
      conditions.push({ customer_name: { $regex: name, $options: "i" } });
    }

    if (email) {
      conditions.push({ customer_email: { $regex: email, $options: "i" } });
    }

    if (phone) {
      conditions.push({ customer_phone: { $regex: phone, $options: "i" } });
    }

    const query = conditions.length > 1 ? { $or: conditions } : conditions[0];

    // Execute query
    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reservations by user",
      error: error.message,
    });
  }
};

// Get single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      booking_id: req.params.id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reservation",
      error: error.message,
    });
  }
};

// Create new reservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating reservation",
      error: error.message,
    });
  }
};

// Update reservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { booking_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const reservation = await Reservation.findOneAndUpdate(
      { booking_id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation status updated successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating reservation status",
      error: error.message,
    });
  }
};

// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({
      booking_id: req.params.id,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting reservation",
      error: error.message,
    });
  }
};

// Update reservation by email (partial update)
exports.updateReservationByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    // Find and update reservation - only updates provided fields
    const reservation = await Reservation.findOneAndUpdate(
      { customer_email: email.toLowerCase() },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found with provided email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  }
};

// Update reservation by ID (partial update)
exports.updateReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    // Find and update reservation - only updates provided fields
    const reservation = await Reservation.findOneAndUpdate(
      { booking_id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found with provided ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  }
};

// Get reservation statistics
exports.getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalReservations = await Reservation.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total: totalReservations,
        byStatus: stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};