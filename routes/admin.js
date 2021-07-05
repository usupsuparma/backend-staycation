const router = require("express").Router();
const adminController = require("../controller/AdminController");
const { uploadSingle } = require("../middlewares/multer");

router.get("/dashboard", adminController.viewDashboard);
// router category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.ediCategory);
router.delete("/category/:id", adminController.deleteCategory);

// router bank
router.get("/bank", adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank);
router.put("/bank", uploadSingle, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

router.get("/item", adminController.viewItem);
router.get("/booking", adminController.viewBooking);

module.exports = router;
