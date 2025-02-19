# Node.js CRUD API

This is a simple Node.js CRUD API hosted on Render.

## Base URL

```
https://node-js-ald0.onrender.com/api
```

## Endpoints

### 1. User Registration

**Endpoint:**

```
POST /register
```

**Description:** Registers a new user.
**Example Request:**

```json
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

### 2. User Login

**Endpoint:**

```
POST /login
```

**Localhost:**

```
http://localhost:5000/api/login
```

**Description:** Authenticates a user and returns a token.
**Example Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### 3. Get All Curds

**Endpoint:**

```
GET /getCurds
```

**Description:** Retrieves a list of all curds.

### 4. Create Curd

**Endpoint:**

```
POST /createCurd
```

**Description:** Creates a new curd entry.
**Example Request:**

```json
{
  "title": "Curd Name",
  "description": "Curd Description"
}
```

### 5. Delete Curd

**Endpoint:**

```
DELETE /deleteCurd/:id
```

**Example:**

```
DELETE /deleteCurd/67a4710763c55bc57745b4d1
```

**Description:** Deletes a curd entry by ID.

### 6. Update Curd

**Endpoint:**

```
PUT /updateCurd/:id
```

**Example:**

```
PUT /updateCurd/67a490f4243ec281827c3a2f
```

**Description:** Updates a curd entry by ID.
**Example Request:**

```json
{
  "title": "Updated Curd Name",
  "description": "Updated Curd Description"
}
```

## Installation & Running Locally

1. Clone the repository:
   ```sh
   git clone <your-repository-url>
   ```
2. Navigate into the project directory:
   ```sh
   cd project-directory
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Dependencies

- Node.js
- Express.js
- MongoDB

## License

This project is licensed under the MIT License.
