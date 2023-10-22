# Streakzzz
Streakzzz is a project consisting of a monorepo (using pnpm-workspaces) with client and server applications, along with a shared package for handling input validation using zod schemas. The application offers login/signup functionality and enables users to manage their tasks and streaks(habits).

[Demo Video](https://www.linkedin.com/feed/update/urn:li:activity:7101828265333469184/)

## Table of Contents
- [Run locally](#run-locally)  
- [apps/client (Frontend)](#client-frontend)
- [apps/server (Backend)](#server-backend)
- [packages/common](#packages-common)

## Run locally

### Prerequisites
Before you begin, make sure you have the following tools installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (Install using `npm install -g pnpm`)
- [Git](https://git-scm.com/)

### Installation
1. Clone the repository and install dependencies:
    ```sh
    git clone https://github.com/spiritanand/streakzzz
    cd streakzzz
    pnpm install
    ```
2. DB Setup: Create a database in your local mySQL server.
3. Create a `.env` file in the `apps/server` and `apps/client` directory. Add your DB credentials. Example given in each directory's `.env.example`.
4. DB Migration:
   - Run the following command in the `apps/server` directory to create and push the tables:
     ```sh
     pnpm run db:migrate
     pnpm run push:sql
     ``` 
    - Run the following command to see the DB in drizzle studio:
      ```sh
      pnpm run studio
      ```  
5. Run the following command to start the development process:
    ```sh
    pnpm run start
    ```
   This will start the client and server applications in development mode. The client application will be available at `http://localhost:5173` and the server application will be available at `http://localhost:8080`.
6. For linting, run the following command:
    ```sh
    pnpm run lint
    ```

## Client (Frontend)
The client application is built using React and styled using Tailwind CSS. It leverages various tools and libraries to create a seamless user experience:
- **React**: The frontend is built using the React library, enabling the creation of reusable UI components and efficient rendering.
- **Tailwind CSS**: Styling is managed using Tailwind CSS, allowing rapid UI development with utility-first classes.
- **React Query**: State management, data fetching, and state mutation are managed using React Query. It provides an intuitive API for handling asynchronous data.
- **React Hook Form**: All forms in the application are built using React Hook Form, simplifying form validation and submission.

## Server (Backend)
The server application is responsible for handling data storage, processing, and authentication:
- **Express**: The backend is built using Express, a minimal and flexible Node.js framework. It provides a simple API for handling HTTP requests.
- **SQL Database**: The backend uses a SQL database to store user data, tasks, and streaks. The relationship between users and tasks is managed elegantly using SQL's relational features.
- **Drizzle ORM**: To interact with the SQL database, the application employs the Drizzle ORM. This simplifies database queries and management.

### Authentication Routes
The application provides several authentication routes to manage user accounts:
- `POST /auth/login` - Handles user login using email and password.
- `POST /auth/signup` - Handles user signup using name, email and password.
- `POST /auth/logout` - Logs out the user.
- `GET /auth/me` - Retrieves information about the user (if authenticated).

### User Routes
Protected routes that require authentication to access and manage tasks:
- `GET /todos/:type`- Retrieves user tasks based on the provided type (todo or streak).
- `POST /todo/add`- Adds a new task for the user.
- `PATCH /todo/toggle`- Toggles the completion status of a task.
- `PATCH /todo/edit`- Edits the content of an existing task.
- `DELETE /todo/delete/:id`- Deletes a task by its ID.


## Packages (Common)
The shared package contains zod schemas and types, which ensure input validation at runtime:
- **Zod Schemas**: The package defines zod schemas that validate user input. This ensures that the input adheres to defined rules, enhancing data integrity. Goes where TS cannot (runtime).

---

With Streakzzz, users can efficiently manage their tasks and maintain streaks, promoting **productivity** and **consistency**.
