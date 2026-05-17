import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    // avatar: {
    //   type: {
    //     url: String,
    //     localPath: String,
    //   },
    //   default: {
    //     url: "https://placehold.co/200x200",
    //     localPath: "",
    //   },
    // },

    avatar: {
    type: String,
    required: false  
           },
    coverImage: {
    type: String,
    required: false  
           },
         
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);


//attaching prehook to Schema
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return; //debug return next()

  this.password = await bcrypt.hash(this.password, 10); //10 round hashing
  //next()
});


//attaching methods to Schema
userSchema.methods.isPasswordCorrect = async function name(password) {
  return await bcrypt.compare(password, this.password);    //this.password => Database password
};

userSchema.methods.generateAccessToken = function () {    //token with data
  return jwt.sign(       // also known as signed token
    {
      _id: this._id,      //payload
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(     
    {
      _id: this._id,      
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex"); // without data token

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; //added 20min
  return { unHashedToken, hashedToken, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);
