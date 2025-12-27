-- Shoes table
CREATE TABLE IF NOT EXISTS shoes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image VARCHAR(500),
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table (for order line items)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    shoe_id INTEGER REFERENCES shoes(id) ON DELETE SET NULL,
    shoe_name VARCHAR(255) NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shoes_category ON shoes(category);
CREATE INDEX IF NOT EXISTS idx_shoes_brand ON shoes(brand);
CREATE INDEX IF NOT EXISTS idx_shoes_price ON shoes(price);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Insert sample shoes data with placeholder images
INSERT INTO shoes (name, brand, category, description, price, original_price, image, sizes, colors, tags, rating, reviews, stock, featured) VALUES
('Air Max 90', 'Nike', 'sneakers', 'Classic Nike Air Max 90 with visible air cushioning for all-day comfort.', 129.99, 159.99, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-max-90-mens-shoes-6n3vKB.png', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Black', 'Red'], ARRAY['featured', 'bestseller'], 4.8, 245, 50, true),
('Classic Leather', 'Reebok', 'sneakers', 'Timeless Reebok Classic Leather sneakers with soft leather upper.', 89.99, NULL, 'https://i.ebayimg.com/images/g/RIYAAOSwEztkW~kT/s-l1600.jpg', ARRAY['6', '7', '8', '9', '10', '11'], ARRAY['White', 'Black', 'Navy'], ARRAY['new'], 4.5, 128, 35, false),
('Chuck Taylor All Star', 'Converse', 'casual', 'Iconic Converse Chuck Taylor high-top canvas sneakers.', 65.00, 75.00, 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7b6a5a5a/images/a_107/M9160_A_107X1.jpg', ARRAY['5', '6', '7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Red', 'Navy'], ARRAY['featured'], 4.7, 312, 80, true),
('Ultraboost 22', 'Adidas', 'running', 'Premium Adidas running shoe with responsive Boost midsole.', 189.99, 210.00, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Grey'], ARRAY['new', 'featured'], 4.9, 89, 25, true),
('Old Skool', 'Vans', 'skate', 'Classic Vans Old Skool skate shoes with signature side stripe.', 70.00, NULL, 'https://images.vans.com/is/image/Vans/D3HY28-HERO', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['Black/White', 'Navy', 'Burgundy'], ARRAY['bestseller'], 4.6, 456, 60, false),
('574 Core', 'New Balance', 'casual', 'Comfortable New Balance 574 with ENCAP midsole technology.', 99.99, 119.99, 'https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?wid=600', ARRAY['7', '8', '9', '10', '11'], ARRAY['Grey', 'Navy', 'Black'], ARRAY['new', 'bestseller'], 4.4, 178, 45, false),
('Air Jordan 1 Retro High', 'Nike', 'sneakers', 'The iconic Air Jordan 1 that started it all. Premium leather construction.', 170.00, 180.00, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-e0e31d05-85f3-4a66-ad69-8dd1db1cd04c/air-jordan-1-retro-high-og-mens-shoes-Jnr4WV.png', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['Chicago Red', 'Royal Blue', 'Shadow Grey'], ARRAY['featured', 'bestseller'], 4.9, 523, 30, true),
('Gel-Kayano 29', 'Asics', 'running', 'Maximum support running shoe with GEL technology cushioning.', 159.99, 179.99, 'https://images.asics.com/is/image/asics/1011B440_004_SR_RT_GLB?wid=600', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'Blue', 'White'], ARRAY['new'], 4.7, 234, 40, false),
('Suede Classic', 'Puma', 'casual', 'Timeless Puma Suede with soft suede upper and rubber sole.', 75.00, NULL, 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/374915/01/sv01/fnd/PNA/fmt/png', ARRAY['6', '7', '8', '9', '10', '11'], ARRAY['Black', 'Navy', 'Burgundy', 'Forest Green'], ARRAY['bestseller'], 4.5, 289, 55, false),
('Free Run 5.0', 'Nike', 'running', 'Lightweight and flexible running shoe for natural movement.', 109.99, 129.99, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1ccce36f-0e1e-4e1c-8c4e-5e8e8b9f9b0c/free-run-5-road-running-shoes-M3mj0r.png', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Volt'], ARRAY['new', 'featured'], 4.6, 167, 35, true),
('Stan Smith', 'Adidas', 'casual', 'Clean and classic tennis-inspired sneaker with perforated stripes.', 85.00, 95.00, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/22b65d3bb1da4f7ab0e8ae3700ec982f_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg', ARRAY['5', '6', '7', '8', '9', '10', '11', '12'], ARRAY['White/Green', 'White/Navy', 'All White'], ARRAY['bestseller'], 4.8, 412, 70, false),
('Sk8-Hi', 'Vans', 'skate', 'High-top skate shoe with padded collar for support and flexibility.', 75.00, NULL, 'https://images.vans.com/is/image/Vans/D5IB8C-HERO', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['Black', 'True White', 'Checkerboard'], ARRAY['featured'], 4.7, 345, 50, true),
('Pegasus 40', 'Nike', 'running', 'Versatile running shoe with React foam for responsive cushioning.', 129.99, 139.99, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c8092f02-9d28-4cc3-8b06-7825c9c0eb6c/pegasus-40-road-running-shoes-zD8H8c.png', ARRAY['7', '8', '9', '10', '11', '12', '13'], ARRAY['Black', 'White', 'Grey', 'Blue'], ARRAY['new', 'bestseller'], 4.8, 298, 45, false),
('Club C 85', 'Reebok', 'casual', 'Retro tennis shoe with soft leather upper and EVA midsole.', 79.99, 89.99, 'https://i.ebayimg.com/images/g/~G0AAOSwRfRk~hT9/s-l1600.jpg', ARRAY['6', '7', '8', '9', '10', '11'], ARRAY['White', 'Black', 'Grey'], ARRAY['new'], 4.4, 156, 40, false),
('990v5', 'New Balance', 'running', 'Premium made in USA running shoe with ENCAP midsole.', 184.99, NULL, 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?wid=600', ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['Grey', 'Navy', 'Black'], ARRAY['featured', 'bestseller'], 4.9, 187, 25, true),
('Gazelle', 'Adidas', 'casual', 'Classic 90s style with soft suede upper and rubber outsole.', 89.99, 99.99, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/1b4b3a4e7e7e4b7b8b8bab3b00b6b6b6_9366/Gazelle_Shoes_Black_BB5476_01_standard.jpg', ARRAY['5', '6', '7', '8', '9', '10', '11'], ARRAY['Black', 'Navy', 'Red', 'Green'], ARRAY['new'], 4.6, 234, 55, false),
('Era', 'Vans', 'skate', 'Low-top skate shoe with padded collar and waffle outsole.', 55.00, 65.00, 'https://images.vans.com/is/image/Vans/EWZBLK-HERO', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['Black', 'Navy', 'Red'], ARRAY['bestseller'], 4.5, 278, 65, false),
('Air Force 1 Low', 'Nike', 'sneakers', 'The legendary AF1 with Air-Sole unit and premium leather.', 109.99, NULL, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/350e7f3a-979a-402b-9396-a1e7b19fbfd2/air-force-1-07-mens-shoes-jBrhbr.png', ARRAY['6', '7', '8', '9', '10', '11', '12', '13'], ARRAY['White', 'Black', 'Wheat'], ARRAY['featured', 'bestseller'], 4.9, 678, 80, true)
ON CONFLICT DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_shoes_updated_at ON shoes;
CREATE TRIGGER update_shoes_updated_at
    BEFORE UPDATE ON shoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
