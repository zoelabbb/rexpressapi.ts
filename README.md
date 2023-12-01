# rexpress REST API

This repository contains a simple REST API for managing blog-related functionalities, including creating posts, creating users, fetching a feed of posts, deleting posts, and updating posts. This API is built using [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma](https://www.prisma.io/), and [TypeScript](https://www.typescriptlang.org/)] for database interactions I'am using PostgreSQL [fl0](https://fl0.com/).

## Features

1. **Create Post**: Allows the creation of new blog posts.

2. **Create User**: Enables the creation of user accounts.

3. **Feed**: Fetches a feed of blog posts, including author information.

4. **Delete Post**: Allows the deletion of a specific blog post.

5. **Update Post**: Enables the update of an existing blog post.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zoelabbb/rexpressapi.ts.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rexpressapi
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up your database connection in the `.env` file:

   ```env
   DATABASE_URL="your-database-url"
   ```

   Replace `"your-database-url"` with the actual URL of your database, in this case I'm using PostgreSQL by fl0.

5. Run the database migrations:

   ```js
   npx prisma migrate dev init
   ```
6. Compile the your project: _**(Optional)**_

   ```js
   npx tsc
   ```

7. Start the server:

   ```js
   npm run dev
   # or
   node compile/index.ts
   ```

The API should now be running locally at [http://localhost:3000](http://localhost:3000).

## API Endpoints

- **Get All Feed**:
> `GET /feed`
- **Create New Post**:
>`POST /posts`
- **Get Data Post by Id**:
>`GET /posts/:postId`
- **Update Data Post by Id**:
>`GET /posts/:postId`
- **Delete Data Post by Id**:
>`GET /posts/:postId`
- **Create New User**:
> `POST /users`
- **Get Username users**:
> `GET /:username`

Feel free to customize and extend the API based on your specific requirements!