const express = require("express");
const userController = require("./../Controllers/tourController");
const router = express.Router();

// router.param("id", userController.checkID); 

router.route("/cheap-5-tour").get(userController.aliasRoute, userController.getAllTours);
router.route("/getTourStats").get(userController.getTourStatus);
router.route("/monthlyPlan/:year").get(userController.getMonthlyPlans);
router.route("/").get(userController.getAllTours).post(userController.createTour);

router.route("/:id").get(userController.getindividualtour).patch(userController.updateTour).delete(userController.deleteTour);

module.exports = router;