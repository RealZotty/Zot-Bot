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
    name: Events.MessageReactionAdd,
    execute(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let guildId = reaction.message.guildId;
            if (reaction.partial) {
                reaction = yield reaction.fetch();
            }
            let guild = yield reaction.message.guild.fetch();
            let member = yield guild.members.fetch(user.id);
            let rulesEmbed = yield database({ Action: 'getRulesEmbed', guildId: reaction.message.guildId });
            let msgId = rulesEmbed.id;
            let roleId = rulesEmbed.reactionRole;
            let role = yield guild.roles.fetch(roleId);
            if (reaction.message.id === msgId) {
                console.log(role);
                member.roles.add(role);
            }
        });
    }
};
