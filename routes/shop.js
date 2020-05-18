const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop');
const {body} = require('express-validator');

router.get('/shop', shopController.getProducts);
router.post('/product-add', isAuth, [
    body('gearBox').trim().isLength({min: 5, max: 25}),
    body('model').trim().isLength({min: 1, max: 15}),
    body('color').trim().notEmpty(),
    body('price').isNumeric(),
    body('imageUrl').isURL(),
    body('description').trim().isLength({min: 10, max: 250}),
    body('brand').isNumeric(),
    body('condition').isNumeric(),
    body('vehicle').isNumeric(),
    body('country').isNumeric(),
    body('mileage').isNumeric(),
    body('engine').isNumeric()
], shopController.postProduct);

router.post('/product/update', isAuth, [
    body('gearBox').trim().isLength({min: 5, max: 25}),
    body('model').trim().isLength({min: 1, max: 15}),
    body('color').trim().notEmpty(),
    body('price').isNumeric(),
    body('imageUrl').isURL(),
    body('description').trim().isLength({min: 10, max: 250}),
    body('brand').isNumeric(),
    body('condition').isNumeric(),
    body('vehicle').isNumeric(),
    body('country').isNumeric(),
    body('mileage').isNumeric(),
    body('engine').isNumeric()
] ,shopController.updateProduct);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/products', isAuth, shopController.getUserProducts);

router.post('/product/remove', isAuth, shopController.deleteProduct);

router.get('/cart', isAuth, shopController.getUserCart);

router.post('/cart/checkout', isAuth, shopController.postCartCheckout);

router.post('/cart/delete-product', isAuth, shopController.postDeleteCartItems);

router.post('/product/add-to-cart', isAuth, shopController.postToUserCart);

router.post('/admin', isAuth, shopController.getUserData);

module.exports = router;