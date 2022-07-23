const express = require("express");
const router = express.Router({mergeParams:true});
const query = require("../database/db.js").query;
const {userLogged,date, manager} = require("../middlwere")
const fs = require('fs');


router.get("/", async (req, res) => {
  const postId = req.params.postId;
  const comments = await query(
    `select c.text,c.id,u.name user,c.date from comments c join users u on c.userId=u.id where postId="${postId}" order by date limit 10`
  );
  res.status(200);
  res.send(comments);
});

router.post("/", userLogged, async (req, res) => {
  const postId = req.params.postId;
  console.log(postId + " pramas")
  const { userId } = req.session.userData;
  const { text } = req.body;
  let commmentId = (
    await query(`INSERT INTO comments VALUES(default,?,?,?,?)`, [
      postId,
      userId,
      date(new Date()),
      text,
    ])
  ).insertId;
  let images = text.match(/\/comment-images\/(\d+)/g);
  if (images) {
    for (let i = 0; i < images.length; i++) {
      let id = images[i].match(/\d+$/)[0];
      await query("update comment_images set commentId=? where id=?", [
        commmentId,
        id,
      ]);
    }
  }
  res.sendStatus(200);
});

router.delete("/:commentId",manager,async(req,res,next)=>{
  let {commentId} = req.params
  images = await query("select i.name from comments c join comment_images i on c.id=i.commentId where c.id=?",[commentId])
  for(let i=0;i<images.length;i++)
      fs.unlink("./static/commentImages/"+images[i].name,(err)=>next(err))
  await query("delete from comment_images where commentId=?",[commentId])
  await query("DELETE from comments where id=?",[commentId])
  res.send(200)
})

module.exports = router;
