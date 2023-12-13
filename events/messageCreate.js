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
const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: Events.MessageCreate,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let author = yield interaction.author;
            let member = yield interaction.guild.members.fetch(author.id);
            if (author.bot)
                return;
            //if(member.permissions.has(PermissionsBitField.Flags.MUTE_MEMBERS)) return;
            let message = yield interaction.content;
            let bannedList = yield database({ Action: 'fetchBannedWords', guildId: interaction.guild.id }).json();
            console.log(bannedList);
            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }
        });
    }
};
