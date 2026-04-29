const express = require("express");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");


const {
    addCar,
    getAllCars,
    getSingleCar,
    updateCar,
    deleteCar,
} = require("../controllers/car.controller");

const router = express.Router();

// Public
router.get("/", getAllCars);
router.get("/:id", getSingleCar);

// Protected (ADMIN/OWNER)
router.post("/", auth, allowRoles("ADMIN", "OWNER"), addCar);
router.put("/:id", auth, allowRoles("ADMIN", "OWNER"), updateCar);
router.delete("/:id", auth, allowRoles("ADMIN", "OWNER"), deleteCar);

module.exports = router;