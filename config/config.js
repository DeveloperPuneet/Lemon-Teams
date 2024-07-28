require("dotenv").config();

let key = process.env.KEY;
let email = process.env.EMAIL;
let api = process.env.API_KEY;
let password = process.env.PASSWORD;
let port = process.env.PORT;
let database = process.env.DB;

module.exports = {
    key,
    email,
    api,
    password,
    port,
    database
}