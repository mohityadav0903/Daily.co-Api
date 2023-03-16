const router = require('express').Router();
const Link = require('../models/link');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/create', async (req, res) => {
    const { roomName, userId } = req.body;
    try {
        const newLink = new Link({
            roomName,
            userId,
        });
        await newLink.save();
  
        const token = jwt.sign({ userId: newLink.userId }, process.env.JWT_SECRET+newLink.isJoined);
        if(token)
        res.status(200).json({ token });

        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/join', async (req, res) => {

    const {userId,roomName,token} = req.body;
    try {
       const linkExist = await Link.findOne({roomName:roomName,userId:userId});
         if(linkExist){
            const decoded = jwt.verify(token, process.env.JWT_SECRET+linkExist.isJoined);
            if(decoded){
                linkExist.isJoined = true;
                await linkExist.save();
                res.status(200).json("Joined");
            }
            else{
                res.status(401).json("Invalid token");
            }
         }
            else{
                res.status(404).json("Link not found");
            }
    }
    catch (error) {
        res.status(500).json(error);
    }

});

router.post('/leave', async (req, res) => {
    const {userId,roomName} = req.body;
    try {
        const linkExist = await Link.findOne({roomName:roomName,userId:userId});
        if(linkExist){
            linkExist.isJoined = false;
            await linkExist.save();
            res.status(200).json("Left");
        }
        else{
            res.status(404).json("Link not found");
        }

    }
    catch (error) {
        res.status(500).json(error);
    }

});
module.exports = router;
