// ==========================
// Required Modules
// ==========================
const config = require('../settings');
const { malvin } = require('../malvin');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

// ==========================
// Constants
// ==========================
const REPLY_MSGS = {
  onlyGroup: '❌ This command can only be used in groups.',
  onlyAdmins: '❌ Only group admins can use this command.',
  botNotAdmin: '❌ I need to be an admin to use this command.',
  onlyOwner: '❌ Only the bot owner can use this command.',
  noUser: '❌ Please reply to a message, mention a user, or provide a number.',
  invalidTime: '*Select:*\nsecond\nminute\nhour\n\n*Example*\n10 second',
};

// ==========================
// Helper: Custom Message Sender
// ==========================
const sendCustomMessage = async (malvin, from, message, mek, mentions = []) => {
  try {
    await malvin.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png' },
      caption: message,
      contextInfo: {
        mentionedJid: mentions.length ? mentions : [mek.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.NEWSLETTER_JID || '0029Vb7Ew0t8fewhGUdO1J0s@newsletter',
          newsletterName: 'vortex',
          serverMessageId: 143,
        },
      },
    }, { quoted: mek });
  } catch (err) {
    console.error('Error in sendCustomMessage:', err);
    await malvin.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
  }
};

// ==========================
// Middleware: Permission Checks
// ==========================
const checkPermissions = async (malvin, mek, { from, isGroup, isAdmins, isBotAdmins, isCreator, senderNumber }, options = {}) => {
  const { requireGroup = true, requireAdmin = false, requireBotAdmin = false, requireOwner = false } = options;
  const botOwner = malvin.user.id.split(':')[0];

  if (requireGroup && !isGroup) {
    await sendCustomMessage(malvin, from, REPLY_MSGS.onlyGroup, mek);
    return false;
  }
  if (requireAdmin && !isAdmins && !isCreator) {
    await sendCustomMessage(malvin, from, REPLY_MSGS.onlyAdmins, mek);
    return false;
  }
  if (requireBotAdmin && !isBotAdmins) {
    await sendCustomMessage(malvin, from, REPLY_MSGS.botNotAdmin, mek);
    return false;
  }
  if (requireOwner && senderNumber !== botOwner) {
    await sendCustomMessage(malvin, from, REPLY_MSGS.onlyOwner, mek);
    return false;
  }
  return true;
};

// ==========================
// Helper: Extract Target User
// ==========================
const extractTargetUser = (m, q, botNumber) => {
  let number;
  if (m.quoted) {
    number = m.quoted.sender.split('@')[0];
  } else if (q && q.includes('@')) {
    number = q.replace(/[@\s]/g, '');
  } else if (q && /^\d+$/.test(q)) {
    number = q;
  }
  if (!number) return null;
  const jid = number + '@s.whatsapp.net';
  if (jid === botNumber) return null; // Prevent self-targeting
  return jid;
};

// ==========================
// Kick/Remove Command
// ==========================
malvin({
  pattern: 'kick',
  alias: ['k', 'remove', 'nital'],
  desc: 'Remove a user from the group',
  category: 'group',
  react: '✅',
  filename: __filename,
}, async (malvin, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, quoted, q, botNumber, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, isCreator, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    const user = extractTargetUser(m, q, botNumber);
    if (!user) return await sendCustomMessage(malvin, from, REPLY_MSGS.noUser, mek);
    if (user === malvin.user.id.split(':')[0] + '@s.whatsapp.net') return await sendCustomMessage(malvin, from, '👑 That’s the owner! I can’t remove them.', mek);

    await malvin.groupParticipantsUpdate(from, [user], 'remove');
    await sendCustomMessage(malvin, from, `*✅ Successfully removed @${user.split('@')[0]} from group.*`, mek, [user]);
  } catch (err) {
    console.error('Kick command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to remove user: ${err.message}`, mek);
  }
});

// ==========================
// Promote Command
// ==========================
malvin({
  pattern: 'promote',
  alias: ['p', 'giveadmin', 'makeadmin'],
  desc: 'Promote a user to admin',
  category: 'group',
  react: '✅',
  filename: __filename,
}, async (malvin, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, quoted, q, botNumber, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, isCreator, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    const user = extractTargetUser(m, q, botNumber);
    if (!user) return await sendCustomMessage(malvin, from, REPLY_MSGS.noUser, mek);
    if (user === malvin.user.id.split(':')[0] + '@s.whatsapp.net') return await sendCustomMessage(malvin, from, '👑 Owner is already super admin!', mek);

    await malvin.groupParticipantsUpdate(from, [user], 'promote');
    await sendCustomMessage(malvin, from, `*✅ Successfully promoted @${user.split('@')[0]} to admin.*`, mek, [user]);
  } catch (err) {
    console.error('Promote command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to promote user: ${err.message}`, mek);
  }
});

// ==========================
// Demote Command
// ==========================
malvin({
  pattern: 'demote',
  alias: ['d', 'dismiss', 'removeadmin'],
  desc: 'Demote a group admin',
  category: 'group',
  react: '✅',
  filename: __filename,
}, async (malvin, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, quoted, q, botNumber, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, isCreator, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    const user = extractTargetUser(m, q, botNumber);
    if (!user) return await sendCustomMessage(malvin, from, REPLY_MSGS.noUser, mek);
    if (user === malvin.user.id.split(':')[0] + '@s.whatsapp.net') return await sendCustomMessage(malvin, from, '👑 I can’t demote the owner!', mek);

    await malvin.groupParticipantsUpdate(from, [user], 'demote');
    await sendCustomMessage(malvin, from, `*✅ Successfully demoted @${user.split('@')[0]} to a normal member.*`, mek, [user]);
  } catch (err) {
    console.error('Demote command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to demote user: ${err.message}`, mek);
  }
});

// ==========================
// Leave Group Command
// ==========================
malvin({
  pattern: 'leave',
  alias: ['left', 'leftgc', 'leavegc', 'exit'],
  desc: 'Leave the group',
  react: '👋',
  category: 'owner',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, senderNumber }, { requireGroup: true, requireOwner: true }))) return;

    await sendCustomMessage(malvin, from, 'Leaving group...', mek);
    await sleep(1500);
    await malvin.groupLeave(from);
  } catch (err) {
    console.error('Leave command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Add Member Command
// ==========================
malvin({
  pattern: 'add',
  alias: ['a', 'invite'],
  desc: 'Adds a member to the group',
  category: 'group',
  react: '➕',
  filename: __filename,
}, async (malvin, mek, m, { from, q, isGroup, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isBotAdmins, senderNumber }, { requireGroup: true, requireBotAdmin: true, requireOwner: true }))) return;

    const user = extractTargetUser(m, q, malvin.user.id);
    if (!user) return await sendCustomMessage(malvin, from, REPLY_MSGS.noUser, mek);

    await malvin.groupParticipantsUpdate(from, [user], 'add');
    await sendCustomMessage(malvin, from, `✅ Successfully added @${user.split('@')[0]}`, mek, [user]);
  } catch (err) {
    console.error('Add command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to add member: ${err.message}`, mek);
  }
});

// ==========================
// Unmute Group Command
// ==========================
malvin({
  pattern: 'unmute',
  alias: ['groupunmute', 'open', 'unlock'],
  react: '🔊',
  desc: 'Unmute the group (Everyone can send messages).',
  category: 'group',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    await malvin.groupSettingUpdate(from, 'not_announcement');
    await sendCustomMessage(malvin, from, '✅ Group has been unmuted. Everyone can send messages.', mek);
  } catch (err) {
    console.error('Unmute command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to unmute group: ${err.message}`, mek);
  }
});

// ==========================
// Close Group Command
// ==========================
malvin({
  pattern: 'lockgc',
  alias: ['lock', 'close', 'mute', 'closegc'],
  react: '🔒',
  desc: 'Close the group chat (only admins can send messages).',
  category: 'group',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    await malvin.groupSettingUpdate(from, 'announcement');
    await sendCustomMessage(malvin, from, '✅ Group chat has been closed. Only admins can send messages.', mek);
  } catch (err) {
    console.error('Lock command error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to close group: ${err.message}`, mek);
  }
});

// ==========================
// Update Group Description Command
// ==========================
malvin({
  pattern: 'updategdesc',
  alias: ['upgdesc', 'gdesc'],
  react: '📜',
  desc: 'Change the group description.',
  category: 'group',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;
    if (!q) return await sendCustomMessage(malvin, from, '❌ Please provide a new group description.', mek);

    await malvin.groupUpdateDescription(from, q);
    await sendCustomMessage(malvin, from, '✅ Group description has been updated.', mek);
  } catch (err) {
    console.error('Update description error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to update group description: ${err.message}`, mek);
  }
});

// ==========================
// Update Group Name Command
// ==========================
malvin({
  pattern: 'updategname',
  alias: ['upgname', 'gname'],
  react: '📝',
  desc: 'Change the group name.',
  category: 'group',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;
    if (!q) return await sendCustomMessage(malvin, from, '❌ Please provide a new group name.', mek);

    await malvin.groupUpdateSubject(from, q);
    await sendCustomMessage(malvin, from, `✅ Group name has been updated to: *${q}*`, mek);
  } catch (err) {
    console.error('Update name error:', err);
    await sendCustomMessage(malvin, from, `❌ Failed to update group name: ${err.message}`, mek);
  }
});

// ==========================
// Join Group Command
// ==========================
malvin({
  pattern: 'join',
  react: '📬',
  alias: ['joinme', 'f_join'],
  desc: 'Join a group via invite link',
  category: 'group',
  use: '.join <Group Link>',
  filename: __filename,
}, async (malvin, mek, m, { from, q, isCreator, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isCreator, senderNumber }, { requireOwner: true }))) return;
    if (!q || !q.includes('chat.whatsapp.com')) return await sendCustomMessage(malvin, from, '❌ Please provide a valid group invite link.', mek);

    const code = q.split('https://chat.whatsapp.com/')[1];
    if (!code) return await sendCustomMessage(malvin, from, '❌ Invalid group invite link.', mek);

    await malvin.groupAcceptInvite(code);
    await sendCustomMessage(malvin, from, '✔️ Successfully joined the group.', mek);
  } catch (err) {
    console.error('Join command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Get Group Invite Link Command
// ==========================
malvin({
  pattern: 'invite',
  react: '🖇️',
  alias: ['grouplink', 'glink'],
  desc: 'Get the group invite link',
  category: 'group',
  use: '.invite',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    const code = await malvin.groupInviteCode(from);
    await sendCustomMessage(malvin, from, `🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/${code}`, mek);
  } catch (err) {
    console.error('Invite command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Reset Group Invite Link Command
// ==========================
malvin({
  pattern: 'revoke',
  react: '🖇️',
  alias: ['revokegrouplink', 'resetglink', 'revokelink', 'f_revoke'],
  desc: 'Reset the group invite link',
  category: 'group',
  use: '.revoke',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    await malvin.groupRevokeInvite(from);
    await sendCustomMessage(malvin, from, '*Group link reset* ⛔', mek);
  } catch (err) {
    console.error('Revoke command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Hidetag Command
// ==========================
malvin({
  pattern: 'hidetag',
  alias: ['htag'],
  react: '🔊',
  desc: 'Tag all members with a message',
  category: 'group',
  use: '.hidetag <message>',
  filename: __filename,
}, async (malvin, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, participants, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;
    if (!q) return await sendCustomMessage(malvin, from, '❌ Please provide a message to send.', mek);

    await malvin.sendMessage(from, { text: q, mentions: participants.map(a => a.id) }, { quoted: mek });
  } catch (err) {
    console.error('Hidetag command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Tagall Command
// ==========================
malvin({
  pattern: 'tagall',
  desc: 'Tag all members with a heading and message',
  category: 'group',
  use: '.tagall <message>',
  filename: __filename,
}, async (malvin, mek, m, { from, q, isGroup, participants, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, senderNumber }, { requireGroup: true }))) return;
    if (!q) return await sendCustomMessage(malvin, from, '❌ Please provide a message to send.', mek);

    const header = '🔔 `Attention Everyone:`';
    const fullMsg = `${header}\n\n> ${q}\n\n© mxgamecoder`;
    await malvin.sendMessage(from, { text: fullMsg, mentions: participants.map(a => a.id) }, { quoted: mek });
  } catch (err) {
    console.error('Tagall command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Open Group by Time Command
// ==========================
malvin({
  pattern: 'opentime',
  react: '🔑',
  desc: 'Open group after a set time',
  category: 'group',
  use: '.opentime <time> <unit>',
  filename: __filename,
}, async (malvin, mek, m, { from, args, q, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    let timer;
    if (args[1] === 'second') timer = args[0] * 1000;
    else if (args[1] === 'minute') timer = args[0] * 60000;
    else if (args[1] === 'hour') timer = args[0] * 3600000;
    else if (args[1] === 'day') timer = args[0] * 86400000;
    else return await sendCustomMessage(malvin, from, REPLY_MSGS.invalidTime, mek);

    await sendCustomMessage(malvin, from, `_Group will automatically open after ${q}_`, mek);
    setTimeout(async () => {
      await malvin.groupSettingUpdate(from, 'not_announcement');
      await sendCustomMessage(malvin, from, '🔓 Good News! Group has been opened. Enjoy :)', mek);
    }, timer);
    await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });
  } catch (err) {
    console.error('Opentime command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Close Group by Time Command
// ==========================
malvin({
  pattern: 'closetime',
  react: '🔒',
  desc: 'Close group after a set time',
  category: 'group',
  use: '.closetime <time> <unit>',
  filename: __filename,
}, async (malvin, mek, m, { from, args, q, isGroup, isAdmins, isBotAdmins, senderNumber }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    let timer;
    if (args[1] === 'second') timer = args[0] * 1000;
    else if (args[1] === 'minute') timer = args[0] * 60000;
    else if (args[1] === 'hour') timer = args[0] * 3600000;
    else if (args[1] === 'day') timer = args[0] * 86400000;
    else return await sendCustomMessage(malvin, from, REPLY_MSGS.invalidTime, mek);

    await sendCustomMessage(malvin, from, `_Group will be automatically closed after ${q}_`, mek);
    setTimeout(async () => {
      await malvin.groupSettingUpdate(from, 'announcement');
      await sendCustomMessage(malvin, from, '🔐 Time’s Up! Group auto closed.', mek);
    }, timer);
    await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });
  } catch (err) {
    console.error('Closetime command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});

// ==========================
// Group Info Command
// ==========================
malvin({
  pattern: 'ginfo',
  react: '📌',
  alias: ['groupinfo'],
  desc: 'Get detailed group information',
  category: 'group',
  use: '.ginfo',
  filename: __filename,
}, async (malvin, mek, m, { from, isGroup, isAdmins, isBotAdmins, senderNumber, participants }) => {
  try {
    if (!(await checkPermissions(malvin, mek, { from, isGroup, isAdmins, isBotAdmins, senderNumber }, { requireGroup: true, requireAdmin: true, requireBotAdmin: true }))) return;

    const metadata = await malvin.groupMetadata(from);
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `➤ @${v.id.split('@')[0]}`).join('\n');
    const owner = metadata.owner || 'Unknown';
    let ppUrl = config.defaultImageUrl || 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
    try {
      ppUrl = await malvin.profilePictureUrl(from, 'image');
    } catch {}

    const gdata = `*━━━━━━━ GROUP INFO ━━━━━━━*

📛 *Name*: ${metadata.subject}
🆔 *JID*: ${metadata.id}
👥 *Members*: ${metadata.size}
👑 *Owner*: @${owner.split('@')[0]}
📝 *Description*: ${metadata.desc?.toString() || 'No description'}

*👮‍♂️ Admins List*:
${listAdmin}

*━━━━━━━━━━━━━━━━━━━*\n
> made by vortex`;

    await malvin.sendMessage(from, {
      image: { url: ppUrl },
      caption: gdata,
      mentions: groupAdmins.map(a => a.id),
    }, { quoted: mek });
  } catch (err) {
    console.error('Group info command error:', err);
    await sendCustomMessage(malvin, from, `❌ Error: ${err.message}`, mek);
  }
});