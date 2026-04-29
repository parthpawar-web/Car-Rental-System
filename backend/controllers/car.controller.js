const Car = require("../models/Car");

exports.addCar = async(req, res) => {
    try {
        const { carName, brand, model, pricePerDay, seats, fuelType, transmission, available, image } = req.body;
        if (!carName || !brand || !model || pricePerDay === undefined) {
            return res.status(400).json({ Message: "carName, brand, model, pricePerDay required", Success: false });
        }
        
        const car = await Car.create({ 
            carName, brand, model, pricePerDay, 
            seats: seats || 5, 
            fuelType: fuelType || 'Petrol', 
            transmission: transmission || 'Manual', 
            available: available !== undefined ? available : true, 
            image: image || null 
        });
        res.status(201).json({ Message: "Car added successfully", Success: true, Data: car });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};

exports.getAllCars = async(req, res) => {
    try { res.status(200).json({ Message: "Cars fetched", Success: true, Data: await Car.find().sort({ createdAt: -1 }) });
    } catch (e) { res.status(500).json({ Message: "Server error", Success: false }); }
};

exports.getSingleCar = async(req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ Message: "Car not found", Success: false });
        res.status(200).json({ Message: "Car fetched", Success: true, Data: car });
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