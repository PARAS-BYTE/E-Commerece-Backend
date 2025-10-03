const Router=require("express").Router()
const AdminRoute=require("../controllers/AdminCont")


Router.post("/add",AdminRoute.adduser)
Router.post("/verfiyotp",AdminRoute.verifyuser)
Router.post("/login",AdminRoute.login)
Router.post("/createcoupan",AdminRoute.createcoupan)
Router.post("/sendverificationotp",AdminRoute.sendverificationotp)


module.exports=Router