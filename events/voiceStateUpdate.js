const voiceChannelId = process.env.VOICE_CHANNEL_ID;
const presenterRoleId = process.env.PRESENTER_ROLE_ID;
const textChannelId = process.env.TEXT_CHANNEL_ID;

module.exports = (client, oldState, newState) => {
    if (newState.channelId === voiceChannelId && !oldState.channelId) {
        const member = newState.member;

        if (member.roles.cache.has(presenterRoleId)) {
            const textChannel = client.channels.cache.get(textChannelId);
            if (textChannel) {
                textChannel.send('O apresentador está pronto! Já vamos começar, venham! ||@everyone||');
            }
        }
    }
};
