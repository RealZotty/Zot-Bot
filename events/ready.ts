var { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: any) {
        client.user.setActivity('Over the world', { type: ActivityType.Watching } );
        client.user.setStatus('dnd')
        console.log(`Ready Logged in as ${client.user.tag}`)
    }
};

export{}