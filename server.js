const mongoose = require("mongoose");

const app = require("./app");
// require("dotenv").config();

// mongodb  pass: VA52tSjsyfpjXciC    wBtV1l3p8hLHX7Us
// mongodb+srv://Volodymyr:VA52tSjsyfpjXciC@cluster0.djek4zk.mongodb.net

// const DB_HOST =
//   "mongodb+srv://Volodymyr:wBtV1l3p8hLHX7Us@cluster0.djek4zk.mongodb.net/contacts_reader?retryWrites=true&w=majority";

const { DB_HOST, PORT = 3000 } = process.env;
// const {  PORT = 3000 } = process.env;


mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log(`"Server running. Use our API on port: ${PORT}"`);
  })
  .catch(error => console.log(error.message));
 