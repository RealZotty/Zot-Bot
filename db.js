var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();
const database = function database(req) {
    return new Promise(async (Res, Rej) => {
        let { Action, Author, User, Reason, timestamp, guildId, duration } = req;
        if(!duration) duration = null;
        var connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER_NAME,
            password: process.env.MYSQL_USER_PASSWORD,
            port: process.env.MYSQL_PORT,
            database: process.env.MYSQL_DATABASE,
        })
        if(Action === 'Ban' || Action === 'Kick' || Action === 'Unban' || Action === 'Mute' || Action === 'Unmute') {
            connection.query(`INSERT INTO moderation (id, Action, User, Reason, Author, timestamp, guildId, duration) VALUES ("${crypto.randomUUID()}", "${Action}", "${User}", "${Reason}", "${Author}", "${timestamp}", "${guildId}", "${duration}")`, (err, result) => {
                if(err) console.log(err)
                if(result) {
                    console.log(result)
                    Res(200)
                }
            })
        }
        connection.end()
    })
}

exports.database = database;