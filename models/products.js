const mongoose = require("mongoose");

const schema = mongoose.Schema;


//Mongoose schema for structuring data
let productSchema = new schema({
    name: {type: String},
    description: {type: String},
    price: {type: Number},
    inStock: {type: Boolean},
});

module.exports = mongoose.model("product", productSchema);