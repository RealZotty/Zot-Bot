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
        function containsNonLatinCodepoints(s) {
            return /[^\u0000-\u00ff]/.test(s);
        }
        if(Reason) {
            let boolean = containsNonLatinCodepoints(Reason);
            if(boolean) {
                Reason = 'No reason provided or invalid syntax.'
            }
        }
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
                if(err) return rej(404)
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
                if(err) return rej(404)
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
               if(err) Rej(err)
               if(result[0]) {
                   return Res(result[0])
               } else {
                return Res(null)
               }
            })
       } else if (Action === 'setAuditLogs') {
            connection.query(`SELECT * FROM settings WHERE id='${data.guildId}'`, (err, result) => {
                if(err) return Rej(err)
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
               if(err) Rej(err)
               if(result[0]) {
                   return Res(JSON.parse(result[0].auditLogs))
               } else {
                return Res(null)
               }
            })
       } else if (Action === 'setRulesEmbed') {
        connection.query(`UPDATE guilds SET rulesEmbed='${JSON.stringify(data.rulesEmbed)}' WHERE id='${guildId}'`, (err, result) => {
            if(err) return Rej(err)
            if(result) {
                return Res(200)
            }

        })
       } else if (Action === 'getRulesEmbed') {
        connection.query(`SELECT rulesEmbed FROM guilds WHERE id='${guildId}'`, (err, result) => {
            if(err) Rej(err)
            if(result[0]) {
                return Res(JSON.parse(result[0].rulesEmbed))
            } else {
                return Res(null)
            }
        })
       } else if(Action === 'getTickets') {
        connection.query(`SELECT tickets FROM guilds WHERE id='${guildId}'`, (err, result) => {
            if(err) Rej(err)
            if(result[0].tickets) {
                return Res(JSON.parse(result[0].tickets));
            } else {
                return Res(0)
            }
        })
       } else if(Action === 'insertTickets') {
            connection.query(`SELECT tickets FROM guilds WHERE id='${guildId}'`, (err, result) => {
                if(err) Rej(err)
                if(result[0].tickets !== 'null') {
                    let tickets = JSON.parse(result[0].tickets);
                    connection.query(`UPDATE guilds SET tickets='${JSON.stringify([...tickets, data])}' WHERE id='${guildId}'`, (err, result) => {
                        if(err) Rej(err)
                    })

                } else {
                    connection.query(`UPDATE guilds SET tickets='${JSON.stringify([data])}' WHERE id='${guildId}'`, (err, result) => {
                        if(err) Rej(err)
                        return Res(200)
                    })
                }
            })
       } else if(Action === 'getTicketCategory') {
            connection.query(`SELECT ticketCategory FROM settings WHERE id='${guildId}'`, (err, result) => {
                if(err) Rej(err)
                if(result[0].ticketCategory) {
                    return Res(result[0].ticketCategory)
                } else return Res('Tickets');
            })
       } else if(Action === 'setTicketCategory') {
        connection.query(`UPDATE settings SET ticketCategory='${data.category}' WHERE id='${guildId}'`, (err, result) => {
            if(err) return Rej(err)
            return Res(200)
        })
       } else if(Action === 'setSuggestionChannel') {
                    connection.query(`UPDATE settings SET suggestions='${data.channel}' WHERE id='${guildId}'`, (err, result) => {
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })

       } else if(Action === 'getSuggestionChannel') {
            connection.query(`SELECT suggestions FROM settings WHERE id='${guildId}'`, (err, result) => {
                if(err) return Rej(err)
                if(result) {
                    return Res(result[0].suggestions)
                }
            })
       } else if(Action === 'insertSuggestion') {
            connection.query(`SELECT suggestions FROM guilds WHERE id='${guildId}'`, (err, result) => {
                if(err) return Rej(err)
                let isArr;
                try {
                    isArr = JSON.parse(result[0].suggestions);
                } catch(err) {
                    isArr = false;
                }
                if(isArr) {
                    let old = JSON.parse(result[0].suggestions);
                    connection.query(`UPDATE guilds SET suggestions='${JSON.stringify([...old, data])}' WHERE id='${guildId}'`, (err, result) => {
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                } else {
                    connection.query(`UPDATE guilds SET suggestions='${JSON.stringify([data])}' WHERE id='${guildId}'`, (err, result) => {
                        if(err) return Rej(err)
                        if(result) {
                            return Res(200)
                        }
                    })
                }
            })
       } else if(Action === 'updateSuggestion') {
        connection.query(`SELECT suggestions FROM guilds WHERE id='${guildId}'`, async (err, result) => {
            if(err) return Rej(err)
            let isArr;
                try {
                    isArr = JSON.parse(result[0].suggestions);
                } catch(err) {
                    isArr = false;
                }
            if(isArr) {
                let old = JSON.parse(result[0].suggestions);
                let newArr;
                function Update(o) {
                    return o.map((x, index) => {
                        if(x.id === data.id) {
                            old.splice(index, 1);
                            newArr = [...old, data]
                        }
                    })
                }
                Update(old)
                connection.query(`UPDATE guilds SET suggestions='${JSON.stringify([...old, data])}' WHERE id='${guildId}'`, (err, result) => {
                    if(err) return Rej(err)
                    if(result) {
                        return Res(200)
                    }
                })
            } else {
                connection.query(`UPDATE guilds SET suggestions='${JSON.stringify([data])}' WHERE id='${guildId}'`, (err, result) => {
                    if(err) return Rej(err)
                    if(result) {
                        return Res(200)
                    }
                })
            }
        })
   } else if(Action === 'getSuggestion') {
            connection.query(`SELECT suggestions FROM guilds WHERE id='${guildId}'`, (err, result) => {
                if(err) return Rej(err)
                let isArr;
                try {
                    isArr = JSON.parse(result[0].suggestions);
                } catch(err) {
                    isArr = false;
                }
                if(isArr) {
                    let arr = JSON.parse(result[0].suggestions);
                    arr.map((x) => {
                        if(x.id === data.msgId) {
                            return Res(x)
                        }
                    })
                } else {
                    return Rej(404)
                }
            })
       }
    })
}

exports.database = database;