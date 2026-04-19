/**
 * External Event Routes
 * ──────────────────────────────────────────────────────
 * Endpoints for managing external events from other colleges
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/externalEventController");

/**
 * GET /external-events
 * Fetch all external events (publicly accessible for students)
 * Query params:
 *   - limit: Number of results to return
 *   - skip: Number of results to skip (pagination)
 *   - sort: Sort order ('asc' or 'desc' by date)
 */
router.get("/", controller.getAllExternalEvents);

/**
 * POST /external-events
 * Create a new external event (Admin only)
 * Body: { title, college_name, date, description, registration_link, source }
 */
router.post("/", controller.createExternalEvent);

/**
 * PUT /external-events/:id
 * Update an external event (Admin only)
 * Params: id - Event ID
 * Body: Fields to update
 */
router.put("/:id", controller.updateExternalEvent);

/**
 * DELETE /external-events/:id
 * Delete an external event (Admin only)
 * Params: id - Event ID
 */
router.delete("/:id", controller.deleteExternalEvent);

module.exports = router;
