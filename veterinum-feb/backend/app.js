const dotenv = require('dotenv')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()



// Configure env file
dotenv.config({ path: './config.env' });
require('./db/connection')
const port = process.env.PORT;

// Require model
const Users = require('./models/userSchema');
const Message = require('./models/msgSchema')
const authenticate = require('./middleware/authenticate')

// used to Get Data and cookis from frontend
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send("Hello Universe")

})

// Registration
app.post('/signup', async (req, res) => {
    try {
        // Get body or data
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password

        const createUser = new Users({
            username: username,
            email: email,
            password: password
        })

        // save method is used create user

        const created = await createUser.save()
        console.log(created)
        res.status(200).send("Registered")


    } catch (error) {
        res.status(400).send(error)
    }
})

// Login User
app.post('/signin', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // find user if exist
        const user = await Users.findOne({ email: email });
        if (user) {
            //  verify password
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                // Generate token define in user schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    // expire token in 24 hours
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                })
                res.status(200).send("LoggedIn")
            } else {
                res.status(400).send("Invalid Details");
            }
        } else {
            res.status(400).send("Invalid Details");

        }

    } catch (error) {
        res.status(400).send(error);

    }
})

// Admin login/////
app.post('/admin/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const admin = await Users.findOne({ email });
        if (!admin) {
            return res.status(400).send("Invalid Credentials");
        }

        // Ensure the user is an admin
        if (admin.role !== "admin") {
            return res.status(403).send("Not Authorized"); // 403 for Forbidden
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send("Invalid Credentials");
        }

        // Generate and send the token
        const token = await admin.generateToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 86400000), // expire token in 24 hours
            httpOnly: true
        });
        res.status(200).send("Logged In");

    } catch (error) {
        res.status(400).send(error.message);
    }
});



// msg
app.post('/messsage', async (req, res) => {
    try {
        // Get body or data
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        const sendMsg = new Message({
            name: name,
            email: email,
            message: message
        })

        // save method is used create user

        const created = await sendMsg.save()
        console.log(created)
        res.status(200).send("Sent")


    } catch (error) {
        res.status(400).send(error)
    }
})

// logout page
app.get('/logout', (req, res) => {
    res.clearCookie("jwt", { path: '/' })
    res.status(200).send("Signed Out")
})

// authenticate
// app.get('/auth', authenticate, (req, res)=>{

// })

// Run server
app.listen(port, () => {
    console.log("Server is Running")
})

// Siu ..... backend end
// connect frontend with backend


