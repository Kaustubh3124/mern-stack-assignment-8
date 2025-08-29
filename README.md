MERN Stack To-Do List Application
This project is a full-stack To-Do List application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to manage their tasks by providing a RESTful API and a responsive frontend interface.
Project Objective
The primary objective of this project is to demonstrate the practical implementation of a MERN stack application. This involves:
Building a robust backend API using Node.js, Express.js, and MongoDB.
Creating a dynamic and interactive frontend with React to consume the APIs.
Ensuring seamless communication between the client and server.
Handling common functionalities like CRUD operations, searching, and filtering.
Technologies Used
Frontend: React.js, Axios (for HTTP requests), CSS
Backend: Node.js, Express.js
Database: MongoDB (using Mongoose for object modeling)
Other packages: dotenv for environment variables, colors for colorful console output, cors for cross-origin resource sharing.
Implemented Features
API Endpoints: The backend exposes several API endpoints for managing tasks.
GET /api/tasks: Retrieves all tasks, with support for filtering by status (completed, pending) and searching by title or description.
POST /api/tasks: Creates a new task.
GET /api/tasks/:id: Fetches a single task by its ID.
PATCH /api/tasks/:id: Updates an existing task (partial update).
PATCH /api/tasks/:id/status: Updates a task's completion status.
DELETE /api/tasks/:id: Deletes a task by ID.
React Frontend: The UI is built with React, with state management handled by useState and useEffect. It dynamically renders tasks and provides user controls for adding new tasks, updating existing ones, deleting them, and toggling their completion status.
Project Structure
.
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── taskController.js
│   ├── models
│   │   └── Task.js
│   ├── routes
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend
    ├── public
    └── src
        ├── components
        │   ├── TaskForm.js
        │   ├── TaskItem.js
        │   └── TaskList.js
        ├── App.css
        ├── App.js
        └── index.js

Setup and Running the Application
Prerequisites:
Node.js installed
MongoDB installed and running
Step 1: Clone the repository
git clone [your_repo_url]
Step 2: Backend Setup
Navigate to the backend directory.
Install dependencies: npm install
Create a .env file in the backend directory and add your MongoDB connection string and a port number: MONGO_URI=your_mongodb_connection_string PORT=5000
Start the backend server: npm start
The server will run on the specified port (e.g., http://localhost:5000).
Step 3: Frontend Setup
Open a new terminal and navigate to the frontend directory.
Install dependencies: npm install
Start the React development server: npm start
The frontend application will open in your browser, and you can begin using the To-Do list.
Challenges and Solutions
One common challenge in MERN stack development is ensuring the frontend can communicate with the backend in a development environment due to different port numbers. This was addressed by using the cors middleware in server.js to allow cross-origin requests. Additionally, configuring the API_BASE_URL in App.js to dynamically switch between development and production URLs is crucial for a smooth deployment process.
