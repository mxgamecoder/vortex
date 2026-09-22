const axios = require('axios');
const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');

malvin({
    pattern: 'version',
    react: '🚀',
    desc: 'Check bot version & updates 📦',
    category: 'info',
    use: '.version',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        await malvin.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const time = moment().tz('Africa/Harare').format('HH:mm:ss');
        const date = moment().tz('Africa/Harare').format('DD/MM/YYYY');
        const localPackage = require('../package.json');
        const currentVersion = localPackage.version;

        let latestVersion = 'Unknown';
        let status = '🔍 *Remote check disabled*';

        if (config.CHECK_VERSION !== false) {
            const repoUrl = config.REPO || 'https://github.com/mxgamecoder/vortex';
            const repoPath = repoUrl.replace('https://github.com/', '');
            const rawUrl = `https://raw.githubusercontent.com/${repoPath}/main/package.json`;

            try {
                const { data: remotePackage } = await axios.get(rawUrl, { timeout: 15000, headers: { 'User-Agent': 'vortex-bot' } });
                latestVersion = remotePackage.version || 'Unknown';
                status = currentVersion === latestVersion
                    ? '✅ *Up-to-date*'
                    : '⚠️ *Update available*';
            } catch (err) {
                console.warn('⚠️ Failed to fetch remote version:', err.message);
                latestVersion = 'N/A';
                status = '⚠️ *Repo check unavailable*';
            }
        }

        const caption = `
╭───[ *vortex Bot Version* ]───
├ *Current*: v${currentVersion} 📍
├ *Latest*: v${latestVersion} 🆕
├ *Status*: ${status}
├ *Checked*: ${date} 🗓️
├ *Time*: ${time} 🕒
├ *Bot*: ${config.BOT_NAME || 'vortex'} 🤖
├ *Developer*: ${config.DEV_NAME || 'mxgamecoder'}
├ *Repo*: ${config.REPO || 'https://github.com/mxgamecoder/vortex'} 📦
╰──────────────┈⊷
> *Made by mxgamecoder*`;

        await malvin.sendMessage(from, {
            image: { url: config.ALIVE_IMG || 'https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png' },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029Vb7Ew0t8fewhGUdO1J0s@newsletter',
                    newsletterName: config.BOT_NAME ? `${config.BOT_NAME}` : 'vortex',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        await malvin.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ Version check error:', error);

        const localVersion = require('../package.json').version;
        const caption = `
╭───[ *Version Error* ]───
├ *Local Version*: v${localVersion} 📍
├ *Error*: ${error.message || 'unknown error'} ❌
├ *Repo*: ${config.REPO || 'https://github.com/mxgamecoder/vortex'} 📦
╰──────────────┈⊷
> *Made by mxgamecoder*`;

        await reply(caption);
        await malvin.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
