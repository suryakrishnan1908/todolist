var express = require('express');
var mdb = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
const user = require("./models/User.js")

var allowedOrigins = ["http://localhost:3000"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
    })
);
app.use(bodyParser.json());

// mdb.connect("mongodb+srv://btwiamsankar:sansankarg2004@travel.olwg8cv.mongodb.net/userDatabase");
// mdb.connect("mongodb://localhost:27016/");
mdb.connect("mongodb://localhost:27017/userdata");

var db = mdb.connection;
db.once("open", () => {
    console.log("MongoDB connection successful");
});

app.get("/", (req, res) => {
    res.send("Welcome to backend Server");
});

app.post("/signup", async (request, response) => {
    try {
        console.log("Data is receiving from front end:", request.body);
        var { username, email, password } = request.body;
        var newUser = new user({
            username : username,
            email : email,
            password : password
        });
        await newUser.save();
        let responseMessage = "Signup success";
        console.log(responseMessage);
        return response.send(responseMessage);
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "An error occurred" });
    }
});

app.post("/login", async (request, response) => {
    try {
        console.log("Data is receiving from front end:", request.body);
        var { username, password } = request.body;
        console.log(username);
        console.log(password);
        let luser = await user.findOne({username : username});
        let responseMessage
        if(luser){
            console.log(luser.password);
            console.log(password);
            if(luser.password === password){
                responseMessage = "Login success";
            }else{
                responseMessage = "Invalid password";

            }
        }
        console.log(responseMessage);
        return response.send(responseMessage);
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "An error occurred" });
    }
});

app.listen(4000, () => console.log("backend started"));