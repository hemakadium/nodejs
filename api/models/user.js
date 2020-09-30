const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema=mongoose.Schema({
 
// firstName: {
//     type: String,
//     required: true,
//     trim: true
// },
// lastName: {
//     type: String,
//     required: true,
//     trim: true
// },
email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    trim: true
},
// mobile: {
//     type: String,
//     required: true,
//     unique: true
// },
password: {
    type: String,
    required: true,
   //    select: false
},
auditFields: {
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}
});

module.exports=mongoose.model('user',userSchema);