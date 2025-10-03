const Admin=require("../Models/Admin")
const Product=require("../Models/Product")
const User=require("../Models/User")
const nodemailer=require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:
    {
        user: "raghavji014@gmail.com",
        pass: "esvz nlcv slax cysv",
    }
})

// [
//   {
//     id: {
//       _id: new ObjectId('68de3c24b38373e2763d9805'), : Product Id 
//       name: 'I phone 16 pro max',                    
//       price: 2200,                                      
//       seller: new ObjectId('68de352cb10e09b3566e4ca6'), : Seller Id
//       imgurls: 'https://unsplash.com/photos/a-cell-phone-with-a-colorful-background-R8Pgjgqw8aw'
//     },
//     quantity: 1,
//     _id: new ObjectId('68dec2053f0dd13a36689c67')
//   }
// ]

async function sendmail(productid,selllerid,userid,quantity,address){
    let seller=await Admin.findById(selllerid)
    let userdetails=await User.findById(userid)
    let productdetails=await Product.findById(productid)
    let soe=JSON.stringify(address)
    transporter.sendMail({
        to:seller.email,
        from :"raghavji014@gmail.com",
        subject :"Order Recieved ",
        text :  `Hey Buddy Seller ${seller.name} You got an Order of your product
            ${productdetails.name} and having the specs ${productdetails.description}
            this and you got an order of the ${quantity} Number of Pieces to the address
            ${soe} Please Reach out on Your Seller Portal to Complete the Process of sending Order 
            Further
        `
    })
}


async function createorder(cart,userid,address){
    
    for(const element of cart){
            let sellr= await Admin.findById(element.id.seller);
            sellr.orders.push({
                pr:element.id._id,
                sr:userid,
                quantity:element.quantity,    
            })
            sendmail(element.id._id,element.id.seller,userid,element.quantity,address);
           let income=(element.id.price*element.quantity)*0.93
            sellr.totalincome+=income
            await sellr.save()
    }
    console.log("Order's Added to Admin's succefully")
}
module.exports.createorder=createorder