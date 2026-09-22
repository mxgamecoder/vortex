const axios = require('axios');
const { malvin } = require('../malvin');

malvin({
    pattern: 'fancy',
    alias: ['font', 'style'],
    react: '✍️',
    desc: 'convert text to fancy fonts ✏️',
    category: 'fun',
    use: '.fancy <text>',
    filename: __filename
}, async (malvin, mek, m, { from, args, quoted, reply }) => {
    try {
        const text = args.join(' ');
        if (!text) {
            return reply('❌ please provide text\nexample: .fancy hello world');
        }

        await malvin.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });

        if (!response.data?.status || !response.data?.result?.length) {
            return reply('❌ failed to fetch fonts 😔');
        }

        const fonts = response.data.result
            .map((item, index) => `├ *${index + 1}. ${item.name}*: ${item.result}`)
            .join('\n');
        
        const caption = `
╭──〔 *ғᴀɴᴄʏ ᴛᴇxᴛ* 〕──⬣
├ *ɪɴᴘᴜᴛ*: ${text} ✍️
${fonts}
╰──────────────⬣
> *made by vortex`;

        await malvin.sendMessage(from, {
            text: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await malvin.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ fancy error:', error);
        const errorMsg = error.message.includes('timeout')
            ? '❌ request timed out ⏰'
            : '❌ error generating fonts 😞';
        await reply(errorMsg);
        await malvin.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});