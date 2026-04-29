const Booking = require("../models/Booking");
const Car = require("../models/Car");

exports.createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;
        const car = await Car.findById(carId);
        if (!car || !car.available) return res.status(400).json({ Message: "Car not available", Success: false });
        if (await Booking.findOne({ carId, status: { $nin: ["CANCELLED"] }, startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } })) 
            return res.status(400).json({ Message: "Car already booked for these dates", Success: false });
        const totalPrice = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) * car.pricePerDay;
        res.status(201).json({ Message: "Booking created", Success: true, Data: await Booking.create({ userId: req.user.id, carId, startDate, endDate, totalPrice }) });
    } catch (e) { res.status(500).json({ Message: e.message, Success: false }); }
};

exports.getUserBookings = async (req, res) => {
    try { res.json({ Success: true, Data: await Booking.find({ userId: req.user.id }).populate("carId") });
    } catch (e) { res.status(500).json({ Message: e.message, Success: false }); }
};

exports.getAllBookings = async (req, res) => {
    try { res.json({ Success: true, Data: await Booking.find().populate("userId carId") });
    } catch (e) { res.status(500).json({ Message: e.message, Success: false }); }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!booking) return res.status(404).json({ Message: "Booking not found", Success: false });
        res.json({ Message: "Booking updated", Success: true, Data: booking });
    } catch (e) { res.status(500).json({ Message: e.message, Success: false }); }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ Message: "Booking not found", Success: false });
        if (booking.userId.toString() !== req.user.id && !['ADMIN', 'OWNER'].includes(req.user.role)) return res.status(403).json({ Message: "Not authorized", Success: false });
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ Message: "Booking cancelled successfully", Success: true });
    } catch (e) { res.status(500).json({ Message: e.message, Success: false }); }
};
