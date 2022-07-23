const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
const query = require("./database/db.js").query;
const session = require("express-session");
var FileStore = require("session-file-store")(session);
const multer = require("multer");
const {userLogged,date} = require("./middlwere")
const posts =  require("./routes/posts")
const users =  require("./routes/users")
const rate =  require("./routes/rate")
const comment =  require("./routes/comments")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.url == "/post-images") cb(null, "static/postImages/");
    if (req.url == "/comment-images") cb(null, "static/commentImages/");
  },
  filename: async (req, file, cb) => {
    if (req.url == "/post-images") {
      let id = (
        await query("INSERT INTO post_images values(default,default,DEFAULT,?)", [date(new Date()),])
      ).insertId;
      let name =id+  "." + file.mimetype.split("/")[1]
      await query("update post_images set name=? where id=?",[name,id])
      cb(null,name);
    }
    if (req.url == "/comment-images") {
      let id = (
        await query(
          "INSERT INTO comment_images values(default,default,DEFAULT,?)",[date(new Date())])
      ).insertId;
      let name =id+  "." + file.mimetype.split("/")[1]
      await query("update comment_images set name=? where id=?",[name,id])
      cb(null, name);
    }
  },
});
const upload = multer({ storage: storage });
const port = 3002;
process.on("uncaughtException", (e) => {
  console.log("error----------------------------")
  console.error(e);
});
app.use(cors({ origin: true, credentials: true }));
app.use("/post-images", express.static("./static/postImages"));
app.use("/comment-images", express.static("./static/commentImages"));
app.use(bodyParser.json());
app.use(session({ secret: "khsgfs",maxAge: 60 * 60 * 10000, store: new FileStore({}), }));

const formats = {
  GET: {},
  POST: {
    "/users": {
      name: /^[a-zA-Z א-ת]{3,}$/,
      password: /^[0-9a-zA-Zא-ת]{4,}$/,
    },
    "/posts":{
       post: /.{20,}/,
       name: /.{3,}/
    },
    "/posts/params/comments":{
      text:/<.*>\s*[a-zא-ת]/}
  },
  PUT: {
    "/posts/params/rate":{
      rate:/^[0-5]\.?[0,5]$/
    }
  },
  DELETE: {},
};
const validator = (req, res, next) => {
  let url = req.url.replace(/\d/g,"params")
  const format = formats[req.method][url];
  console.log(url,req.params)
  let flag = true;
  if (!format) next();
  else {
    console.log("format "+req.method+","+req.url)
    const props = Object.keys(format);
    for (let i = 0; i < props.length; i++) {
      if (!req.body[props[i]] || !String(req.body[props[i]]).match(format[props[i]])) {
        res.status(400).end("bad request");
        flag = false;
        console.log("worng");
      }
    }
    console.log("right");
    if (flag) next();
  }
};
app.use(validator);

app.use("/posts/:postId/rate",rate)
app.use("/posts/:postId/comments",comment)
app.use("/posts",posts)
app.use("/users",users)

app.post("/post-images", userLogged, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.status(200).send({ data: { url: req.file.filename } });
});
app.post("/comment-images", userLogged, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.status(200).send({ data: { url: req.file.filename } });
});

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).send("ERR")
})
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});

// module.exports = {
//   date:date,
//   //userLogged:userLogged
// }
module.exports = userLogged 