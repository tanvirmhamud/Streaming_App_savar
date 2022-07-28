const express = require('express');
const multer = require("multer");
const jwt = require("jsonwebtoken");
const accountmodel = require("../Model/useraccount.js")
const agoralivemodel = require("../Model/agoralive.js")
const verifytoken = require("../Middleware/token.js");
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');
dotenv.config()

const APP_ID = process.env.APP_ID
const APP_CERTIFICATE = process.env.APP_CERTIFICATE



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

const nocache = (_, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}


const generateRTCToken = (req, resp) => {
  jwt.verify(req.token, "tanvir", async (err, authData) => {
    if (err) {
      resp.status(401).json({ message: "Token Verification Fail" });
    } else {

      // let liveinfo = await accountmodel.findOne({ _id: authData['result']['_id'] })
      // let doc = await accountmodel.findOneAndUpdate({ _id: authData['result']['_id'] }, {
      //   live: !liveinfo.live
      // })


      const channelName = req.params.channel;
      if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
      }


      let uid = req.params.uid;
      if (!uid || uid === '') {
        return resp.status(500).json({ 'error': 'uid is required' });
      }
      // get role
      let role;
      if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER;
      } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
      } else {
        return resp.status(500).json({ 'error': 'role is incorrect' });
      }

      let expireTime = req.query.expiry;
      if (!expireTime || expireTime === '') {
        expireTime = 3600;
      } else {
        expireTime = parseInt(expireTime, 10);
      }


      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTime + expireTime;


      let token;
      if (req.params.tokentype === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
      } else if (req.params.tokentype === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
      } else {
        return resp.status(500).json({ 'error': 'token type is invalid' });
      }


      const liveinfo2 = await accountmodel.findOne({ _id: authData['result']['_id'] })
      const agorarecentdata = await agoralivemodel.findOne({userid: authData['result']['_id']})
      
      if (!agorarecentdata) {
        await agoralivemodel({ userid: liveinfo2._id, name: liveinfo2.name, email: liveinfo2.email, live: true, host: true, rtcToken: token, channelname: channelName, uid: uid, role: role }).save()
      } else {
        await agoralivemodel.deleteMany({ userid: liveinfo2._id })
        await agoralivemodel({ userid: liveinfo2._id, name: liveinfo2.name, email: liveinfo2.email, live: true, host: true, rtcToken: token, channelname: channelName, uid: uid, role: role }).save()
      }
      const agorarecentdata2 = await agoralivemodel.findOne({userid: authData['result']['_id']})
      resp.status(200).json(agorarecentdata2);
      // return resp.json({ 'rtcToken': token, channelname: channelName, uid: uid, role: role });
    }
  })



};


app.get('/rtc/:channel/:role/:tokentype/:uid', verifytoken, generateRTCToken)





app.get('/islive', verifytoken, upload.single("bookpic"), (req, res) => {
  jwt.verify(req.token, "tanvir", async (err, authData) => {
    if (err) {
      res.status(401).json({ message: "Token Verification Fail" });
    } else {
      const livestream = await agoralivemodel.find()
       res.status(200).json(livestream);
    }
  })
})







module.exports = app