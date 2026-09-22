const config = require('../settings');
const { malvin } = require('../malvin');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 
const converter = require('../data/play-converter');
const fetch = require('node-fetch');
const ytSearch = require('yt-search');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const osCallbacks = require('os');

const streamPipeline = promisify(pipeline);
const tmpDir = osCallbacks.tmpdir();

function toFancyFont(text) {
  const fonts = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ",
    i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
    q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
    y: "ʏ", z: "ᴢ"
  };
  return text.toLowerCase().split("").map(char => fonts[char] || char).join("");
}

// ===================== PlayX Command =====================
malvin({ 
    pattern: "playx", 
    alias: ["yta"], 
    react: "☘️", 
    desc: "Download YouTube song via vortex API", 
    category: "main", 
    use: '.play2 <query or youtube url>', 
    filename: __filename 
}, async (malvin, mek, m, { from, q, reply, react: doReact }) => { 
    try {
        if (!q) return reply("*ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴏɴɢ ɴᴀᴍᴇ ᴏʀ ʏᴏᴜᴛᴜʙᴇ ʟɪɴᴋ.*");

        let ytUrl = '';
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(q)) {
            ytUrl = q.trim();
        } else {
            const yt = await ytsearch(q);
            if (!yt.results.length) return reply("ɴᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ!");
            ytUrl = yt.results[0].url;
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(q)}`;
        const apiResponse = await fetch(apiUrl);
        
        if (apiResponse.ok) {
            const data = await apiResponse.json();
            if (data.status && data.result.download_url) {
                const songInfo = `
${toFancyFont("*vortex*")} sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ by mxgamecoder
${toFancyFont("*Title*")}: ${data.result.title}
${toFancyFont("*URL*")}: ${data.result.video_url}
`;
                await malvin.sendMessage(from, { text: songInfo, viewOnce: true }, { quoted: mek });

                const safeTitle = data.result.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
                const filePath = `${tmpDir}/${safeTitle}.mp3`;
                
                const downloadResponse = await fetch(data.result.download_url);
                if (!downloadResponse.ok) throw new Error(`Download failed: ${downloadResponse.status}`);
                
                const fileStream = fs.createWriteStream(filePath);
                await streamPipeline(downloadResponse.body, fileStream);

                await malvin.sendMessage(from, {
                    audio: { url: filePath },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: `${safeTitle}.mp3`
                }, { quoted: mek });

                setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 5000);
                await doReact("✅");
                return;
            }
        }

        // Fallback API
        const jawadApiUrl = `https://jawad-tech.vercel.app/download/ytmp3?url=${encodeURIComponent(ytUrl)}`;
        const res = await fetch(jawadApiUrl);
        const data = await res.json();

        if (!data?.result) {
            await doReact("❌");
            return reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
        }

        const audioRes = await fetch(data.result);
        const audioBuffer = await audioRes.buffer();
        const convertedAudio = await converter.toAudio(audioBuffer, 'mp4');

        await malvin.sendMessage(from, {
            audio: convertedAudio,
            mimetype: "audio/mpeg",
            fileName: `${data.metadata?.title || 'song'}.mp3`
        }, { quoted: mek });

        await doReact("✅");

    } catch (error) {
        console.error(error);
        await doReact("❌");
        reply("ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.");
    }
});

// ===================== Play3 / YT Audio =====================
malvin({
    pattern: "play3",
    alias: ["youtube", "song3"],
    react: "🎵",
    desc: "Download high quality YouTube audio",
    category: "media",
    use: "<song name>",
    filename: __filename
}, async (malvin, mek, m, { from, q, reply, react: doReact, sender }) => {
    try {
        if (!q) return reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ a sᴏɴɢ ɴᴀᴍᴇ");

        await malvin.sendMessage(from, { 
            text: `*vortex* ${toFancyFont("Searching for")} "${q}"`,
            viewOnce: true
        }, { quoted: mek });

        const searchResults = await ytSearch(q);
        if (!searchResults.videos.length) {
            await doReact("❌");
            return reply(`${toFancyFont("No tracks found")}`);
        }

        const song = searchResults.videos[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(q)}`;
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        if (!data.status || !data.result.download_url) throw new Error('Invalid API response');

        const caption =
`${toFancyFont("*vortex*")} sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ by mxgamecoder
┏─────────────⊷
┇๏ *ᴛɪᴛʟᴇ*    –  ${data.result.title || song.title}
┇๏ *ᴅᴜʀᴀᴛɪᴏɴ* –  ${song.timestamp}
┇๏ *ᴠɪᴇᴡs*    –  ${song.views.toLocaleString()}
┇๏ *ᴀᴜᴛʜᴏʀ*   –  ${song.author.name}
┇๏ *ᴜʀʟ*     –  ${data.result.video_url || song.url}
┗──────────────⊷
> *Downloading audio file*`;

        await malvin.sendMessage(from, { image: { url: song.thumbnail }, caption, viewOnce: true }, { quoted: mek });

        const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
        const filePath = `${tmpDir}/${safeTitle}.mp3`;

        const downloadResponse = await fetch(data.result.download_url);
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);

        await malvin.sendMessage(from, {
            audio: { url: filePath },
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${safeTitle}.mp3`
        }, { quoted: mek });

        setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 5000);
        await doReact("✅");

    } catch (error) {
        console.error('Play3 command error:', error);
        await malvin.sendMessage(from, {
            text: `*vortex* ${toFancyFont("error! Try again")}`,
            viewOnce: true
        }, { quoted: mek });
        await doReact("❌");
    }
});

// ===================== Lyrics Button Handler =====================
const handleButtons = async (malvin, mek, m, { from, reply }) => {
    if (m.buttonId?.startsWith('getlyrics_')) {
        try {
            const songTitle = decodeURIComponent(m.buttonId.replace('getlyrics_', ''));
            await malvin.sendMessage(from, { text: `🔍 Searching lyrics for *${songTitle}*...` }, { quoted: mek });

            const lyricsApi = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(songTitle)}`;
            const response = await fetch(lyricsApi);
            const data = await response.json();

            if (data.status && data.result) {
                await malvin.sendMessage(from, { text: `🎶 *${songTitle}*\n\n${data.result.lyrics}\n\n_Lyrics provided by GiftedTech API_` }, { quoted: mek });
            } else {
                await malvin.sendMessage(from, { text: `❌ No lyrics found for *${songTitle}*` }, { quoted: mek });
            }
        } catch (e) {
            await malvin.sendMessage(from, { text: `⚠️ Failed to fetch lyrics: ${e.message}` }, { quoted: mek });
        }
    }
};

module.exports = {
    malvin,
    handleButtons
};
