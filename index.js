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
    id: 1, // hint: use the shortid npm package to generate it
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
  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    try {
      res.status(200).json(user);
    } catch {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    }
  }
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
    try {
      res.status(201).json({ data: users });
    } catch {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

//PUT /api/users/:id
server.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const edited = req.body;

  let userToEdit = users.find((u) => u.id === id);

  if (!edited.name || !edited.bio) {
    //respond with HTTP status code 400 (Bad Request).
    //return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
    //If there's an error when updating the user:
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
    //If the user with the specified id is not found:
  } else if (!userToEdit) {
    //respond with HTTP status code 404 (Not Found).
    //return the following JSON object: { message: "The user with the specified ID does not exist." }.
    //If the request body is missing the name or bio property:
    res
      .status(404)
      .json({ errorMessage: "The user with the specified ID does not exist." });
  } else if (userToEdit) {
    Object.assign(userToEdit, edited);
    //If the user is found and the new information is valid:
    //update the user document in the database using the new information sent in the request body.
    //respond with HTTP status code 200 (OK).
    //return the newly updated user document.
    res.status(200).json(userToEdit);
  } else {
    //respond with HTTP status code 500.
    //return the following JSON object: { errorMessage: "The user information could not be modified." }.
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified" });
  }
});

//DELETE /api/users/:id
server.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleted = users.find((u) => u.id === id);
  if (!deleted) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    users = users.filter((u) => u.id !== id);
    res.status(200).json({ data: users });
  }
});

const port = 5000;
server.listen(port, () => console.log("api running"));

// npm run server
