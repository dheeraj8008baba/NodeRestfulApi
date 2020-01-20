const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', ProductController.get_all_product);

router.post('/', checkAuth, upload.single('productImage'), ProductController.add_product);

router.get('/:productId', ProductController.get_one_product);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;