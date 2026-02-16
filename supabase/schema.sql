-- Amor en Pétalos Database Schema
-- PostgreSQL Database for Flower Shop ERP System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    birthday DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_birthday ON customers(birthday);

-- ============================================
-- PRODUCTS TABLE (Perishable Inventory)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    expiry_date DATE NOT NULL, -- CRITICAL: Track when flowers expire
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT positive_stock CHECK (stock_quantity >= 0),
    CONSTRAINT positive_price CHECK (price >= 0)
);

CREATE INDEX idx_products_expiry ON products(expiry_date);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock_quantity);

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'Yape', 'Plin', 'Efectivo'
    sale_date TIMESTAMP DEFAULT NOW(),
    items JSONB NOT NULL, -- Array of {product_id, quantity, price}
    CONSTRAINT positive_amount CHECK (total_amount >= 0)
);

CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_items ON sales USING GIN(items);

-- ============================================
-- ORDERS TABLE (Delivery Management)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    delivery_address TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    dedication_text TEXT, -- Message for the card
    status VARCHAR(50) NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'En Ruta', 'Entregado'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Sample Customers
INSERT INTO customers (name, phone, email, birthday) VALUES
('María González', '987654321', 'maria@email.com', '1990-05-15'),
('Carlos Pérez', '912345678', NULL, '1985-08-22'),
('Ana Torres', '998877665', 'ana@email.com', '1992-12-10');

-- Sample Products (Flowers)
INSERT INTO products (name, category, stock_quantity, price, expiry_date) VALUES
('Rosas Rojas', 'Rosas', 50, 5.00, CURRENT_DATE + INTERVAL '7 days'),
('Rosas Blancas', 'Rosas', 30, 5.50, CURRENT_DATE + INTERVAL '1 day'), -- Expiring soon!
('Girasoles', 'Girasoles', 40, 4.00, CURRENT_DATE + INTERVAL '5 days'),
('Tulipanes', 'Tulipanes', 25, 6.00, CURRENT_DATE + INTERVAL '3 days'),
('Orquídeas', 'Orquídeas', 15, 12.00, CURRENT_DATE + INTERVAL '10 days'),
('Lirios', 'Lirios', 20, 7.00, CURRENT_DATE + INTERVAL '2 days'); -- Expiring soon!

-- Sample Sales
INSERT INTO sales (customer_id, total_amount, payment_method, items) 
SELECT 
    c.id,
    25.00,
    'Yape',
    jsonb_build_array(
        jsonb_build_object('product_id', p.id, 'quantity', 5, 'price', 5.00)
    )
FROM customers c, products p
WHERE c.phone = '987654321' AND p.name = 'Rosas Rojas'
LIMIT 1;

-- Sample Orders
INSERT INTO orders (sale_id, customer_id, delivery_address, delivery_date, dedication_text, status)
SELECT 
    s.id,
    c.id,
    'Av. Principal 123, Lima',
    CURRENT_DATE,
    'Feliz cumpleaños mi amor ❤️',
    'Pendiente'
FROM customers c, sales s
WHERE c.phone = '987654321'
LIMIT 1;

-- Add another pending delivery for today
INSERT INTO orders (customer_id, delivery_address, delivery_date, dedication_text, status)
SELECT 
    c.id,
    'Jr. Las Flores 456, Lima',
    CURRENT_DATE,
    'Con cariño para mamá 💐',
    'Pendiente'
FROM customers c
WHERE c.phone = '912345678'
LIMIT 1;
