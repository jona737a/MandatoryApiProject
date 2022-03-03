const router = require("express").Router();
const product = require("../models/products")
const { verifyToken } = require("../validation")

module.exports = router;


//Create 

router.post("/", verifyToken, (req, res) => {
    data = req.body;

    product.insertMany(data)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }) })
});

//Read all

router.get("/", (req, res) => {
    product.find()
        .then(data => {

            res.send(mapArr(data));
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
})

//Read in stock

router.get("/instock/:status", (req, res) => {
    product.find({ inStock: req.params.status })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }) })
})

//Read price

router.get("/price/:operator/:price", (req, res) => {
    const operator = req.params.operator;
    const findPrice = req.params.price;
    let filter = {}
    if (operator == "gt") {
        filter = { $gte: findPrice }
    } else if (operator == "lt") {
        filter = { $lte: findPrice }
    }
    product.find({ price: filter })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }) })



})

//Read from id

router.get("/:id", (req, res) => {
    product.findById(req.params.id)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }) })
})

//Update from id

router.put("/:id", (req, res) => {
    const id = req.params.id;


    product.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404)._construct({ message: "Cannot update product with id:" + id })
            } else {
                res.send({ message: "Product with id:" + id + "has been updated" })
            }
            res.send(data);
        })
        .catch(err => { res.status(500).send({ message: err.message }) })
})

//Delete from id

router.delete("/:id", (req, res) => {
    const id = req.params.id;


    product.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404)._construct({ message: "Cannot update product with id:" + id })
            } else {
                res.send({ message: "Product with id:" + id + "has been deleted" })
            }
            res.send(data);
        })
        .catch(err => { res.status(500).send({ message: err.message }) })
})

function mapArr(obj) {
    let outputArr = obj.map(element => {
        return {
            id: element._id,
            name: element.name,
            description: element.description,
            uri: `http://localhost:4000/api/products/${element._id}`
        }
    })
    return outputArr;
}