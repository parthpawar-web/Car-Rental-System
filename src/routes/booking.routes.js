const express = require("express");
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus, deleteBooking } = require("../controllers/booking.controller");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

const router = express.Router();

router.post("/", auth, createBooking);
router.get("/my-bookings", auth, getUserBookings);
router.get("/", auth, allowRoles("ADMIN", "OWNER"), getAllBookings);
router.put("/:id", auth, allowRoles("ADMIN", "OWNER"), updateBookingStatus);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
