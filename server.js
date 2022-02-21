const express = require("express");
const req = require("express/lib/request");
const mongoose = require("mongoose");
const app = express();

//routes
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/auth")


require("dotenv-flow").config();


//parse request of content type JSO
app.use(express.json());

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).catch(error => console.log("Error"))

mongoose.connection.once('open', () => console.log("connected to mongoDB"));

//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Welcome to the MEN RESTful API" })
})

//CRUD
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT)
});

module.exports = app;

