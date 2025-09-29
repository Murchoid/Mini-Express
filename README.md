# Mini-Express

A lightweight TypeScript implementation of an Express-like web framework with built-in middleware support, routing capabilities, and security features.

## Features

- 🚀 Express-like API with familiar routing patterns
- 🛡️ Built-in security middleware (CORS, Helmet)
- 📦 Body parsing support (JSON, URL-encoded)
- 🔒 Authorization middleware
- 🎯 Route parameters and query string parsing
- ⚡ Middleware chaining
- 🔍 Error handling
- 📝 Request logging
- ⏱️ Rate limiting capabilities

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Mini-Express.git

# Install dependencies
pnpm install

# Build the project
pnpm build

# Start the server
pnpm start

# Run in development mode
pnpm dev
```

## Quick Start

Here's a basic example of how to use Mini-Express:

```typescript
import { miniExpress } from '../miniExpress/core/mini-express';
import { jsonParser } from '../miniExpress/middleware/body/jsonParser';
import { Request, Response } from 'miniExpress/types';

const app = new miniExpress();

// Add middleware
app.use(jsonParser);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello world!" });
});

// Start the server
app.listen(3000, () => {
    console.log("Server listening in port 3000");
});
```

## Routing

Mini-Express supports dynamic route parameters and query strings:

```typescript
// Route parameters
app.get("/users/:id", (req: Request, res: Response) => {
    res.end(`User ID is ${req.params.id}`);
});

// Nested route parameters
app.get("/users/:userId/messages/:messageId", (req: Request, res: Response) => {
    res.end(`User ${req.params.userId}, message ${req.params.messageId}`);
});

// Query strings
app.get("/search", (req: Request, res: Response) => {
    res.status(200).json({ data: req.query });
});
```

## Middleware

### Built-in Middleware

1. **Body Parsers**
   - `jsonParser`: Parses JSON request bodies
   - `urlEncodedParser`: Parses URL-encoded request bodies

2. **Security Middleware**
   - `CORS`: Cross-Origin Resource Sharing support
   - `miniHelmet`: Basic security headers
   - `authorize`: Basic authorization checks

3. **Utility Middleware**
   - `errorHandler`: Global error handling
   - `logger`: Request logging
   - `validate`: Request validation
   - `rateLimit`: Basic rate limiting

### Using Middleware

```typescript
import { jsonParser } from '../miniExpress/middleware/body/jsonParser';
import { errorHandler } from '../miniExpress/middleware/utils/errorHanlder';
import { logger } from '../miniExpress/middleware/utils/logger';

const app = new miniExpress();

// Global middleware
app.use(jsonParser);
app.use(logger);
app.use(errorHandler);

// Route-specific middleware
app.get('/protected', authorize, (req: Request, res: Response) => {
    res.json({ message: 'Protected resource' });
});
```

## Error Handling

Mini-Express includes built-in error handling:

```typescript
// Error handling middleware
app.use(errorHandler);

// Throwing errors in routes
app.get("/fail", (req: Request, res: Response, next: any) => {
    next(new Error("Something went wrong!"));
});
```

## Types

### Request Interface

```typescript
interface Request {
    method: string;
    url: string;
    headers: Record<string, string | string[] | undefined>;
    path: string;
    query: Record<string, string | string[] | undefined>;
    params: Record<string, string | undefined>;
    body?: any;
    raw: import('http').IncomingMessage;
}
```

### Response Interface

```typescript
interface Response {
    status(code: number): Response;
    set(field: string, value: string): Response;
    json(obj: any): void;
    send(body: string | Buffer | object): void;
    end(msg: string): void;
    raw: import('http').ServerResponse;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Michael Kamau