const mongoos=require("mongoose")
const {Schema}=mongoos

const CoupanSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    off :{
        type:Number,
        required:true,
    },
    limit:{
        type:Number,
        required:true,
    },
    numbers:{
        type:Number,
        required:true,
    },
    seller: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Admin",
    },
    expire:{
        type:Date,
        required:true,
    }
})


module.exports=mongoos.model("Coupan",CoupanSchema)