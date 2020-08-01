const router = require('express').Router();
const AdminController = require('../controllers/adminController');
const ActivityController = require('../controllers/ActivityController');
const BankController = require('../controllers/BankController');
const BookingController = require('../controllers/BookingController');
const CategoryController = require('../controllers/CategoryController');
const FeatureController = require('../controllers/FeatureController');
const ItemController = require('../controllers/ItemController');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');

router.get('/signin', AdminController.viewSignin);
router.post('/signin', AdminController.actionSignin);
router.use(auth);
router.get('/logout', AdminController.actionLogout);
router.get('/dashboard', AdminController.viewDashboard);

// endpoint category
router.get('/category', CategoryController.viewCategory);
router.post('/category', CategoryController.addCategory);
router.put('/category', CategoryController.editCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

// endpoint bank
router.get('/bank', BankController.viewBank);
router.post('/bank', uploadSingle, BankController.addBank);
router.put('/bank', uploadSingle, BankController.editBank);
router.delete('/bank/:id', BankController.deleteBank);

// endpoint item
router.get('/item', ItemController.viewItem);
router.post('/item', uploadMultiple, ItemController.addItem);
router.get('/item/show-image/:id', ItemController.showImageItem);
router.get('/item/:id', ItemController.showEditItem);
router.put('/item/:id', uploadMultiple, ItemController.editItem);
router.delete('/item/:id/delete', ItemController.deleteItem);
router.get('/item/show-detail-item/:itemId', ItemController.viewDetailItem);

// endpoint feature item
router.post('/item/add/feature', uploadSingle, FeatureController.addFeature);
router.put('/item/update/feature', uploadSingle, FeatureController.editFeature);
router.delete('/item/:itemId/feature/:id', FeatureController.deleteFeature);

// endpoint activity item
router.post('/item/add/activity', uploadSingle, ActivityController.addActivity);
router.put('/item/update/activity', uploadSingle, ActivityController.editActivity);
router.delete('/item/:itemId/activity/:id', ActivityController.deleteActivity);


router.get('/booking', BookingController.viewBooking);
router.get('/booking/:id', BookingController.showDetailBooking);
router.put('/booking/:id/confirmation', BookingController.actionConfirmation);
router.put('/booking/:id/reject', BookingController.actionReject);

module.exports = router;