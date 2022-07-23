const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool(config.db);

// const connection = mysql.createConnection(config.db);
// async function query(sql, callback) {
//     await connection.connect(async(err) => {
//         if (err) throw err;
//         //query the db
//         return connection.query(sql, (err, result) => {
//             if (err) throw err;
//             //console.log(result);
//             return result
//             callback(result[0]);
//         })
//     })
// }
const query = async (q,params) => {
    return new Promise((resolve, reject) => {
        pool.query(q, params, (err, res) => {
            if (err) {
                console.log((err && err.message) || err, q, params, err.stack);
                if (err.code == "ER_DUP_ENTRY") {
                    return reject({
                        message: "רשומה כפולה. לא ניתן להוסיף \\ לעדכן",
                        info: err.sqlMessage,
                    });
                }
                return reject(err);
            }            
            resolve(res);
        });
    });
};

module.exports = { query };