const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');

// Bot start time
const botStartTime = process.hrtime.bigint();

malvin({
    pattern: 'ping',
    alias: ['speed', 'pong','p'],
    desc: 'Check bot\'s response time with live dashboard',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        const ownerName = config.OWNER_NAME || '𝚖𝚡𝚐𝚊𝚖𝚎𝚌𝚘𝚍𝚎𝚛';
        const botName = config.BOT_NAME || 'vortex';
        const repoLink = config.REPO || 'https://github.com/mxgamecoder/vortex';
        const timezone = config.TIMEZONE || 'Africa/Nigeria';

        const start = process.hrtime.bigint();

        // Base static info
        const now = moment().tz(timezone);
        const uptimeSeconds = Number(process.hrtime.bigint() - botStartTime)/1e9;
        const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();
        const memory = process.memoryUsage();
        const memoryUsage = `${(memory.heapUsed/1024/1024).toFixed(2)}/${(memory.heapTotal/1024/1024).toFixed(2)} MB`;

        let baseMsg = `
💻 Developer     : ${ownerName}
🤖 Bot Name      : ${botName}
🌟 Star & fork repo: ${repoLink}

⏱ Uptime        : ${uptime}
💾 Memory        : ${memoryUsage}
🖥 Node Version  : ${process.version}

⏰ Time          : ${now.format('HH:mm:ss')} (${timezone})
📅 Date          : ${now.format('DD/MM/YYYY')}

Loading: `; // loading bar line

        // Send initial message
        const sent = await malvin.sendMessage(from, {
            text: baseMsg + '▰▱▱▱▱▱▱▱▱▱ 🚀 Super Fast',
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029Vb7Ew0t8fewhGUdO1J0s@newsletter',
                    newsletterName: ownerName,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Animate speed meter
        const totalFrames = 12; // ~8 seconds live effect
        const barLength = 10;
        for (let i = 0; i < totalFrames; i++) {
            const responseTime = Number(process.hrtime.bigint() - start)/1e9;

            // Dynamic status and bar
            let statusText;
            if (responseTime < 0.3) statusText = '🚀 Super Fast';
            else if (responseTime < 0.6) statusText = '⚡ Fast';
            else if (responseTime < 1.0) statusText = '⚠️ Medium';
            else statusText = '🐢 Slow';

            // Bar grows/shrinks based on responseTime
            const filledLength = Math.min(barLength, Math.max(1, Math.floor((0.3/Math.max(responseTime,0.1))*barLength)));
            const emptyLength = barLength - filledLength;
            const loadingBar = '▰'.repeat(filledLength) + '▱'.repeat(emptyLength);

            // Compose live message
            const liveMsg = baseMsg + `${loadingBar} ${statusText} (${responseTime.toFixed(2)}s)`;

            // Fallback: send a replacement update because this Baileys build does not expose editMessage
            await malvin.sendMessage(from, { text: liveMsg }, { quoted: mek });

            await new Promise(res => setTimeout(res, 700)); // frame delay
        }

        // Final reaction
        await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch(e) {
        console.error('Ping Error:', e);
        await reply(`❌ Error: ${e.message || 'Failed to process ping command'}`);
        await malvin.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
