const express = require("express");
const router = express.Router({mergeParams:true});
const query = require("../database/db.js").query;
const {userLogged,date} = require("../middlwere")

router.post("/", async (req, res) => {
  
    const { name, password, mail } = req.body;
    let exist = await query("select id from users where name=?", [name]);
    if (exist.length) {
      res.status(403).send("user name already in use")
    } else {
      await query(
        `INSERT INTO users
      VALUES (DEFAULT,?,?,?,?,DEFAULT,1)`,
        [name, password, mail, date(new Date())]
      );
      let userId = (await query(`select id from users where name=?`, [name]))[0]
        .id;
      console.log("sign up " + userId);
      req.session.userData = { userId: userId };
      console.log("sign");
      res.status(200).send("sighnned");
    }
  });

  router.put("/", async (req, res) => {
    const { name, password } = req.body;
    let user = (
      await query(`select u.id,a.id authorize,u.name,password from users u join authorization a on a.id=u.authorize where u.name=?`, [name])
    )[0];
    console.log(user + " user");
    if (!user || user.password != password) {
      res.status(403).send("user name or password are incorrect");
    } else {
      //req.session("userId", user.id);
      req.session.userData = { userId: user.id ,authorize:user.authorize};
      res.status(200).send({userA:user.authorize});
    }
  });
  router.get("/is-logged", async (req, res) => {
    if (!req.session.userData) {
      //|| !req.session.userData.userId) {
      console.log(req.session.userData + "dont understand");
      res.send({ isLogged: false });
    } else {
      res.send({ isLogged: true });
    }
  });

  router.put("/log-out", userLogged, async (req, res) => {
    req.session.userData = null;
    res.sendStatus(200);
  });

module.exports = router