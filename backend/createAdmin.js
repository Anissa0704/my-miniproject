const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      // Check if admin already exists
      let admin = await User.findOne({ email: 'admin@mebook.com' });
      if (!admin) {
        const hash = await bcrypt.hash('123456', 10);
        admin = new User({
          username: 'AdminMaster',
          email: 'admin@mebook.com',
          password: hash,
          role: 'owner' // or 'admin'
        });
        await admin.save();
        console.log('✅ Admin account created successfully!');
      } else {
        console.log('⚠️ Admin account already exists!');
      }
      mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });
