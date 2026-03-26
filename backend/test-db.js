const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const Book = require('./models/Book');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const books = await Book.find();
    console.log("Found books:", books.length);
    books.forEach(b => console.log(`Title: ${b.title}, Img: ${b.img}`));
    mongoose.connection.close();
  })
  .catch(err => {
    console.log("DB ERROR", err);
    process.exit(1);
  });
