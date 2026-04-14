-- PostgreSQL database schema for GreatKart

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Category Seeding
INSERT INTO categories (name) VALUES 
('Shirts'), ('Books'), ('Perfume'), ('Suits'), 
('Pen'), ('Chain'), ('Shoes'), ('T_Shirt')
ON CONFLICT DO NOTHING;

-- Initial Product Seeding (Mock Data consistent with UI)
INSERT INTO products (name, category_id, price, image_url, rating, is_trending) VALUES 
('Hrx T Shirt', (SELECT id FROM categories WHERE name = 'T_Shirt'), 300.00, '/assets/retro_tshirt_1774971960721.png', 4.8, true),
('White New Design T_Shirt', (SELECT id FROM categories WHERE name = 'T_Shirt'), 280.00, '/assets/white_new_design_tshirt_1774972013120_png_1774972056772.png', 4.8, true),
('Red Printed T_Shirt', (SELECT id FROM categories WHERE name = 'T_Shirt'), 280.00, '/assets/red_printed_tshirt_1774971960721_png_1774971985202.png', 4.8, true),
('New Horse degined T_Shirt', (SELECT id FROM categories WHERE name = 'T_Shirt'), 250.00, '/assets/retro_tshirt_1774971960721.png', 4.8, false)
ON CONFLICT DO NOTHING;
