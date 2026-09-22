const { malvin } = require("../malvin");
const config = require("../settings");
const moment = require("moment");

const ALIVE_IMG = "https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png";

malvin({
    pattern: "alive2",
    desc: "Check bot's status & uptime",
    category: "main",
    react: "💡",
    filename: __filename
}, async (malvin, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const now = moment();
        const currentTime = now.format("HH:mm:ss");
        const currentDate = now.format("dddd, MMMM Do YYYY");

        // Uptime formatting
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const uptime = `${hours}h ${minutes}m ${seconds}s`;

        // Tiny / stylish caps
        const toTinyCap = (text) =>
            text.split("").map(char => {
                const tiny = {
                    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
                    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
                    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
                    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
                };
                return tiny[char.toLowerCase()] || char;
            }).join("");

        // Stylish box menu
        const msg = `
╔═══════════════════════
║  『 ${toTinyCap("vortex Status")} 』
╠═══════════════════════
║ 👤 User      : ${pushname}
║ 🕓 Time      : ${currentTime}
║ 📆 Date      : ${currentDate}
║ 🧭 Uptime    : ${uptime}
║ ⚙️ Mode      : ${config.MODE}
║ 🔰 Version   : ${config.version}
║ 💻 Owner     : 𝚖𝚡𝚐𝚊𝚖𝚎𝚌𝚘𝚍𝚎𝚛
║ 🤖 Bot Name  : vortex
╠═══════════════════════
║ 🌟 Keep this session safe
║ 🔗 Forever respected 💀
╚═══════════════════════
        `.trim();

        await malvin.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: msg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'Subscribe to mx Newsletter',
                    body: 'Click to visit',
                    mediaType: 2,
                    thumbnailUrl: ALIVE_IMG,
                    mediaUrl: 'https://chat.whatsapp.com/DXasbP5xOeT77AmzaPykEw' // Your newsletter link
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("Error in .alive2:", err);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});
