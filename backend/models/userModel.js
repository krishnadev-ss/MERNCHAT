const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {type:String, required:true},
        email: {type:String, required:true, unique:true},
        password: {type:String, required:true},
        pic: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function(next) {  //before saving hash the value
    if(!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10); //used to generate random hash value
    this.password = await bcrypt.hash(this.password, salt); //hashing the password
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;