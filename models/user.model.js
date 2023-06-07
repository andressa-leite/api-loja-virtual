var mongoose = require("mongoose");
var Schema = mongoose.Schema;
let bcrypt = require("bcrypt");

var UserSchema = new Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 20,
    unique: [true, "This login already exists!"],
  },
  roleType: {
    type: String,
    enum: ["ADMIN", "CLIENT"],
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return new RegExp(
          "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$"
        ).test(email);
      },
    },
    unique: [true, "This email already exists!"],
  },
  password: {
    type: String,
    select: false,
  },
  avatar: {
    type: String,
  }
});

UserSchema.methods.generatePassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.pre("save", async function () {
  this.password = await this.generatePassword(this.password);
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
