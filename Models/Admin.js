const mongoose=require("mongoose")
const {Schema}=mongoose


const AdminSchema=new Schema({
    name :{
        type :String,
        required:true,
    },
    email :{
        type :String,
        required:true,
    },
    password :{
        type:String,
        required:true,
    },
    products :[
        {
           id :{
                type :Schema.Types.ObjectId,
                ref :"Product",

           }
        }
    ],
    otpd:{
        otp :String,
        expired:Date,
    },
    profileimg:String,
    verified:{
        type:Boolean,
        default:false,
    },
    totalincome :{
        type:Number,
        default:0,
    },
    orders :[
        {
            pr: {
                type:Schema.Types.ObjectId,
                ref :"Product",
            },
            sr:{
                type:Schema.Types.ObjectId,
                ref :"User",
            },
            quantity:{
                type:Number,
                default:0,
            },
        },
    ],
})

module.exports=mongoose.model("Admin",AdminSchema)