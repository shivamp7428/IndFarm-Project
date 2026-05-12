import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/test-keys', (req, res) => {
    res.json({
        key_id_exists: !!process.env.RAZORPAY_KEY_ID,
        key_secret_exists: !!process.env.RAZORPAY_KEY_SECRET,
        key_id_value: process.env.RAZORPAY_KEY_ID 
    });
});

export default router;