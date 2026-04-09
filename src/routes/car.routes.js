const express = require("express");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const upload = require("../config/upload");

const {
    addCar,
    getAllCars,
    updateCar,
    deleteCar,
} = require("../controllers/car.controller");

const router = express.Router();

// Public
router.get("/", getAllCars);

// Protected (ADMIN/OWNER)
router.post("/", auth, allowRoles("ADMIN", "OWNER"), upload.single("image"), addCar);
router.put("/:id", auth, allowRoles("ADMIN", "OWNER"), updateCar);
router.delete("/:id", auth, allowRoles("ADMIN", "OWNER"), deleteCar);

module.exports = router;