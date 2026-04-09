const Car = require("../models/Car");

exports.addCar = async(req, res) => {
    try {
        const { name, brand, pricePerDay, seats, fuelType, transmission, category, available } = req.body;
        if (!name || !brand || pricePerDay === undefined) return res.status(400).json({ Message: "name, brand, pricePerDay required", Success: false });
        const car = await Car.create({ name, brand, pricePerDay, seats: seats || 5, fuelType: fuelType || 'Petrol', transmission: transmission || 'Manual', category: category || 'Sedan', available: available !== undefined ? available : true, image: req.file ? `uploads/cars/${req.file.filename}` : null });
        res.status(201).json({ Message: "Car added successfully", Success: true, Data: car });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};

exports.getAllCars = async(req, res) => {
    try { res.status(200).json({ Message: "Cars fetched", Success: true, Data: await Car.find().sort({ createdAt: -1 }) });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};

exports.updateCar = async(req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!car) return res.status(404).json({ Message: "Car not found", Success: false });
        res.status(200).json({ Message: "Car updated successfully", Success: true, Data: car });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};

exports.deleteCar = async(req, res) => {
    try {
        if (!await Car.findByIdAndDelete(req.params.id)) return res.status(404).json({ Message: "Car not found", Success: false });
        res.status(200).json({ Message: "Car deleted successfully", Success: true });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};