# API RESTful - Tienda de Mascotas

API completa para gestionar una tienda de productos para mascotas, desarrollada con Node.js, Express y MySQL.

## Características

- CRUD completo para productos, categorías y órdenes
- Relaciones entre tablas con claves foráneas
- Transacciones para órdenes (validación de stock)
- Manejo centralizado de errores
- Validación de datos
- Soft delete para productos
- Documentación de endpoints

## Tecnologías

- Node.js
- Express.js
- MySQL
- mysql2 (con promesas)
- dotenv
- cors

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AdrianPua-code/pet-store-api.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Crear base de datos
mysql -u root -p < pet_store.sql

# Iniciar servidor
npm run dev
```

## Estructura de la Base de Datos

### Tablas principales:
- **categories**: Categorías de productos
- **products**: Productos de la tienda
- **customers**: Clientes registrados
- **orders**: Órdenes de compra
- **order_details**: Detalles de cada orden

## Endpoints

### Base URL: `http://localhost:3000/api`

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/:id` | Obtener producto por ID |
| POST | `/products` | Crear nuevo producto |
| PUT | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto (soft delete) |

**Ejemplo POST /products:**
```json
{
  "name": "Alimento Premium para Perro",
  "description": "Alimento balanceado de alta calidad",
  "price": 45.99,
  "stock": 50,
  "category_id": 1,
  "image_url": "https://example.com/image.jpg"
}
```

### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categories` | Listar todas las categorías |
| GET | `/categories/:id` | Obtener categoría con sus productos |
| POST | `/categories` | Crear nueva categoría |
| PUT | `/categories/:id` | Actualizar categoría |
| DELETE | `/categories/:id` | Eliminar categoría |

**Ejemplo POST /categories:**
```json
{
  "name": "Alimento para Perros",
  "description": "Comida seca y húmeda para perros"
}
```

### Órdenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/orders` | Listar todas las órdenes |
| GET | `/orders/:id` | Obtener orden por ID con detalles |
| POST | `/orders` | Crear nueva orden |
| PATCH | `/orders/:id/status` | Actualizar estado de orden |

**Ejemplo POST /orders:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

**Estados de orden válidos:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

## Respuestas de la API

### Respuesta exitosa:
```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta con error:
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

## Pruebas con cURL

```bash
# Listar productos
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juguete para gato",
    "price": 12.99,
    "stock": 30,
    "category_id": 3
  }'

# Crear orden
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2}
    ]
  }'
```

## Características Destacadas para Portafolio

1. **Arquitectura MVC**: Separación clara de responsabilidades
2. **Manejo de errores**: Middleware centralizado
3. **Transacciones**: Gestión segura de órdenes con rollback
4. **Validaciones**: Control de datos de entrada
5. **Relaciones SQL**: Foreign keys y JOIN queries
6. **Pool de conexiones**: Mejor rendimiento
7. **Async/Await**: Código moderno y limpio
8. **Código documentado**: Comentarios y README completo

## Seguridad

- Variables de entorno para credenciales
- Validación de entrada de datos
- Prevención de SQL injection con consultas preparadas
- CORS configurado

## Mejoras Futuras

- [ ] Autenticación JWT
- [ ] Paginación de resultados
- [ ] Búsqueda y filtros avanzados
- [ ] Carga de imágenes
- [ ] Tests unitarios
- [ ] Docker containerization
- [ ] Documentación con Swagger

## Autor

Adrian Samudio Pua - [Adrian.yusef.pua@gmail.com]

## Licencia

MIT
