const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Book = require('./models/Book');

const demonImg = '/assets/demon.jpg';
const dragonballImg = '/assets/dragonball.jpg';
const narutoImg = '/assets/naruto.jpg';
const onepieceImg = '/assets/onepiece.jpg';
const jujutsuImg = '/assets/jujutsu.jpg';
const titanImg = '/assets/titan.jpg';

const mockBooks = [
  { title: 'Demon Slayer', price: 150, image: demonImg },
  { title: 'Dragon Ball', price: 120, image: dragonballImg },
  { title: 'Naruto', price: 130, image: narutoImg },
  { title: 'One Piece', price: 140, image: onepieceImg },
  { title: 'Jujutsu Kaisen', price: 160, image: jujutsuImg },
  { title: 'Attack on Titan', price: 180, image: titanImg },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, clearing and re-seeding books...");
    await Book.deleteMany({});
    await Book.insertMany(mockBooks);
    console.log("Mock books successfully seeded!");

    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
