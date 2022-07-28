
const express = require("express");
const accountmodel = require("../Model/useraccount.js")
const multer = require("multer");
const jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./profilepic");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
const app = express();



app.post("/signup", upload.single("authorpic"), async (req, res) => {
    accountmodel.findOne({ email: req.body.email }, async (error, result) => {
        if (!result) {
            const accountdata = accountmodel({name: req.body.name, email: req.body.email, password: req.body.password,live: false})
            await accountdata.save()
            jwt.sign({accountdata}, 'tanvir', async (err2, token) => {
                if (err2) {
                    res.status(400).json({ error: "token generate failed" })
                } else {
                    res.json({
                        message: "account create successfull",
                        token,
                    });
                }
            });
        } else if (result) {
            res.status(400).json({ message: "account alreday available" })
        } else {
            res.status(400).json({ message: error })
        }
    })
})



app.post("/login", upload.single("authorpic"), async (req, res) => {
    const query = accountmodel.findOne({ email: req.body.email, password: req.body.password }).select({password: 0})
    query.exec(function (err, result) {
        if (result) {
            jwt.sign({result}, 'tanvir', async (err2, token) => {
    
                if (err2) {
                    res.status(400).json({ error: "token generate failed" })
                } else {
                    const accountdata = accountmodel({ name: result.name, email: result.email, password: result.password,  id:result._id,live: false})
                    res.status(200).json({accountdata, token: token})
                }
            });
    
        } else if (!result) {
            res.status(400).json({ message: "account not found" })
        } else {
            res.status(400).json({ message: err })
        }
    });

    
})



module.exports = app

