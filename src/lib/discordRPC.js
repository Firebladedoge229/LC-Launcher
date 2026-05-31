export default class DiscordRPC {
    static async enable(clientId) {
        return await lib.run(null, 'discordRPC', 'enable', clientId);
    };

    static async disable() {
        return await lib.run(null, 'discordRPC', 'disable');
    };

    static async edit(config) {
        return await lib.run(null, 'discordRPC', 'edit', config);
    };
};