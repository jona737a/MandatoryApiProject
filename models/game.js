const mongoose = require("mongoose");

const schema = mongoose.Schema;


//Mongoose schema for structuring data
let gameSchema = new schema({
    name: {type: String},
    description: {type: String},
    price: {type: Number},
    developer: {type: String},
    publisher: {type: String},
    category: {type: Array},
});

module.exports = mongoose.model("game", gameSchema);