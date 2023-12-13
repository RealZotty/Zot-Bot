var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER_NAME,
    password: process.env.MYSQL_USER_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    stringifyObjects: true,
})
const database = function database(req) {
    return new Promise(async (Res, Rej) => {
        let { Action, Author, User, Reason, timestamp, guildId, duration, _id, name, channels, Roles, data} = req;
        if(!duration) duration = null;
        if(Action === 'Ban' || Action === 'Kick' || Action === 'Unban' || Action === 'Mute' || Action === 'Unmute') {
            connection.query(`INSERT INTO moderation (id, Action, User, Reason, Author, timestamp, guildId, duration) VALUES ("${crypto.randomUUID()}", "${Action}", "${User}", "${Reason}", "${Author}", "${timestamp}", "${guildId}", "${duration}")`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(200)
                }
            })
        } else if (Action === 'guildCreate') {
            connection.query(`INSERT INTO guilds (id, name, channels, roles) VALUES ("${_id}", "${name}", '${JSON.stringify(channels)}', '${JSON.stringify(Roles)}')`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(200)
                }
            })
        } else if (Action === 'guildDelete') {
            connection.query(`DELETE FROM guilds WHERE id=${_id}`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(200)
                }
            })
        } else if (Action === 'channelCreate' || Action === 'channelDelete') {
            connection.query(`UPDATE guilds SET channels='${JSON.stringify(channels)}'`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(200)
                }
            })
        } else if (Action === 'roleCreate' || Action === 'roleDelete' || Action === 'roleUpdate') {
            connection.query(`UPDATE guilds SET roles='${JSON.stringify(Roles)}'`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(200)
                }
            })
        } else if(Action === 'fetchBannedWords') {
            connection.query(`SELECT bannedWords FROM settings WHERE id=${guildId}`, (err, result) => {
                if(err) return Rej(err)
                if(result[0]) {
                    return Res(result[0])
                } else {
                    return Res(null)
                   }
            })
        } else if (Action === 'setBannedWords') {
            connection.query(`SELECT * FROM settings WHERE id='${data.guildId}'`, (err, result) => {
                if(err) return console.log(err)
                if(result[0]) {
                    connection.query(`UPDATE settings SET bannedWords='${data.bannedWords}' WHERE id='${data.guildId}'`, (err, result) =>{
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                } else {
                    connection.query(`INSERT INTO settings (id, bannedWords) VALUES ('${data.guildId}', '${data.bannedWords}')`, (err, result) => {
                        if(err) Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                }
            })
        } else if (Action === 'setWelcome') {
            connection.query(`SELECT * FROM settings WHERE id='${data.guildId}'`, (err, result) => {
                if(err) return console.log(err)
                if(result[0]) {
                    connection.query(`UPDATE settings SET welcomeChannel='${JSON.stringify(data.channel)}', welcomeMessage='${data.message}' WHERE id='${data.guildId}'`, (err, result) =>{
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                } else {
                    connection.query(`INSERT INTO settings (id, welcomeChannel, welcomeMessage) VALUES ('${data.guildId}', '${JSON.stringify(data.channel)}', '${data.message}')`, (err, result) => {
                        if(err) Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                }
            })
        } else if (Action === 'fetchWelcome') {
            connection.query(`SELECT * FROM settings WHERE id='${guildId}'`, (err, result) => {
               if(err) throw err
               if(result[0]) {
                   return Res(result[0])
               } else {
                return Res(null)
               }
            })
       } else if (Action === 'setAuditLogs') {
            connection.query(`SELECT * FROM settings WHERE id='${data.guildId}'`, (err, result) => {
                if(err) return console.log(err)
                let auditLogs = {
                    channel: data.channel,
                    enabled: data.boolean        
                }
                if(result[0]) {
                    connection.query(`UPDATE settings SET auditLogs='${JSON.stringify(auditLogs)}' WHERE id='${data.guildId}'`, (err, result) =>{
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                } else {
                    connection.query(`INSERT INTO settings (id, auditLogs) VALUES ('${data.guildId}', '${JSON.stringify(auditLogs)}')`, (err, result) => {
                        if(err) Rej(err)
                        if(result) {
                            return Res(200)
                        } 
                    })
                }
            })
        } else if (Action === 'fetchAuditLogs') {
            connection.query(`SELECT auditLogs FROM settings WHERE id='${guildId}'`, (err, result) => {
               if(err) throw err
               if(result[0]) {
                   return Res(JSON.parse(result[0].auditLogs))
               } else {
                return Res(null)
               }
            })
       }
    })
}

exports.database = database;