import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "username is already used"],
      minLength: [4, "username cannot be smaller that 4"],
      maxLength: [12, "username cannot be more than 12 character"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "account with these email is already created"],
      minLength: [3, "email should be more than 3 character"],
      maxLength: [25, "email should not be more than 25 character"],
      validate: {
        validator(v) {
          if (!validator.isEmail(v)) {
            throw new Error("email should be valid");
          }
        },
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password is small"],
      maxLength: [200, "Passord is too Large"],
    },
  },
  {
    timestamps: true,
  },
);

//methods
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.isPasswordValid = async function (userEnterPassword) {
  const isPasswordValid = await bcrypt.compare(
    userEnterPassword,
    this.password,
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

export default User;
