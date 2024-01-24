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
const { Events } = require('discord.js');
const { database } = require('../db');
module.exports = {
    name: Events.ChannelCreate,
    execute(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            let Channels = [];
            yield channel.guild.channels.fetch().then((x) => x.map((c) => {
                if (c.type === 0) {
                    Channels.push({ id: c.id, name: c.name });
                }
            }));
            yield database({
                Action: 'channelCreate',
                _id: channel.guild.id,
                channels: Channels,
            }).catch((err) => console.log(err));
        });
    }
};
