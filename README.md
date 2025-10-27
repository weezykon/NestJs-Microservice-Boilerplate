# Bookstore Microservices

A microservices-based bookstore application built with NestJS, featuring separate services for users, books, and an API gateway for centralized access.

## Architecture Overview

This project follows a microservices architecture pattern with the following components:

```
┌─────────────────────────────────────────────┐
│           API Gateway (HTTP)                │
│           Port: 3001                        │
└─────────────┬───────────────┬───────────────┘
              │               │
              │ TCP           │ TCP
              │               │
    ┌─────────▼─────┐   ┌────▼──────────┐
    │ Users Service │   │ Books Service │
    │ Port: 3002    │   │ Port: 3003    │
    │ (TCP)         │   │ (TCP)         │
    └───────────────┘   └───────────────┘
```

### Components

1. **API Gateway** (`apps/bookstore-api-gateway`)
   - HTTP server that acts as the entry point for all client requests
   - Routes requests to appropriate microservices
   - Runs on port 3001

2. **Users Microservice** (`apps/users`)
   - Handles user-related operations
   - TCP-based microservice
   - Runs on port 3002

3. **Books Microservice** (`apps/book`)
   - Manages book inventory and operations
   - TCP-based microservice
   - Runs on port 3003

4. **Shared Contracts** (`libs/contracts`)
   - Shared DTOs and interfaces across services

## Technologies Used

- **Framework**: NestJS 11.x
- **Runtime**: Node.js
- **Language**: TypeScript 5.x
- **Transport**: TCP (for microservices communication)
- **Package Manager**: npm

## Project Structure

```
bookstore/
├── apps/
│   ├── bookstore-api-gateway/     # HTTP API Gateway
│   │   └── src/
│   │       ├── books/             # Books module
│   │       ├── users/             # Users module
│   │       ├── client-config/     # Microservice client configuration
│   │       └── main.ts
│   ├── book/                      # Books microservice
│   │   └── src/
│   │       ├── book.controller.ts
│   │       ├── book.service.ts
│   │       └── main.ts
│   └── users/                     # Users microservice
│       └── src/
│           ├── users.controller.ts
│           ├── users.service.ts
│           └── main.ts
├── libs/
│   └── contracts/                 # Shared contracts/DTOs
├── .env                          # Environment configuration (not in git)
├── .env.example                  # Environment template
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookstore
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

## Environment Configuration

The `.env` file contains all port configurations:

```env
# API Gateway
API_GATEWAY_PORT=3001

# Microservices
USERS_SERVICE_PORT=3002
BOOKS_SERVICE_PORT=3003

# Client Ports (used by API Gateway to connect to microservices)
USERS_CLIENT_PORT=3002
BOOKS_CLIENT_PORT=3003
```

You can modify these ports as needed. If no `.env` file is present, the services will use these defaults.

## Running the Application

### Development Mode (with watch)

You need to run all three services simultaneously. Open three separate terminal windows:

**Terminal 1 - Users Microservice:**
```bash
npm run start users -- --watch
```

**Terminal 2 - Books Microservice:**
```bash
npm run start book -- --watch
```

**Terminal 3 - API Gateway:**
```bash
npm run start bookstore-api-gateway -- --watch
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Verify Services are Running

You should see console output indicating each service is running:
- `Users microservice is listening on port 3002`
- `Book microservice is listening on port 3003`
- `API Gateway is running on http://localhost:3001`

## API Endpoints

All requests go through the API Gateway at `http://localhost:3001`

### Users Endpoints

#### Get all users
```bash
GET /users
```

**Example:**
```bash
curl http://localhost:3001/users
```

**Response:**
```json
[
  { "id": 1, "name": "John Doe" },
  { "id": 2, "name": "Jane Smith" }
]
```

### Books Endpoints

#### Get all books
```bash
GET /books
```

**Example:**
```bash
curl http://localhost:3001/books
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "rating": 5
  },
  {
    "id": 2,
    "title": "1984",
    "author": "George Orwell",
    "rating": 5
  }
]
```

#### Get a specific book
```bash
GET /books/:id
```

**Example:**
```bash
curl http://localhost:3001/books/1
```

#### Create a new book
```bash
POST /books
Content-Type: application/json
```

**Example:**
```bash
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "rating": 4
  }'
```

#### Update a book
```bash
PATCH /books/:id
Content-Type: application/json
```

**Example:**
```bash
curl -X PATCH http://localhost:3001/books/1 \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
```

#### Delete a book
```bash
DELETE /books/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3001/books/1
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Adding a New Microservice

1. Generate a new NestJS application:
```bash
nest generate app <service-name>
```

2. Configure it as a microservice in `main.ts`:
```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  ServiceModule,
  {
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env.SERVICE_PORT || '3004', 10),
    },
  },
);
```

3. Add the service configuration to `.env`:
```env
SERVICE_PORT=3004
SERVICE_CLIENT_PORT=3004
```

4. Register the client in the API Gateway's `ClientConfigService`

### Project Commands

```bash
# Build all services
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## Architecture Decisions

### Why TCP for Microservices?

- **Performance**: TCP provides fast, reliable communication between services
- **Simplicity**: No need for message brokers or external dependencies
- **Internal Communication**: Services are not exposed directly to clients

### Why API Gateway?

- **Single Entry Point**: Clients only need to know one endpoint
- **Security**: Internal microservices are not directly accessible
- **Flexibility**: Easy to add authentication, rate limiting, etc.
- **Service Discovery**: Gateway handles routing to appropriate services

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

1. Find and kill the process:
```bash
# Find process using port 3001 (or 3002, 3003)
lsof -ti:3001

# Kill the process
kill -9 <PID>
```

2. Or change the port in `.env` file

### Socket Hang Up Error

This usually means:
- Microservices are not running
- Wrong port configuration in `.env`
- Microservice crashed

**Solution**: Ensure all three services (users, book, API gateway) are running

### Module Dependencies Error

If you see "Can't resolve dependencies" errors:
- Ensure you're using Symbol constants for dependency injection tokens
- Check that providers are correctly registered in modules

## License

This project is [MIT licensed](LICENSE).
