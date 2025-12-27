const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://shoestore:shoestore123@localhost:5432/shoestore',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
// CORS configuration for production domain
const corsOptions = {
  origin: [
    'http://my-test.co.ke',
    'http://www.my-test.co.ke',
    'http://localhost:9090',
    'http://localhost:3002'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'shoe-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Shoe Store API is running!' });
});

// Upload single image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Use relative URL for compatibility with nginx proxy and direct access
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all uploaded images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`
      }));
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SHOES API ====================

// Get all shoes
app.get('/api/shoes', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, featured } = req.query;
    let query = 'SELECT * FROM shoes WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      query += ` AND LOWER(category) = LOWER($${paramIndex++})`;
      params.push(category);
    }
    if (brand && brand !== 'all') {
      query += ` AND LOWER(brand) = LOWER($${paramIndex++})`;
      params.push(brand);
    }
    if (minPrice) {
      query += ` AND price >= $${paramIndex++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND price <= $${paramIndex++}`;
      params.push(maxPrice);
    }
    if (featured === 'true') {
      query += ' AND featured = true';
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    // Transform to match frontend expected format
    const shoes = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      image: row.image,
      sizes: row.sizes || [],
      colors: row.colors || [],
      tags: row.tags || [],
      rating: parseFloat(row.rating) || 0,
      reviews: row.reviews || 0,
      stock: row.stock || 0,
      featured: row.featured
    }));

    res.json({ shoes });
  } catch (error) {
    console.error('Error fetching shoes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single shoe by ID
app.get('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM shoes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    const row = result.rows[0];
    const shoe = {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      image: row.image,
      sizes: row.sizes || [],
      colors: row.colors || [],
      tags: row.tags || [],
      rating: parseFloat(row.rating) || 0,
      reviews: row.reviews || 0,
      stock: row.stock || 0,
      featured: row.featured
    };

    res.json({ shoe });
  } catch (error) {
    console.error('Error fetching shoe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new shoe
app.post('/api/shoes', async (req, res) => {
  try {
    const { name, brand, category, description, price, originalPrice, image, sizes, colors, tags, rating, reviews, stock, featured } = req.body;

    const result = await pool.query(
      `INSERT INTO shoes (name, brand, category, description, price, original_price, image, sizes, colors, tags, rating, reviews, stock, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [name, brand, category, description, price, originalPrice, image, sizes || [], colors || [], tags || [], rating || 0, reviews || 0, stock || 0, featured || false]
    );

    res.status(201).json({ success: true, shoe: result.rows[0] });
  } catch (error) {
    console.error('Error creating shoe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update shoe
app.put('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, category, description, price, originalPrice, image, sizes, colors, tags, rating, reviews, stock, featured } = req.body;

    const result = await pool.query(
      `UPDATE shoes SET 
        name = COALESCE($1, name),
        brand = COALESCE($2, brand),
        category = COALESCE($3, category),
        description = COALESCE($4, description),
        price = COALESCE($5, price),
        original_price = $6,
        image = COALESCE($7, image),
        sizes = COALESCE($8, sizes),
        colors = COALESCE($9, colors),
        tags = COALESCE($10, tags),
        rating = COALESCE($11, rating),
        reviews = COALESCE($12, reviews),
        stock = COALESCE($13, stock),
        featured = COALESCE($14, featured)
       WHERE id = $15
       RETURNING *`,
      [name, brand, category, description, price, originalPrice, image, sizes, colors, tags, rating, reviews, stock, featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json({ success: true, shoe: result.rows[0] });
  } catch (error) {
    console.error('Error updating shoe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete shoe
app.delete('/api/shoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM shoes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json({ success: true, message: 'Shoe deleted successfully' });
  } catch (error) {
    console.error('Error deleting shoe:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS API ====================

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status, email } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (email) {
      query += ` AND customer_email = $${paramIndex++}`;
      params.push(email);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order with items
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);

    res.json({ 
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { 
      customerName, customerEmail, customerPhone,
      shippingAddress, billingAddress,
      paymentMethod, items, subtotal, shippingCost, tax, total, notes 
    } = req.body;

    const orderNumber = generateOrderNumber();

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, billing_address, payment_method, subtotal, shipping_cost, tax, total, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [orderNumber, customerName, customerEmail, customerPhone, shippingAddress, billingAddress, paymentMethod, subtotal, shippingCost || 0, tax || 0, total, notes]
    );

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, shoe_id, shoe_name, size, color, quantity, price, total)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [order.id, item.shoeId, item.name, item.size, item.color, item.quantity, item.price, item.quantity * item.price]
      );

      // Optionally reduce stock
      if (item.shoeId) {
        await client.query(
          'UPDATE shoes SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
          [item.quantity, item.shoeId]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({ 
      success: true, 
      order,
      orderNumber: order.order_number
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const result = await pool.query(
      `UPDATE orders SET 
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        notes = COALESCE($3, notes)
       WHERE id = $4
       RETURNING *`,
      [status, paymentStatus, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size is too large. Max 5MB allowed.' });
    }
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Upload images to: http://localhost:${PORT}/api/upload`);
  console.log(`Images will be stored in: ${uploadsDir}`);
});
