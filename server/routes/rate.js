const express = require("express");
const router = express.Router({mergeParams:true});
const query = require("../database/db.js").query;
const {userLogged,date} = require("../middlwere")

router.get("/", userLogged,async (req, res) => {
    const postId = req.params.postId;
    const rate = (
      await query(`select rate from rate where postId=?`, [postId])
    )[0];
    const {userData} = req.session
    rate.rated = false
    if(userData && userData.userId){
      rate.rated = (await query("select id from rates where postId=? and userId=?",[postId,userData.userId])).length?true:false
    }
    res.status(200);
    res.send(rate);
  });

router.put("/", async (req, res) => {
    const postId = req.params.postId;
    const { rate } = req.body;
    const {userId} = req.session.userData
    if((await query("select * from rates where postId=? and userId=?",[postId,userId])).length){
      res.status(403).send("cant rate twice")
    }else{
      await query("INSERT INTO rates VALUES(default,?,?,?)",[postId,rate,userId])
      let postUserId = (await query("select userId from posts where id=?", [postId]))[0]
        .userId;
      if (rate >= 4) {
        await query(`UPDATE users SET points=points+${rate > 4 ? 2 : 1} WHERE id=?`,
          [postUserId]
        );}
      let avg = (await query("select avg(rate) avg from rates where postId=?",postId))[0].avg
      await query("update rate set rate=? where postId=?",[avg,postId]) 
      res.send(200)
     }
  });

module.exports = router