const express = require("express");
const app = express();
const fs = require("fs");

// Middleware to parse JSON body
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


const users = [
  {
    id: 1,
    name: "Alice",
    age: 30,
  },
  {
    id: 2,
    name: "Bob",
    age: 25,
  },

  {
    id: 3,
    name: "David",
    age: 35,
  },
  {
    id: 4,
    name: "Charlie",
    age: 35,
  },


];

app.get("/about/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.query;

  if (!id) return res.status(400).send("Path parameter 'id' is missing!");
  if (!name) return res.status(400).send("Query parameter 'name' is missing!");
  let user = users;
  if (id) {
    user = users.filter(u => u.id == id)
  }
  if (name) {
    user = users.filter(u => u.name.toLowerCase() == name.toLowerCase())
  }

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
});
app.get("/users", (req, res) => {
  const { id, name, age } = req.query;

  let filtered = users;

  // Filter by id
  if (id) {
    filtered = filtered.filter(u => u.id === Number(id));
  }

  // Filter by name
  if (name) {
    filtered = filtered.filter(
      u => u.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by age
  if (age) {
    filtered = filtered.filter(u => u.age === Number(age));
  }

  if (filtered.length === 0) {
    return res.status(404).send("No users match your filters");
  }

  console.log(res);

  res.json({
    count: filtered.length,
    data: filtered
  });
});

app.get('/properties', (req, res) => {
  fs.readFile('./real_estate_data.json', 'utf8', (err, fileData) => {
    if (err) {
      console.error('Error reading properties file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let properties;
    try {
      properties = JSON.parse(fileData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return res.status(500).send('Internal Server Error');
    }

    const query = req.query; // Your query params
    let filteredProperties = properties;

    for (const key in query) {
      filteredProperties = filteredProperties.filter(fp => {
        const propertyValue = fp[key];
        const queryValue = query[key];

        console.log(`Filtering key: ${key}`);
        console.log(`Property value: ${propertyValue}`);
        console.log(`Query value: ${queryValue}`);
        console.log('---');

        // Skip undefined values
        if (propertyValue === undefined || queryValue === undefined) return false;

        // Convert both to string, then lowercase for comparison
        return propertyValue.toString().toLowerCase() === queryValue.toString().toLowerCase();
      });
    }

    return res.json({
      count: filteredProperties.length,
      data: filteredProperties
    });
  });
});



app.post('/properties', (req, res) => {
  fs.readFile('./real_estate_data.json', 'utf8', (err, fileData) => {
    if (err) {
      console.error('Error reading properties file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let properties;
    try {
      properties = JSON.parse(fileData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return res.status(500).send('Internal Server Error');
    }

    const body = req.body;
    let filteredProperties = properties;

    for (const key in body) {
      filteredProperties = filteredProperties.filter(fp => {
        const propertyValue = fp[key];
        const queryValue = body[key];

        // Skip undefined values
        if (propertyValue === undefined || queryValue === undefined) return false;

        // Convert both to string, then lowercase for comparison
        return propertyValue.toString().toLowerCase() === queryValue.toString().toLowerCase();
      });
    }

    return res.json({
      count: filteredProperties.length,
    filteredProperties
    });
  });
});





// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
