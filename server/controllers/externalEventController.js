/**
 * External Event Controller
 * ──────────────────────────────────────────────────────
 * Handles all operations for external events from other colleges
 * Functions:
 *   - getAllExternalEvents: Fetch all external events
 *   - createExternalEvent: Create a new external event (admin only)
 *   - updateExternalEvent: Update an external event
 *   - deleteExternalEvent: Delete an external event
 */

const ExternalEvent = require("../models/ExternalEvent");

/**
 * Get all external events
 * ──────────────────────────────────────────────────────
 * Returns a list of all external events, sorted by date (upcoming first)
 * Query params:
 *   - limit: Number of events to return (default: 100)
 *   - skip: Number of events to skip for pagination (default: 0)
 *   - sort: Sort order 'asc' (oldest first) or 'desc' (newest first) (default: 'asc')
 */
exports.getAllExternalEvents = async (req, res) => {
  try {
    const { limit = 100, skip = 0, sort = "asc" } = req.query;
    
    // Convert limit and skip to integers
    const limitNum = Math.min(parseInt(limit, 10) || 100, 500);
    const skipNum = parseInt(skip, 10) || 0;

    // Determine sort order: 1 for ascending (upcoming), -1 for descending
    const sortOrder = sort === "desc" ? -1 : 1;

    // Query all external events, sorted by date
    const events = await ExternalEvent.find({})
      .sort({ date: sortOrder })
      .limit(limitNum)
      .skip(skipNum);

    // Get total count for pagination
    const totalCount = await ExternalEvent.countDocuments();

    // Return success response with events
    return res.status(200).json({
      success: true,
      message: "External events fetched successfully",
      data: events,
      pagination: {
        total: totalCount,
        limit: limitNum,
        skip: skipNum,
        hasMore: skipNum + limitNum < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching external events:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching external events",
      error: error.message,
    });
  }
};

/**
 * Create a new external event (Admin only)
 * ──────────────────────────────────────────────────────
 * Body params:
 *   - title: Event title (required)
 *   - college_name: College organizing the event (required)
 *   - date: Event date (required)
 *   - description: Event description
 *   - registration_link: URL for registration (required)
 *   - source: Source of event info (default: "Manual")
 */
exports.createExternalEvent = async (req, res) => {
  try {
    const { title, college_name, date, description, registration_link, source } =
      req.body;

    // Validate required fields
    if (!title || !college_name || !date || !registration_link) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, college_name, date, registration_link",
      });
    }

    // Create new external event
    const newEvent = new ExternalEvent({
      title,
      college_name,
      date: new Date(date),
      description: description || "",
      registration_link,
      source: source || "Manual",
    });

    // Save to database
    await newEvent.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "External event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error creating external event:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error creating external event",
      error: error.message,
    });
  }
};

/**
 * Update an external event (Admin only)
 * ──────────────────────────────────────────────────────
 * Params: id - Event ID to update
 * Body: Any fields to update (title, college_name, date, etc.)
 */
exports.updateExternalEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if event exists
    const event = await ExternalEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "External event not found",
      });
    }

    // Update the event
    const updatedEvent = await ExternalEvent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "External event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating external event:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating external event",
      error: error.message,
    });
  }
};

/**
 * Delete an external event (Admin only)
 * ──────────────────────────────────────────────────────
 * Params: id - Event ID to delete
 */
exports.deleteExternalEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const event = await ExternalEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "External event not found",
      });
    }

    // Delete the event
    await ExternalEvent.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "External event deleted successfully",
      data: { deletedId: id },
    });
  } catch (error) {
    console.error("Error deleting external event:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error deleting external event",
      error: error.message,
    });
  }
};
