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
    name: Events.GuildMemberAdd,
    execute(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild } = member;
            const res = yield database({ Action: 'fetchWelcome', guildId: member.guild.id });
            const { id, welcomeMessage } = yield res;
            const welcomeChannel = yield JSON.parse(res.welcomeChannel);
            let channel = yield guild.channels.fetch(welcomeChannel.id);
            let message = welcomeMessage;
            channel.send(`${message.replace('@', `${member}`)}`);
        });
    }
};
