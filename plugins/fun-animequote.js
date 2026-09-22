const axios = require('axios');
const { malvin } = require('../malvin');
const Config = require('../settings');


// Anime Quotes Plugin (With Thumbnail)
malvin({
    pattern: "animequote",
    alias: ["aquote", "aniquote"],
    desc: "Get random anime quotes",
    category: "fun",
    react: "🌸",
    filename: __filename
}, async (malvin, mek, m, { reply }) => {
    try {
        await malvin.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });

        const response = await axios.get('https://draculazyx-xyzdrac.hf.space/api/aniQuotes');
        const quote = response.data;

        if (!quote.SUCCESS) return reply("❌ Failed to fetch anime quote");

        const quoteText = `🌸 *${quote.MESSAGE.anime}*\n\n"${quote.MESSAGE.quote}"\n\n- ${quote.MESSAGE.author}\n\n> made by vortex`;

        await malvin.sendMessage(mek.chat, { 
            image: { url: 'https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png' }, // Anime thumbnail
            caption: quoteText,
            contextInfo: {
                externalAdReply: {
                    title: quote.MESSAGE.anime,
                    body: "Random Anime Quote",
                    thumbnail: await getImageBuffer('https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png'),
                    mediaType: 1,
                    mediaUrl: "https://myanimelist.net/",
                    sourceUrl: "https://myanimelist.net/"
                }
            }
        }, { quoted: mek });

        await malvin.sendMessage(mek.chat, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Anime quote error:", error);
        await malvin.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
        reply("❌ Error fetching anime quote. Please try again later.");
    }
});

// Helper function to get image buffer
async function getImageBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch {
        return null;
    }
}
