var mongoose = require('mongoose')
// var Schema = mongoose.Schema;
var UserSchema = mongoose.Schema({
    created_date: {
        type: Date,
        default: new Date()
    },
    user_name:String,
    contact_no:String,
    password:String
   
})
exports = mongoose.model('user_details', UserSchema)