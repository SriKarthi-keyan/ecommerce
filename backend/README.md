# EcoDelivery Backend API

Initial backend API setup using Node.js, Express, and ES Modules.

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm (Node Package Manager)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional, defaults are set in `.env`):
   - Edit the `.env` file to customize parameters like `PORT`.

### Running the Server
- **Development Mode** (auto-reload enabled via `nodemon`):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## Folder Structure

```text
├── .env                  # Environment configurations
├── .gitignore            # Files ignored by Git
├── package.json          # Dependency definition
├── README.md             # Project documentation
├── index.js              # Server starter entry point
└── src/
    ├── app.js            # Express app configuration & middleware
    ├── controllers/      # Handles client request logic
    │   └── statusController.js
    ├── middleware/       # Custom middlewares (e.g. error mapping)
    │   └── errorHandler.js
    └── routes/           # Routing middleware
        └── api.js
```

---

## API Endpoints

### 1. Server Status
- **URL**: `/api/status`
- **Method**: `GET`
- **Description**: Returns health metrics of the server.
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "success",
      "data": {
        "message": "Server is running smoothly",
        "uptime": 12.34,
        "timestamp": "2026-06-05T08:42:00.000Z",
        "environment": "development"
      }
    }
    ```
