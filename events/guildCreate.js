"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { database } = require('../db');
const { Events } = require('discord.js');
module.exports = {
    name: Events.GuildCreate,
    execute(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            let Channels = [];
            let Roles = [];
            yield guild.channels.fetch().then((x) => x.map((c) => {
                if (c.type === 0) {
                    Channels.push({ id: c.id, name: c.name });
                }
            }));
            const roles = yield guild.roles.fetch();
            roles.map((a) => Roles.push({
                id: a.id,
                name: a.name
            }));
            database({
                Action: 'guildCreate',
                _id: guild.id,
                name: guild.name,
                channels: Channels,
                Roles,
            }).catch((err) => {
                return console.log(err);
            });
        });
    }
};
