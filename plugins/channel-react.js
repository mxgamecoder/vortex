const { malvin } = require('../malvin');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

malvin({
    pattern: 'channelreact',
    alias: ['creact', 'chr'],
    react: '🔤',
    desc: 'Send stylized emoji reaction to a channel 📢',
    category: 'owner',
    use: '.chr <channel-link> <text>',
    filename: __filename
}, async (malvin, mek, m, { q, command, isCreator, reply, from }) => {
    try {
        if (!isCreator) return reply('❌ Owner-only command 🚫');

        if (!q) {
            return reply(`❌ Usage: ${command} https://whatsapp.com/channel/<id>/<msg-id> <text>\nExample: .chr https://whatsapp.com/channel/1234/5678 hello`);
        }

        await malvin.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const [link, ...textParts] = q.trim().split(' ');
        const inputText = textParts.join(' ').toLowerCase();

        if (!link.includes('whatsapp.com/channel/') || !inputText) {
            return reply('❌ Invalid channel link or missing text 😔');
        }

        const urlSegments = link.trim().split('/');
        const channelInvite = urlSegments[4];
        const messageId = urlSegments[5];

        if (!channelInvite || !messageId) {
            return reply('❌ Invalid channel or message ID 🚫');
        }

        // Stylize input text
        const emojiText = inputText
            .split('')
            .map(char => (char === ' ' ? '―' : stylizedChars[char] || char))
            .join('');

        // Get channel metadata
        const { id: channelJid, name: channelName } = await malvin.newsletterMetadata('newsletter', channelInvite);

        // Send stylized reaction
        await malvin.newsletterReactMessage(channelJid, messageId, emojiText);

        // Caption with your branding
        const caption = `
╭───[ *ᴄʜᴀɴɴᴇʟ ʀᴇᴀᴄᴛ* ]───
├ *Channel*: ${channelName} 
├ *Reaction*: ${emojiText} 🔤
╰───[ *vortex* ]───`;

        await malvin.sendMessage(from, {
            text: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await malvin.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ channelreact error:', error);
        let errorMsg = '❌ Error sending reaction ⏰';
        if (error.message.includes('not-authorized')) errorMsg = '❌ Bot not authorized for channel 😞';
        else if (error.message.includes('not-found')) errorMsg = '❌ Channel or message not found 😔';

        await reply(errorMsg);
        await malvin.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
