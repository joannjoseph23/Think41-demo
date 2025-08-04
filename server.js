const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ponnu2004',
    database: 'ecommerce'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// ✅ 1. List all customers (with pagination)
app.get('/customers', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    db.query(`SELECT * FROM users LIMIT ? OFFSET ?`, [limit, offset], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ 2. Get customer details + order count
app.get('/customers/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [customerId], (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userResult.length === 0) return res.status(404).json({ error: 'Customer not found' });

        db.query('SELECT COUNT(*) AS order_count FROM orders WHERE user_id = ?', [customerId], (err, orderResult) => {
            if (err) return res.status(500).json({ error: err.message });
            const user = userResult[0];
            user.order_count = orderResult[0].order_count;
            res.json(user);
        });
    });
});
// ✅ Get all orders for a specific customer
app.get('/customers/:id/orders', (req, res) => {
    const customerId = req.params.id;

    // Check if the customer exists first
    db.query('SELECT * FROM users WHERE id = ?', [customerId], (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userResult.length === 0) return res.status(404).json({ error: 'Customer not found' });

        // Fetch orders for that customer
        db.query('SELECT * FROM orders WHERE user_id = ?', [customerId], (err, orderResult) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                customer_id: customerId,
                orders: orderResult
            });
        });
    });
});
// ✅ Get details for a specific order
app.get('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    db.query('SELECT * FROM orders WHERE order_id = ?', [orderId], (err, orderResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (orderResult.length === 0) return res.status(404).json({ error: 'Order not found' });

        res.json(orderResult[0]);
    });
});


// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
