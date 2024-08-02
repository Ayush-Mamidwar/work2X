const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    fullName: {type:String},
    email: {type:String},
    password:{type:String},
    createdOn:{type:Date, default: new Date().getTime()}
})

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// Log the saved document
userSchema.post('save', function(doc, next) {
    console.log(doc)
    next()
})

// Instance method to check password
userSchema.methods.checkPass = async function(enteredPass, originalPass) {
    return await bcrypt.compare(enteredPass, originalPass)
}


module.exports = mongoose.model("User",userSchema)