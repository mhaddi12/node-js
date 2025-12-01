import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filePath = "./MOCK_DATA.json"; // File path

// Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(data);
    res.json({ users });
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get a user by ID
// app.get("/api/users/:id", async (req, res) => {
//   try {
//     const data = await fs.readFile(filePath, "utf-8");
//     const users = JSON.parse(data);
//     const id = Number(req.params.id);
//     const user = users.find((u) => u.id === id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ user });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Route to add a new user
app.post("/api/users", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(data);

    const newUser = { ...req.body, id: users.length + 1 };
    users.push(newUser);

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const users = JSON.parse(data);
      const id = Number(req.params.id);
      const user = users.find((u) => u.id === id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const users = JSON.parse(data);
      const id = Number(req.params.id);
      const userIndex = users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }
      users.splice(userIndex, 1);
      await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .patch(async (req, res) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const users = JSON.parse(data);
      const id = Number(req.params.id);
      const userIndex = users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }
      const newUpdate = { ...users[userIndex], ...req.body };
      users[userIndex] = newUpdate;

      await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
      return res.json({
        message: "User updated successfully",
        user: newUpdate,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
