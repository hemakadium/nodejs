const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema=mongoose.Schema({
 
firstName: {
    type: String,
    required: true,
    trim: true
},
lastName: {
    type: String,
    required: true,
    trim: true
},
email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    lowercase: true,
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
    select: false
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

module.exports=mongoose.model('user',productSchema);