const { malvin } = require('../malvin');
const axios = require('axios');
const https = require('https');
const Config = require('../settings');

// Configure axios with better timeout and retry settings
const apiClient = axios.create({
  timeout: 30000,
  httpsAgent: new https.Agent({ 
    rejectUnauthorized: false,
    maxFreeSockets: 1,
    keepAlive: false
  }),
  maxRedirects: 2
});

malvin(
    {
        pattern: 'series',
        alias: ['tvdl', 'episode'],
        desc: 'TV series episode downloader',
        category: 'media',
        react: '📺',
        use: '<series> <season> <episode>',
        filename: __filename,
    },
    async (malvin, mek, m, { text, reply }) => {
        try {
            // Input validation
            if (!text) return reply(`📺 *Usage:* ${Config.PREFIX}seriesdl <series> <season> <episode>\nExample: ${Config.PREFIX}seriesdl "Money Heist" 1 1`);

            await malvin.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });

            // Parse input (supports both formats)
            let seriesName, seasonNum, episodeNum;
            
            // Format 1: "series S01E01"
            const seasonEpisodeMatch = text.match(/(.+?)\s*s(\d+)e(\d+)/i);
            if (seasonEpisodeMatch) {
                seriesName = seasonEpisodeMatch[1];
                seasonNum = seasonEpisodeMatch[2].padStart(2, '0');
                episodeNum = seasonEpisodeMatch[3].padStart(2, '0');
            } 
            // Format 2: "series 1 1"
            else {
                const parts = text.trim().split(/\s+/);
                if (parts.length >= 3) {
                    seriesName = parts.slice(0, -2).join(' ');
                    seasonNum = parts[parts.length-2].padStart(2, '0');
                    episodeNum = parts[parts.length-1].padStart(2, '0');
                }
            }

            if (!seriesName || !seasonNum || !episodeNum) {
                return reply('📺 *Invalid format!* Use:\n.seriesdl <series> <season> <episode>\nOR\n.seriesdl <series> S01E01');
            }

            // API request
            const apiUrl = `https://draculazyx-xyzdrac.hf.space/api/Movie/episode?query=${encodeURIComponent(`${seriesName} S${seasonNum}EP${episodeNum}`)}`;
            const { data } = await apiClient.get(apiUrl);

            if (!data?.download_link) {
                return reply('📺 *Episode not found!* Check your inputs or try another series');
            }

            // Prepare and send episode info
            const cleanTitle = data.title.replace(/\s*\|\s*TV Series.*$/i, '').trim();
            const fileName = data.download_link.split('/').pop() || `${seriesName}_S${seasonNum}E${episodeNum}.mkv`;
            
            const episodeInfo = {
                text: `📺 *${cleanTitle}*\n\n` +
                      `🔄 S${seasonNum}E${episodeNum}\n` +
                      `🔗 ${data.download_link}\n\n` +
                      `> made by vortex`,
                contextInfo: {
                    externalAdReply: {
                        title: cleanTitle,
                        body: `Season ${seasonNum} • Episode ${episodeNum}`,
                        thumbnailUrl: 'https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png',
                        mediaType: 1,
                        sourceUrl: data.download_link
                    }
                }
            };
            await malvin.sendMessage(mek.chat, episodeInfo, { quoted: mek });

            // Now send the video file
            try {
                const videoResponse = await axios.get(data.download_link, {
                    responseType: 'arraybuffer',
                    timeout: 60000,
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });

                await malvin.sendMessage(mek.chat, {
                    video: videoResponse.data,
                    caption: `📺 ${cleanTitle} - S${seasonNum}E${episodeNum}`,
                    fileName: fileName,
                    mimetype: 'video/mp4'
                });

                await malvin.sendMessage(mek.chat, { react: { text: "✅", key: mek.key } });
            } catch (downloadError) {
                console.error('Download failed:', downloadError);
                await malvin.sendMessage(mek.chat, { react: { text: "⚠️", key: mek.key } });
                reply('📺 *Video send failed!* Use the provided download link instead');
            }

        } catch (error) {
            console.error('SeriesDL Error:', error);
            await malvin.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
            reply('📺 *Error:* ' + (error.message || 'Check console for details'));
        }
    }
);

