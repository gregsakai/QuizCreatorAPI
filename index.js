const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const CONNECTION_URI = process.env.MONGODB_URI;
const port = process.env.PORT || 10000;
const app = express();

app.use(bodyParser.json());

mongoose
  .connect(CONNECTION_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const questionSchema = mongoose.Schema({
  question: String,
  answers: [{ answer: String, correct: Boolean }]
});

const Question = mongoose.model("Question", questionSchema);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.get("/quiz", function(req, res) {
  Question.find({}).then(function(questions) {
    res.send(questions);
  });
});

app.post("/quiz", function(req, res) {
  Question.create(req.body).then(function(question) {
    res.send(question);
  });
});

app.delete("/quiz/:id", function(req, res) {
  Question.findByIdAndRemove({ _id: req.params.id }).then(function(question) {
    res.send(question);
  });
});

app.put("/quiz/:id", function(req, res) {
  Question.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function(
    question
  ) {
    res.send(question);
  });
});

app.listen(port, err => {
  if (err) {
    console.error(err);
    return false;
  }
  console.log("Listening to port", port);
});
