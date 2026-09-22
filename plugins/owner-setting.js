const { malvin, commands } = require('../malvin');
const { exec } = require('child_process');
const config = require('../settings');
const { sleep } = require('../lib/functions');

// 1. Shutdown Bot
malvin({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
}, async (malvin, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply("🛑 Shutting down vortex... Bye!").then(() => process.exit());
});

// 2. Broadcast Message to All Groups
malvin({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
}, async (malvin, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
    const message = args.join(' ');
    const groups = Object.keys(await malvin.groupFetchAllParticipating());
    for (const groupId of groups) {
        await malvin.sendMessage(groupId, { text: message }, { quoted: mek });
        await sleep(300); // throttle broadcast
    }
    reply("📢 Message successfully broadcasted to all groups.");
});

// 3. Set Profile Picture (Fixed)
malvin({
    pattern: "pp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
}, async (malvin, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const stream = await malvin.downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        await malvin.updateProfilePicture(malvin.user.id, buffer);
        reply("🖼️ Bot profile picture updated successfully!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Failed to update profile picture: ${error.message}`);
    }
});

// 4. Clear All Chats
malvin({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
}, async (malvin, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        const chats = Object.keys(malvin.chats);
        for (const jid of chats) {
            await malvin.modifyChat(jid, 'delete');
            await sleep(300);
        }
        reply("🧹 All chats cleared successfully!");
    } catch (error) {
        console.error("Error clearing chats:", error);
        reply(`❌ Error clearing chats: ${error.message}`);
    }
});

// 5. Group JIDs List
malvin({
    pattern: "gjid",
    desc: "List all group JIDs the bot is in.",
    category: "owner",
    react: "📝",
    filename: __filename
}, async (malvin, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    const groups = await malvin.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).map((jid, i) => `${i + 1}. ${jid}`).join('\n');
    reply(`📝 *Group JIDs List:*

${groupJids}`);
});

