const Product = require("../Models/Product")


module.exports.addproduct = async (req, res, next) => {
    try {

        const { name, quantity, price, seller, imgurls, category } = req.body
        await Product.create({
            name, quantity, price,
            seller:req.session.admin._id, category, imgurls
        })
        res.status(200).send({
            msg: "Done",
        })
    } catch (err) {
        res.status(400).send({
            msg: "Failed Request"
        })
    }
}

module.exports.getProduct = async (req, res, next) => {
    try {

        let data = await Product.find().populate("seller", "name email")
        return res.status(200).send(data)
    } catch (err) {
        return res.status(400).send({
            msg: "Failed to Get All Products"
        })
    }
}

module.exports.searchproduct = async (req, res) => {
    try {
        let { name } = req.query;
        let data = await Product.find({
            name: { $regex: name, $options: 'i' }
        }).populate("seller", "name email")
        let data2=await Product.find({
            category:{$regex :name,options:"i"}
        }).populate("seller","name email")
        return res.status(200).send([...data,...data2])
    } catch (err) {
        return res.status(400).send({
            msg: "Failed to due to some eror"
        })
    }
}