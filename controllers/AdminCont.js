const nodemailer = require("nodemailer")
const Admin = require("../Models/Admin")
const sendotp=require("../middleware/SendOtp")
const bcrypt=require("bcrypt")
const saltrounds=10
const Coupan=require("../Models/Coupans")


module.exports.adduser = async (req, res, next) => {
   try {
      const { name, email, password } = req.body;
      console.log(req.body)
      const data = await Admin.findOne({email});
      if (data) {
         // console.log(data)
         return res.send({
            msg:"Admin Already Exist",
            val :data,
         })
      }
          await  bcrypt.hash(password,saltrounds,async(err,hash)=>{
         let newuser = await Admin.create({
            name, email, password:hash,
         })
         
         await sendotp.sendotp(email,true);
         res.send({
            email,
         })
      })
   } catch (err) {
      console.log(err)
      return res.status(400).json({ msg: "Failed" ,err})
   }
}


// Sending Re-Verification Link
module.exports.sendverificationotp = async (req, res) => {
   try {
      let { email } = req.body;
      await sendotp.sendotp(email, true)
      res.status(200).send({
         msg: "Otp Sent Succefyllyt"
      })

   } catch (err) {
      res.status(400).send({
         msg: "Eror in Verfication of the otp ",
      })
   }
}

module.exports.verifyuser = async (req, res) => {
   try {
      const { email, otp } = req.body;
      const user =  await Admin.findOne({email})
      if (Date.now() > user.otpd.expired) {
         return res.status(302).json({
            msg: "Time gone"
         })
      } else if (user.otpd.otp != otp) {
         return res.status(302).json({
            msg: "Wrong Otp"
         })
      } else {
         user.verified = true,
            user.otpd = {
               otp: "",
               Date: Date.now()
            }
         user.save()
         return res.status(200).json({
            msg: "Verified",
         })
      }
   } catch (err) {
      console.log(err)
      res.status(400).json({
         msg :"Code Ended With Erors",
         err
      })
   }
}

module.exports.login=async(req,res)=>{
   try{
      let {email,password}=req.body
      console.log(email,password)
      let user= await Admin.findOne({email})
      
      if(!user){
         return res.status(302).json({
            msg :"Admin Does't Exist",
         })
      }
      console.log(user)
      if(!user.verified){
        return res.status(302).json({
            msg :"Not Verified"
        })
      }
      bcrypt.compare(password,user.password,(err,succ)=>{
         if(succ){
            req.session.admin=user;
            return res.status(200).json({
               msg :"Verfied",
            })
         }else{
            return res.status(302).json({
               msg :"Wrong Password",
            })
         }
      })
   }catch(err){
      return res.status(400).json({
         msg :err.message,
      })
   }
}





// Coupan Creation 
module.exports.createcoupan=async(req,res)=>{
   try{
      let {name,off,limit,numbers,expire}=req.body
      let some=await Coupan.findOne({name})
      console.log(req.session.admin)
      if(some){
         return res.status(302).send({
            msg :"Coupan Name Already Exist"
         })
      }
      let coupan=await Coupan.create({
         name,off,limit,numbers,
         expire:Date.now()+expire * 60 * 60 * 1000,
         seller :req.session.admin._id,
      })
      return res.status(200).send({
         coupan :name,
         msg :"Succefully Created the Coupan"
      })
   }catch(err){
      console.log(err)
      res.status(300).send({
         msg :"Coupan Creation Failed"
      })
   }
   
}