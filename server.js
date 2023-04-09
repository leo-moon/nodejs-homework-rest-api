const mongoose = require("mongoose");

const app = require("./app");
// mongodb  pass: VA52tSjsyfpjXciC    wBtV1l3p8hLHX7Us
// mongodb+srv://Volodymyr:VA52tSjsyfpjXciC@cluster0.djek4zk.mongodb.net

// const DB_HOST =
//   "mongodb+srv://Volodymyr:wBtV1l3p8hLHX7Us@cluster0.djek4zk.mongodb.net/contacts-reader?retryWrites=true&w=majority";

const { DB_HOST } = process.env;
console.log(DB_HOST);

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch(error => console.log(error.message));

  
//     , () => {
//     console.log("Server running. Use our API on port: 3000");
//   })
// )
