const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    seats: { type: Number, default: 5 },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'], default: 'Petrol' },
    transmission: { type: String, enum: ['Manual', 'Automatic'], default: 'Manual' },
    category: { type: String, enum: ['SUV', 'Sedan', 'Hatchback', 'Sports', 'Luxury', 'Convertible', 'Electric', 'Minivan'], default: 'Sedan' },
    available: { type: Boolean, default: true },
    image: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);