import mongoose from "mongoose"
import crypto from "crypto";
import Uuid from "uuid";
const uuidv4 = Uuid.v4();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  encry_password: {
    type: String,
    required: true
  },
  salt: String,
}, {timestamps: true})

userSchema.virtual("password")
  .set(function(password) {
    this._password = password
    this.salt = uuidv4()
    this.encry_password = this.securePassword(password)
  })
  .get(function() {
    return this._password
  })

userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function(plainpassword) {
    if(!plainpassword) return "";

    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
    } catch (err) {
      return ""
    }
  }
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel