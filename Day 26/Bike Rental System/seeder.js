// seeds/createSuperAdmin.js

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const model = require('./models')(mongoose);

require("dotenv").config();

const createSuperAdmin = async () => {
    const { User } = model;
  await mongoose.connect(process.env.DB_URL);

  const email = "superadmin@gamil.com";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Super admin already exists!");
    return;
  }

  const hashedPassword = await bcrypt.hash("Sivakumar2004", 10);

  const newUser = await User.create({
    userName: "Super Admin",
    email: email,
    password: hashedPassword,
    role: "superadmin",
    isVerified: true,
  });

  mongoose.connection.close();
};

createSuperAdmin();
