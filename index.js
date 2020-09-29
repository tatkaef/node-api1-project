const express = require("express");
const { v4 } = require("uuid");

const server = express();

server.use(express.json()); // remember to invoke json()

server.get("/", (req, res) => {
  // always return the correct http status code based on the operation performed
  res.status(200).json({ hello: "Node 34" });
});

let users = [
  {
    id: "a_unique_id", // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane", // String, required
  },
];

// GET /api/users
server.get("/api/users", (req, res) => {
  res.status(200).json({ data: users });
  res
    .status(500)
    .json({ errorMessage: "The users information could not be retrieved." });
});

// GET /api/users/:id
server.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id); //???
  const user = users.find((user) => user.id === id);
  res.status(200).json(user);
  res
    .status(404)
    .json({ message: "The user with the specified ID does not exist." });
  res
    .status(500)
    .json({ errorMessage: "The user information could not be retrieved." });
});

//POST /api/users
server.post("/api/users", function (req, res) {
  const data = req.body;

  users.push({ id: v4(), ...data });
  if (data.name === "" || data.bio === "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    res.status(201).json({ data: users });
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

const port = 5000;
server.listen(port, () => console.log("api running"));

// npm run server
