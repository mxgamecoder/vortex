const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show bot command menu",
    category: "menu",
    react: "⚡",
    filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
    try {
        const dec = `
╭━❰ ⚡ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐌𝐃 ⚡ ❱━╮
│ • .play      - Download audio from YouTube
│ • .song      - Download song from YouTube
│ • .apk       - Download APK from Play Store
│ • .video     - Download video from YouTube
│ • .fb        - Download video from Facebook
│ • .tk        - Download video from TikTok
│ • .ig        - Download video from Instagram
│ • .gdrive    - Download files from Google Drive
│ • .twitter   - Download video from Twitter
│ • .img       - Download image
│ • .drama     - Download full episode video
│ • .play2     - Download audio (alt)
│ • .video2    - Download video (alt)
│ • .baiscope  - Download video from Baiscope
│ • .mfire     - Download MediaFire files
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━❰ 🌸 𝐀𝐍𝐈𝐌𝐄 𝐂𝐌𝐃 🌸 ❱━╮
│ • .yts        - Search YouTube videos
│ • .king       - Info about "King"
│ • .dog        - Random dog images
│ • .anime      - Anime pictures
│ • .animegirl  - Anime girl pictures
│ • .loli       - Romantic anime pics
╰━━━━━━━━━━━━━━━━━━━━╯

╭━❰ ℹ️ 𝐈𝐍𝐅𝐎 𝐂𝐌𝐃 ℹ️ ❱━╮
│ • .alive      - Check if bot is online
│ • .ping       - Check bot speed
│ • .vortex     - Show main menu
│ • .ai         - Chat with AI bot
│ • .system     - Bot system status
│ • .owner      - Owner info
│ • .status     - Bot runtime info
│ • .about      - About this bot
│ • .list       - Show command list
│ • .script     - Bot repository link
╰━━━━━━━━━━━━━━━━━━━━╯

╭━❰ 🎲 𝐎𝐓𝐇𝐄𝐑 𝐂𝐌𝐃 🎲 ❱━╮
│ • .joke         - Random joke
│ • .fact         - Random fact
│ • .githubstalk  - GitHub user info
│ • .gpass        - Generate strong password
│ • .hack         - Prank friends
│ • .srepo        - Search repos
│ • .define       - Search word meanings
╰━━━━━━━━━━━━╯

╭━❰ 👥 𝐆𝐑𝐎𝐔𝐏 𝐂𝐌𝐃 👥 ❱━╮
│ • .mute        - Mute group
│ • .unmute      - Unmute group
│ • .left        - Bot leaves group
│ • .remove      - Remove member
│ • .add         - Add member
│ • .kick        - Kick user
│ • .kickall     - Remove all members
│ • .promote     - Make admin
│ • .demote      - Remove admin
│ • .tagall      - Mention all
│ • .setgoodbye  - Leave message
│ • .setwelcome  - Welcome message
│ • .ginfo       - Group info
╰━━━━━━━━━━━━╯

╭━❰ 👑 𝐎𝐖𝐍𝐄𝐑 𝐂𝐌𝐃 👑 ❱━╮
│ • .update    - Update bot version
│ • .restart   - Restart bot
│ • .settings  - View settings
│ • .block     - Block user
│ • .unblock   - Unblock user
│ • .shutdown  - Shutdown bot
│ • .setpp     - Update profile pic
╰━━━━━━━━━━━━╯

╭━❰ 🔄 𝐂𝐎𝐍𝐕𝐄𝐑𝐓 𝐂𝐌𝐃 🔄 ❱━╮
│ • .sticker  - Photo to sticker
│ • .tts      - Text to speech
│ • •trt      - Change bot language
╰━━━━━━━━━━━━╯

${config.DESCRIPTION || ""}
        `.trim();

        await malvin.sendMessage(
            from,
            {
                image: { url: "https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png" },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '0029Vb7Ew0t8fewhGUdO1J0s@newsletter',
                        newsletterName: 'vortex',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred: ${e.message || e}`);
    }
});
