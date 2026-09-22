const fetch = require('node-fetch');
const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Show vortex GitHub repository information",
    react: "✨",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {

    const githubRepoURL = config.REPO || "https://github.com/mxgamecoder/vortex";
    const imageURL = "https://i.ibb.co/Q7Lv5JBk/zenitsu-agatsuma-3840x2160-24472.png";
    const botName = "mxgamecoder";
    const ownerName = "mxgamecoder";

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/i);
        if (!match) return reply("❌ Invalid GitHub repository URL.");

        const [, username, repoName] = match;

        let repoData = null;
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
                headers: { 'User-Agent': 'vortex-bot', 'Accept': 'application/vnd.github+json' }
            });
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
            repoData = await response.json();
        } catch (apiErr) {
            console.warn('Repo API fallback triggered:', apiErr.message);
            try {
                const rawUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/package.json`;
                const rawRes = await fetch(rawUrl, { headers: { 'User-Agent': 'vortex-bot' } });
                if (rawRes.ok) {
                    const rawPkg = await rawRes.json();
                    repoData = {
                        html_url: githubRepoURL,
                        stargazers_count: 'N/A',
                        forks_count: 'N/A',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        version: rawPkg.version || 'N/A'
                    };
                }
            } catch (_) {}
        }

        if (!repoData) {
            repoData = {
                html_url: githubRepoURL,
                stargazers_count: 'N/A',
                forks_count: 'N/A',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 'N/A'
            };
        }

        const stars = repoData.stargazers_count || 'N/A';
        const forks = repoData.forks_count || 'N/A';
        const repoLink = repoData.html_url || githubRepoURL;
        const version = repoData.version || 'N/A';

        const releaseDate = repoData.created_at ? new Date(repoData.created_at).toLocaleDateString() : 'N/A';
        const lastUpdate = repoData.updated_at ? new Date(repoData.updated_at).toLocaleDateString() : 'N/A';

        const caption = `
*👋 HELLO, THIS IS ${botName}*

🚀 *Official GitHub Repository*
━━━━━━━━━━━━━━━
⭐ *Stars:* ${stars}
🍴 *Forks:* ${forks}
📦 *Version:* ${version}
📅 *Release Date:* ${releaseDate}
♻️ *Last Update:* ${lastUpdate}
👤 *Owner:* ${ownerName}
🔗 *Repository:* ${repoLink}
━━━━━━━━━━━━━━━
✨ _Powered by ${ownerName}_
`;

        const imgRes = await fetch(imageURL);
        if (!imgRes.ok) throw new Error("Failed to load image");
        const imageBuffer = await imgRes.buffer();

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "0029Vb7Ew0t8fewhGUdO1J0s@newsletter",
                    newsletterName: "vortex Updates",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Repo Command Error:", err);
        const fallbackCaption = `
*👋 HELLO, THIS IS mxgamecoder*

🚀 *Official GitHub Repository*
━━━━━━━━━━━━━━━
👤 *Owner:* mxgamecoder
🔗 *Repository:* ${config.REPO || 'https://github.com/mxgamecoder/vortex'}
━━━━━━━━━━━━━━━
✨ _Powered by mxgamecoder_
`;
        reply(fallbackCaption);
    }
});
