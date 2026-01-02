-- Base de datos para tienda de mascotas
CREATE DATABASE IF NOT EXISTS pet_store;
USE pet_store;

-- Tabla de categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de clientes
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Tabla de detalles de órdenes
CREATE TABLE order_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Datos de ejemplo para categorías
INSERT INTO categories (name, description) VALUES
('Alimento para Perros', 'Comida seca y húmeda para perros de todas las razas'),
('Alimento para Gatos', 'Comida seca y húmeda para gatos'),
('Juguetes', 'Juguetes y accesorios de entretenimiento'),
('Accesorios', 'Correas, collares, camas y más'),
('Higiene', 'Productos de limpieza y cuidado personal');

-- Datos de ejemplo para productos
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
('Alimento Premium para Perro Adulto 15kg', 'Alimento balanceado con proteínas de alta calidad', 45.99, 50, 1, 'https://example.com/dog-food.jpg'),
('Alimento para Gato Adulto 10kg', 'Nutrición completa para gatos adultos', 38.50, 40, 2, 'https://example.com/cat-food.jpg'),
('Pelota de Goma para Perro', 'Juguete resistente ideal para ejercicio', 8.99, 100, 3, 'https://example.com/ball.jpg'),
('Rascador para Gato', 'Torre rascadora con múltiples niveles', 65.00, 25, 3, 'https://example.com/scratcher.jpg'),
('Collar Ajustable para Perro', 'Collar de nylon resistente con hebilla', 12.50, 75, 4, 'https://example.com/collar.jpg'),
('Shampoo para Mascotas 500ml', 'Shampoo hipoalergénico con aroma suave', 15.99, 60, 5, 'https://example.com/shampoo.jpg'),
('Cama Ortopédica para Perro', 'Cama con soporte para articulaciones', 89.99, 20, 4, 'https://example.com/bed.jpg'),
('Snacks Dentales para Perro', 'Premios que ayudan a limpiar los dientes', 11.99, 80, 1, 'https://example.com/snacks.jpg');

-- Datos de ejemplo para clientes
INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '555-0101', 'Calle Principal 123, Bogotá'),
('María', 'González', 'maria.gonzalez@email.com', '555-0102', 'Av. Libertador 456, Bogotá'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '555-0103', 'Cra 7 #89-45, Bogotá');

-- Datos de ejemplo para órdenes
INSERT INTO orders (customer_id, total, status) VALUES
(1, 54.98, 'delivered'),
(2, 103.50, 'processing'),
(3, 77.49, 'pending');

-- Datos de ejemplo para detalles de órdenes
INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 45.99, 45.99),
(1, 3, 1, 8.99, 8.99),
(2, 2, 2, 38.50, 77.00),
(2, 5, 2, 12.50, 25.00),
(3, 6, 1, 15.99, 15.99),
(3, 7, 1, 89.99, 89.99);