const fs = require('fs');
const express = require("express");
const router = express.Router({ mergeParams: true });
const query = require("../database/db.js").query;
const { userLogged, date,manager } = require("../middlwere");
async function getHeaderImage(postId) {
  let res = (
    await query("SELECT name FROM post_images WHERE postId=? LIMIT 1", [postId])
  )[0];
  console.log(res);
  if (!res) return "http://localhost:3002/post-images/logo.png";
  else return "http://localhost:3002/post-images/" + res.name;
}

router.post("/", userLogged, async (req, res) => {
  //add valid
  const { userId } = req.session.userData;
  const { name, labels, post,age,time,materials } = req.body;
  console.log(userId + " in post");
  await query(
    `INSERT INTO posts
      VALUES (DEFAULT,?,?,?,?,?,?,?,?)`,
    [post, date(new Date()), userId, JSON.stringify(labels), name,age,time,materials]
  );
  let postId = (
    await query(`select id from posts where userId=? order by date DESC`, [
      userId,
    ])
  )[0].id;
  await query(`INSERT INTO rate VALUES (?,default)`, [postId]);
  await query("update users set points=points+10 where id=?", [userId]);
  let images = post.match(/\/post-images\/(\d+)/g);
  if (images) {
    for (let i = 0; i < images.length; i++) {
      let id = images[i].match(/\d+$/)[0];
      await query("update post_images set postId=? where id=?", [postId, id]);
    }
  }

  console.log(postId + " postid");
  res.status(200);
  res.send({ postId: postId });
  // res.send(postId);
  // res.sendStatus(200)
});

router.get("/whats-new", async (req, res) => {
  const postsHeaders = await query(
    "select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p join users u on u.id=p.userId join rate r on p.id=r.postId order by p.date DESC limit 10"
  );
  for (let i = 0; i < postsHeaders.length; i++)
    postsHeaders[i].img = await getHeaderImage(postsHeaders[i].id);
  res.status(200);
  res.send(postsHeaders);
});

router.get("/favorites", userLogged, async (req, res) => {
  const { userId } = req.session.userData;
  const postsHeaders = await query(
    "select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p join rates r  ON p.id=r.postId JOIN users u ON p.userId=u.id WHERE r.userId=? ORDER BY r.rate DESC limit 10",
    [userId]
  );
  for (let i = 0; i < postsHeaders.length; i++)
    postsHeaders[i].img = await getHeaderImage(postsHeaders[i].id);
  res.status(200);
  res.send(postsHeaders);
});

router.get("/most-popular", async (req, res) => {
  const postsHeaders = await query(
    "select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p join users u on u.id=p.userId join rate r on p.id=r.postId order by r.rate DESC limit 10"
  );
  for(let i=0;i<postsHeaders.length;i++)
    postsHeaders[i].img = await getHeaderImage(postsHeaders[i].id)
  res.status(200);
  res.send(postsHeaders);
});

router.get("/search", async (req, res) => {
  let {search,time,age,materials} = req.query;
  let additon = ""
  if(time) additon+=` and time="${time}"`
  if(age)additon+=` and  age="${age}"`
  if(materials) additon+=` and materials="${materials}"`
  let res1 =
    await query(`select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p 
                             join users u on u.id=p.userId join rate r on p.id=r.postId
                             where title like '%${search}%' ${additon} order by date DESC`);
  let res2 =
    await query(`select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p 
                             join users u on u.id=p.userId join rate r on p.id=r.postId
                            where labels like '%${search}%' and not title like '%${search}%' ${additon} order by date DESC`);
  let res3 =
    await query(`select p.date, p.labels,p.title,u.name user,r.rate,p.id from posts p 
                            join users u on u.id=p.userId join rate r on p.id=r.postId
                             where text like '%${search}%' and not title like '%${search}%' and not labels like '%${search}%' ${additon} order by date DESC`);
  let postsHeaders = [...res1, ...res2, ...res3]
  for(let i=0;i<postsHeaders.length;i++)
    postsHeaders[i].img = await getHeaderImage(postsHeaders[i].id)

  res.send(postsHeaders); //Object.values(obj))
});

router.get("/:postId", async (req, res) => {
  let id = req.params.postId;
  const post = (
    await query(
      `select p.text post,p.date,p.labels,p.title, u.name user
        from posts p 
        join users u on u.id=p.userId 
        where p.id=?`,
      [id]
    )
  )[0];
  if (!post) {
    res.status(404);
    res.send("no such post");
  } else {
    res.status(200);
    res.send(post);
  }
});

router.delete("/:postId",manager,async(req,res,next)=>{
  let {postId} = req.params
  await query("DELETE  FROM rates WHERE postId=?",[postId])
  await query("DELETE  FROM rate WHERE postId=?",[postId])
  let images = await query("select name from post_images WHERE postId=?",[postId])
  console.log( images.length + "whyyyyyyyy")
  for(let i=0; i<images.length ;i++){
    await fs.unlink("./static/postImages/"+images[i].name,(err)=>next(err))
  }
  await query("DELETE  from post_images WHERE postId=?",[postId])
  images =await query("select i.name,i.id from comments c join comment_images i on c.id=i.commentId where c.postId=?",[postId])
  for(let i=0;i<images.length;i++){
    console.log("no no no no")
    await fs.unlink("./static/commentImages/"+images[i].name,(err)=>next(err))
    await query("delete from comment_images where id=?",[images[i].id])
  }
  await query("DELETE from comments where postId=?",[postId])
  const userId = (await query("select userId from posts where id=?",[postId]))[0];
  if(userId)await query("update users set points=points-10 where id=?",[userId.userId])
  await query("DELETE FROM posts where id=?",[postId])
  res.send(200)
})

module.exports = router;
