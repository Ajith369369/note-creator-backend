# Note Creator Backend

A TypeScript-based Express.js backend server for the Note Creator application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Environment variables configured (`.env` file)

## Installation

```bash
npm install
```

## Development

Run the development server with auto-reload using nodemon:

```bash
npm run dev
```

This will:

- Watch for changes in `.ts` files
- Automatically restart the server using `ts-node`
- Run in development mode

## Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

This generates the compiled JavaScript files in the `dist/` directory.

## Production

For production deployment:

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm start
   ```

The server will run the compiled JavaScript from `dist/index.js`.

## Type Checking

Check for TypeScript errors without compiling:

```bash
npm run typecheck
```

## Project Structure

```plain
backend/
├── dist/              # Compiled JavaScript (generated)
├── controllers/       # Request handlers (.ts)
├── database/          # Database connection (.ts)
├── middleware/        # Express middleware (.ts)
├── model/             # Mongoose models (.ts)
├── routes/            # API routes (.ts)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (.ts)
├── tsconfig.json      # TypeScript configuration
├── nodemon.json       # Nodemon configuration
└── package.json       # Dependencies and scripts
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server (requires build first)
- `npm run typecheck` - Type check without compiling

## Environment Variables

Create a `.env` file in the root directory with:

```bash
PORT=3500
DATABASE=your_mongodb_connection_string

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting Cloudinary Credentials

1. Sign up for a free account at [https://cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your `Cloud Name`, `API Key`, and `API Secret`
4. Add them to your `.env` file

**Note**: Without Cloudinary credentials, image uploads will fail. The application will log a warning on startup if credentials are missing.

## API Endpoints

- `POST /register` - User registration
- `POST /login` - User login
- `POST /notes/user/add` - Add a note (requires authentication)
- `GET /notes/user/all` - Get all notes of a user (requires authentication)
- `GET /notes/user/:id` - Get a specific note
- `PUT /notes/user/edit/:id` - Edit a note (requires authentication)
- `DELETE /notes/user/delete/:id` - Delete a note (requires authentication)
- `GET /profile-home/admin` - Get admin dashboard data (requires authentication)
- `DELETE /profile-home/admin/user/delete/:id` - Delete user and notes (requires authentication)

## Deployment

### Heroku

1. Build the project:

   ```bash
   npm run build
   ```

2. Ensure `package.json` has:

   ```json
   {
     "main": "dist/index.js",
     "scripts": {
       "start": "node dist/index.js"
     }
   }
   ```

3. Deploy to Heroku (Heroku will run `npm start` automatically)

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3500

CMD ["npm", "start"]
```

### Vercel / Netlify

These platforms typically require serverless functions. Consider using a different deployment strategy or converting to serverless functions.

## Notes

- The `dist/` folder is generated during build and should be added to `.gitignore`
- Source TypeScript files are in the root directories
- Type definitions are in the `types/` directory
- Images are stored in Cloudinary cloud storage (not local filesystem)
