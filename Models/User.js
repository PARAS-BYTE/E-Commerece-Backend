const mongoose = require("mongoose")
const { Schema } = mongoose


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    addresses: [
        {
            mobileNumber:Number,
            district :String,
            pincode :Number,
            state :String,
            country:String,
            location:String,
        }
    ],
    profileimg: String,
    verified: {
        type: Boolean,
        default: false,
    },
    otpd: {
        otp: String,
        expired: Date,
    },
    cart: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity:Number,
        }
    ],
    totalprice:{
        type:Number,
        default :0,
    },
    orders: [
        {
            data: [
                {
                    id :{type:Schema.Types.ObjectId,ref:"Product"},
                    quantity:Number,
                }
            ],
            price :Number,
            discount:Number,
            address:{}
        }
    ]
})

module.exports = mongoose.model("User", UserSchema)