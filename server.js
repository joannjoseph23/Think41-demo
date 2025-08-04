const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ponnu2004',  // change if needed
    database: 'ecommerce'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL');
    }
});


// ✅ 1. List all customers (with order count)
app.get('/customers', (req, res) => {
    const sql = `
        SELECT u.id, u.first_name, u.last_name, u.email,
               COUNT(o.order_id) AS order_count
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error fetching customers:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


// ✅ 2. Get customer details + order count
app.get('/customers/:id', (req, res) => {
    const customerId = req.params.id;

    const userQuery = `SELECT * FROM users WHERE id = ?`;
    const orderCountQuery = `SELECT COUNT(*) AS order_count FROM orders WHERE user_id = ?`;

    db.query(userQuery, [customerId], (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userResult.length === 0) return res.status(404).json({ error: 'Customer not found' });

        db.query(orderCountQuery, [customerId], (err, orderResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const user = userResult[0];
            user.order_count = orderResult[0].order_count;
            res.json(user);
        });
    });
});


// ✅ 3. Get all orders for a specific customer
app.get('/customers/:id/orders', (req, res) => {
    const customerId = req.params.id;

    const checkUserQuery = `SELECT id FROM users WHERE id = ?`;
    const ordersQuery = `SELECT order_id, status, num_of_item, created_at 
                         FROM orders WHERE user_id = ?`;

    db.query(checkUserQuery, [customerId], (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userResult.length === 0) return res.status(404).json({ error: 'Customer not found' });

        db.query(ordersQuery, [customerId], (err, orders) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(orders); // ✅ Return an array directly (modal expects this)
        });
    });
});


// ✅ 4. Get details for a specific order
app.get('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    const orderQuery = `SELECT * FROM orders WHERE order_id = ?`;

    db.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (orderResult.length === 0) return res.status(404).json({ error: 'Order not found' });

        res.json(orderResult[0]);
    });
});


// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
