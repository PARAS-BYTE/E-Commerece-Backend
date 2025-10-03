const Router=require("express").Router()
const UserCont=require("../controllers/UserCont")


Router.post("/add",UserCont.adduser)
Router.post("/verfiyotp",UserCont.verifyuser)
Router.post("/login",UserCont.login)
Router.post("/addtocart",UserCont.addtocart)
Router.post("/sendcode",UserCont.sendverificationotp)
Router.post("/decrease",UserCont.decreasequantity);
Router.post("/increase",UserCont.increasequantity)
Router.get("/getcart",UserCont.getcart)
Router.get("/buycart",UserCont.buycart)
Router.post("/removefromcart",UserCont.removecart)
Router.post("/addadress",UserCont.addadress)
Router.post("/updateaddress",UserCont.updateAdress)
Router.post("/updateProfile",UserCont.profileupdate)


module.exports=Router