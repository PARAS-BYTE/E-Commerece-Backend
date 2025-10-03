const nodemailer = require("nodemailer")
const User = require("../Models/User")
const sendotp = require("../middleware/SendOtp")
const bcrypt = require("bcrypt")
const Product = require("../Models/Product")
// const { useImperativeHandle } = require("react")
const saltrounds = 10
const Coupan = require("../Models/Coupans")
const { createorder } = require("../middleware/AddOrder")


module.exports.adduser = async (req, res, next) => {
   try {
      const { name, email, password } = req.body;
      const data = await User.findOne({ email });
      if (data) {
         // console.log(data)
         return res.send({
            msg: "User Already Exist",
            val: data,
         })
      }
      await bcrypt.hash(password, saltrounds, async (err, hash) => {
         let newuser = await User.create({
            name, email, password: hash,
         })

         await sendotp.sendotp(email, false);
         res.send({
            email,
         })
      })
   } catch (err) {
      console.log(err)
      return res.status(400).json({ msg: "Failed", err })
   }
}

module.exports.verifyuser = async (req, res) => {
   try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email })
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
         msg: "Code Ended With Erors",
         err
      })
   }
}
module.exports.sendverificationotp = async (req, res) => {
   try {
      let { email } = req.body;
      await sendotp.sendotp(email, false)
      res.status(200).send({
         msg: "Otp Sent Succefyllyt"
      })

   } catch (err) {
      res.status(400).send({
         msg: "Eror in Verfication of the otp ",
      })
   }
}

module.exports.login = async (req, res) => {
   try {
      let { email, password } = req.body
      let user = await User.findOne({ email })
      if (!user) {
         return res.status(302).json({
            msg: "User Does't Exist",
         })
      }
      if (!user.verified) {
         return res.status(302).json({
            msg: "Not Verified"
         })
      }
      bcrypt.compare(password, user.password, (err, succ) => {
         if (succ) {
            req.session.user = user
            return res.status(200).json({
               msg: "Verfied",
            })
         } else {
            return res.status(302).json({
               msg: "Wrong Password",
            })
         }
      })
   } catch (err) {
      return res.status(400).json({
         msg: err.message,
      })
   }
}


// Deleting Data from Database cart 
async function removefromcart(req, res) {
   try {
      let { id } = req.body;
      let product = await Product.findById(id);

      let email = req.session.user.email
      let user = await User.findOne({ email });
      let nu = 0;
      let newdata = user.cart.filter((d) => {
         if (d.id != id) return true
         else {
            nu = d.quantity
            return false;
         }
      })
      user.cart = newdata
      user.totalprice -= (nu * product.price)
      await user.save()
      return res.status(200).send({
         msg: "Done Succefully",
         data: user,
      })


   } catch (err) {
      console.log(err)
      res.status(400).send({
         msg: "Code Ended due to some erors",
      })
   }
}


module.exports.addtocart = async (req, res) => {

   try {
      let { id } = req.body;
      let product = await Product.findById(id);
      if (product.quantity <= 0) {
         res.status(302).send({
            msg: "Out of Stock"
         })
      } else {

         let email = req.session.user.email
         let user = await User.findOne({ email });
         user.cart.push({
            id,
            quantity: 1,
         })

         user.totalprice += product.price
         await user.save()
         return res.status(200).send({
            msg: "Done Succefully",
            data: user,
         })
      }

   } catch (err) {
      console.log(err)
      res.status(400).send({
         msg: "Code Ended due to some erors",
      })
   }
}

module.exports.decreasequantity = async (req, res) => {
   // await removefromcart(req, res)
   try {
      let { id } = req.body;
      let product = await Product.findById(id);

      let email = req.session.user.email
      let user = await User.findOne({ email });
      // let newdata = user.cart.map(d => d.id != id ? d : { ...d, quantity: d.quantity + 1 })
      let item = user.cart.find(d => d.id.toString() === id);
      if (item.quantity <= 1) {
         user.cart = user.cart.filter(d => d.id != id)
      } else {
         user.cart = user.cart.map(d => d.id != id ? id : { ...d, quantity: d.quantity - 1 })
      }
      user.totalprice -= product.price
      await user.save()
      return res.status(200).send({
         msg: "Done Succefully",
         data: user,
      })


   } catch (err) {
      console.log(err)
      res.status(400).send({
         msg: "Code Ended due to some erors",
      })
   }
}

module.exports.increasequantity = async (req, res) => {
   try {
      let { id } = req.body;
      let product = await Product.findById(id);

      let email = req.session.user.email
      let user = await User.findOne({ email });
      let newdata = user.cart.map(d => d.id != id ? d : { ...d, quantity: d.quantity + 1 })
      user.totalprice += product.price
      user.cart = newdata
      await user.save()
      return res.status(200).send({
         msg: "Done Succefully",
         data: user,
      })


   } catch (err) {
      console.log(err)
      res.status(400).send({
         msg: "Code Ended due to some erors",
      })
   }
}


// Geting Whole Cart
module.exports.getcart = async (req, res) => {
   try {
      let id = req.session.user._id
      let user = await User.findById(id).populate("cart.id", "name price imgurls category")
      res.status(200).json({
         data: user.cart,
         total: user.totalprice
      })
   } catch (err) {
      console.log(err)
      res.status(400).send({
         msg: "Eror at Getting Cart ",
         err: err.message,
      })
   }
}

// Buy Cart

module.exports.buycart = async (req, res) => {
   try {
      let id = req.session.user._id
      // console.log('id ',id)
      let user = await User.findById(id).populate("cart.id", "name price imgurls seller")
      let data = user.cart
      let { name,address } = req.query
      let addd=user.addresses.find(d=>d._id.toString()==address)
      console.log(addd)
      let coup = await Coupan.findOne({ name })
      let discount = 0;
      if (coup && Date.now() < coup.expire && coup.numbers > 0 && user.totalprice >= coup.limit) {
         discount = coup.off;
         coup.numbers -= 1;
         coup.save()
      }
      data.forEach(async (el) => {
         let prod = await Product.findById(el.id._id)
         prod.quantity -= el.quantity
      })
      user.orders.push({
         price: user.totalprice,
         discount,
         pricetopay: user.totalprice - discount,
         data: user.cart,
         address:addd,

      })
      await createorder(user.cart, req.session.user._id,addd);
      user.cart = [];
      user.totalprice = 0
      await user.save()
      res.status(200).json({
         totalprice: 0,
         discount,
         pricetopay: 0,
      })
   } catch (err) {
      console.log(err)
      return res.status(300).send({
         msg: "There is Eror in Gettin Placing Order",
      })
   }
}



// Removing a Particular Product from cart
module.exports.removecart = async (req, res) => {
   await removefromcart(req, res)
}

// Adding Address via post requrest 
module.exports.addadress = async (req, res) => {
   let id = req.session.user._id
   try {
      let { mobileNumber, district, country, pincode, state, location } = req.body
      let user = await User.findById(id)
      if (!user) {
         return res.status(302).send({ msg: "Failed to fetch User Login Your Self Again to go futer" })
      }

      await user.addresses.push({
         mobileNumber,
         district,
         state,
         pincode,
         country,
         location,
      })
      await user.save()
      return res.status(200).send({
         msg: "Done Succefully",
         data: user.addresses,
      })
   } catch (err) {
      return res.status(400).send({
         msg: "Eror Occured at Adding Address Page",
         err: err.message,
      })
   }
}


module.exports.updateAdress = async (req, res) => {
   let { id, mobileNumber, district, pincode, state, country, location } = req.body
   let userid = req.session.user._id
   try {
      let some = await User.updateOne({
         _id: userid,
         "addresses._id": id,
      },
         {
            $set: {
               "addresses.$.mobileNumber": mobileNumber,
               "addresses.$.district": district,
               "addresses.$.pincode": pincode,
               "addresses.$.state": state,
               "addresses.$.country": country,
               "addresses.$.location": location,
            }
         }
      )
      return res.status(200).send({
         msg: some
      })
   } catch (err) {
      return res.status(400).send({
         msg: "ERro r",
         err: err.message,
      })
   }
}


// Update Profile

module.exports.profileupdate = async (req, res) => {
   try {
      let { name, profileimg } = req.body;
      let id = req.session.user._id;
      let some = await User.updateOne(
         {
            _id:id,
         },
         {
            $set:{
               name,
               profileimg,
            }
         }
      )
      return res.status(200).send({
         msg: "Profile Updated Successfully"
      })

   } catch (err) {
      return res.status(400).send({
         msg: "Err in Updating Profile",
         err: err.message,
      })
   }
}