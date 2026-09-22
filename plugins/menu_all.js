const fs = require('fs');
const path = require('path');
const config = require('../settings');
const moment = require('moment-timezone');
const { malvin, commands } = require('../malvin');
const { runtime } = require('../lib/functions');
const os = require('os');
const { getPrefix } = require('../lib/prefix');

const DEFAULT_MENU_IMAGE = fs.readFileSync(path.join(__dirname, '..', 'assets', 'default-menu.jpeg'));

// Stylize uppercase letters
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

// Normalize category names
const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

// Emoji map for categories
const emojiByCategory = {
  ai: '🤖',
  anime: '🍥',
  audio: '🎧',
  bible: '📖',
  download: '⬇️',
  downloader: '📥',
  fun: '🎮',
  game: '🕹️',
  group: '👥',
  img_edit: '🖌️',
  info: 'ℹ️',
  information: '🧠',
  logo: '🖼️',
  main: '🏠',
  media: '🎞️',
  menu: '📜',
  misc: '📦',
  music: '🎵',
  other: '📁',
  owner: '👑',
  privacy: '🔒',
  search: '🔎',
  settings: '⚙️',
  sticker: '🌟',
  tools: '🛠️',
  user: '👤',
  utilities: '🧰',
  utility: '🧮',
  wallpapers: '🖼️',
  whatsapp: '📱',
};

malvin({
  pattern: 'vortex',
  alias: ['allmenu', 'vortex', 'vortexmenu'],
  desc: 'Show bot commands',
  category: 'menu',
  react: '👌',
  filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();
    const timezone = config.TIMEZONE || 'Africa/Nigeria';
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menu = `
╭━━━[ VORTEX ]━━━╮
│ User: @${sender.split('@')[0]}
│ Uptime: ${uptime()}
│ Mode: ${config.MODE}
│ Prefix: ${config.PREFIX}
│ Commands: ${commands.length}
╰━━━━━━━━━━━━━━╯

`;

    const categories = {};
    for (const cmd of commands) {
      if (cmd.category && !cmd.dontAdd && cmd.pattern) {
        const normalizedCategory = normalize(cmd.category);
        categories[normalizedCategory] = categories[normalizedCategory] || [];
        categories[normalizedCategory].push(cmd.pattern.split('|')[0]);
      }
    }

    for (const cat of Object.keys(categories).sort()) {
      menu += `╭─ ${cat.toUpperCase()} ─╮\n`;
      menu += categories[cat].sort().map(cmd => `│ ${prefix}${cmd}`).join('\n');
      menu += '\n╰━━━━━━━━━━━━━━╯\n';
    }

    // Context info for image message
    const imageContextInfo = {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: config.NEWSLETTER_JID || '0029Vb7Ew0t8fewhGUdO1J0s@newsletter',
        newsletterName: 'mxgamecoder',
        serverMessageId: 143
      }
    };

    // Send menu image
    await malvin.sendMessage(
      from,
      {
        image: config.MENU_IMAGE_URL ? fs.readFileSync(config.MENU_IMAGE_URL) : DEFAULT_MENU_IMAGE,
        caption: menu,
        contextInfo: imageContextInfo
      },
      { quoted: mek }
    );

    // Send audio if configured
    if (config.MENU_AUDIO_URL) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await malvin.sendMessage(
        from,
        {
          audio: { url: config.MENU_AUDIO_URL },
          mimetype: 'audio/mp4',
          ptt: true,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'mxgamecoder',
              serverMessageId: 143
            }
          }
        },
        { quoted: mek }
      );
    }

  } catch (e) {
    console.error('Menu Error:', e.message);
    await reply(`❌ ${toUpperStylized('Error')}: Failed to show menu.\n${toUpperStylized('Details')}: ${e.message}`);
  }
});
