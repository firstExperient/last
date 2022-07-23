
// const date = (d) => {
//   if (typeof d == "string") d = new Date(d);
//   return d.toJSON().split("T").join(" ").replace(/\..*/, "");
// };

const date = function (time) {
  let d = time ? new Date(time) : new Date();
  let offset = (d.getTimezoneOffset() / 60) * -1;
  //old_log(offset);
  let n = new Date(d.getTime() + offset * 60 * 60 * 1000);
  return n
      .toJSON()
      .replace("T", " ")
      .replace(/\.\d+Z/, "");
};
function userLogged (req, res, next){
  console.log("in userLogged" + req.session.userData);
  if (!req.session.userData || !req.session.userData.userId) {
    console.log(req.session.userData);
    res.status(403);
    res.send("you need to do sign up first");
  } else {
    console.log(req.session.userData.userId + " in logger");
    next();
  }
};
function manager (req, res, next){
  console.log("in manager" + req.session.userData);
  const {userData} = req.session
  if (!userData || !userData.userId || userData.authorize != 2) {
    console.log(req.session.userData);
    res.status(403);
    res.send("you dont have the authorize for this action");
  } else {
    next();
  }
};
module.exports = {
  userLogged:userLogged,
  date:date,
  manager:manager
} 