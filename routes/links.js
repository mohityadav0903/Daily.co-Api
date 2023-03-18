const router = require('express').Router();
const Link = require('../models/link');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/create', async (req, res) => {
    const { roomName, linkNo } = req.body;
    try {
       const roomExist = await Link.findOne({roomName});
         if(roomExist){
            const linkExist = roomExist.links.find((link) => link.linkNo === linkNo);
            if(linkExist){
                const token = linkExist.token;
                res.status(200).json({token});
            }
            else{
                const token = jwt.sign({linkNo,roomName}, process.env.JWT_SECRET +false);
                roomExist.links.push({linkNo,token});
                await roomExist.save();
                res.status(200).json({token});
            }
    }
    else{
        const token = jwt.sign({linkNo,roomName}, process.env.JWT_SECRET +false);
        const newLink = new Link({
            roomName,
           links: [{linkNo,token}]
        });
        const savedLink = await newLink.save();
        console.log(savedLink);
        res.status(200).json({token});
    }
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.post('/join', async (req, res) => {

    const {linkNo,roomName,token} = req.body;
    try {
        const roomExist = await Link.findOne({roomName});
        if(roomExist){
            const linkExist = roomExist.links.find((link) => link.linkNo === linkNo);
            const tokenExist = linkExist.token === token;
            if(linkExist&& tokenExist){
                const decoded = jwt.verify(token, process.env.JWT_SECRET + linkExist.isJoined);
                if(decoded)
                {
                    res.status(200).json('valid token');
                }
                else
                {
                    res.status(401).json('invalid token');
                }
            }
            else{
                res.status(404).json('Link not found');
            }
        }
        else{
            res.status(404).json('Room not found');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }

});

router.post('/joined', async (req, res) => {
    const {linkNo,roomName,token} = req.body;
    try {
      const roomExist = await Link.findOne({roomName});
      if(roomExist)
      {
        const linkExist = roomExist.links.find((link) => link.linkNo === linkNo);
        if(linkExist){
        const tokenExist = linkExist.token === token;
        if(tokenExist)
        {
            roomExist.links.find((link) => link.linkNo === linkNo).isJoined = true;
            await roomExist.save();
            res.status(200).json('joined');
        }
        else{
            res.status(401).json('invalid token');
        }
    }
        else{
            res.status(404).json('link not found')
        }
      }
      else{
        res.status(404).json('room not found')
      }
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.post('/leave', async (req, res) => {
    const {linkNo,roomName} = req.body;
    try {
       const roomExist = await Link.findOne({roomName});
         if(roomExist)
            {
                const linkExist = roomExist.links.find((link) => link.linkNo === linkNo);
                if(linkExist){
                    roomExist.links.find((link) => link.linkNo === linkNo).isJoined = false;
                await roomExist.save();
                res.status(200).json('left');
                }
                else{
                    res.status(404).json('link not found')
                }

            }
            else{
                res.status(404).json('room not found')
            }

    }
    catch (error) {
        res.status(500).json(error);
    }

});
module.exports = router;
