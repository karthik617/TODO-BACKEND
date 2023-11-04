const express = require("express");
const mongoose = require("mongoose");

const User = require("./users");
const Todo = require("./todo");
const { auth } = require("./middleware");

const app = express();
const port = 3000;

var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for MongoDB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.json({
    msg: "Hello World!",
  });
});

// SIGN UP
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Username or email already exists" });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser && password === checkUser.password) {
      const token = jwt.sign(
        {
          id: checkUser._id,
        },
        JWT_SECRET
      );

      return res.status(201).json({ token, msg: "Login successfully" });
    }
    res.status(400).json({ message: "Email or Password is incorrect" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CREATE TODO
app.post("/createtodo", auth, async (req, res) => {
  try {
    const { title, userId, values } = req.body;
    const newTodo = new Todo({ title, userId, values });
    await newTodo.save();
    return res.status(201).json({ msg: "Todo created successfully" });
  } catch (error) {
    console.error("Create Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET TODO
app.get("/todo", auth, async (req, res) => {
  try {
    const userId = req.query.userId;
    const allTodo = await Todo.find({ userId }, { _id: 0, __v: 0 });

    return res.status(201).json({ msg: "successfully", data: allTodo });
  } catch (error) {
    console.error("Create Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
