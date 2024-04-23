const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String
},{
    collection:"registerkarthik"
}
)
const Image = new mongoose.Schema(
    {
        name: String,
        url: String,
        size: String
       
},{
    collection:"cloudinary"
}
)




const UserModel = mongoose.model('registerkarthik',UserSchema)
const Userimage = mongoose.model('cloudinary',Image)

module.exports = {UserModel,Userimage}