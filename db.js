var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();
const database = function database(req) {
    return new Promise(async (Res, Rej) => {
        const { Action, User, Reason, Author, timestamp, guildId } = req;
        var connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER_NAME,
            password: process.env.MYSQL_USER_PASSWORD,
            port: process.env.MYSQL_PORT,
            database: process.env.MYSQL_DATABASE,
        })
        if(Action === 'Ban' || Action === 'Kick' || Action === 'Unban') {
            connection.query(`INSERT INTO moderation (id, Action, User, Reason, Author, timestamp, guildId) VALUES ("${crypto.randomUUID()}", "${Action}", "${User}", "${Reason}", "${Author}", "${timestamp}", "${guildId}")`, (err, result) => {
                if(err) Rej.send(err)
                if(result[0]) {
                    
                    Res.send(200)
                }
            })
        }
        connection.end()
    })
}

exports.database = database;