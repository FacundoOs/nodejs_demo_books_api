const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const { response } = require("express");

const app = express();

app
  // middleware for parsing json objects. Looks at requests where the Content-Type: application/json header is present and transforms the text-based JSON input into JS-accessible variables under req.body.
  .use(bodyParser.json())
  // middleware for parsing bodies from URL. Does the same for URL-encoded requests. the extended: true precises that the req.body object will contain values of any type instead of just strings.
  .use(bodyParser.urlencoded({ extended: true }))
  //CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
  .use(cors());

const index = (request, response) => {
  pool.query("SELECT * FROM books", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({ books: results.rows });
  });
};

const create = (request, response) => {
  const { author, title } = request.query;
  pool.query(
    "INSERT INTO books (author, title) VALUES ($1, $2)",
    [author, title],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(201).json({ message: "Book was added to the database!" });
    }
  );
};

app.route("/books").get(index).post(create);

app.listen(process.env.PORT || 3002, () => {
  console.log("The server is listening...");
});
