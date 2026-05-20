const { Module } = require("../main");
const axios = require("axios");
const config = require("../config");

const isPrivateBot = config.MODE !== "public";

Module(
  {
    pattern: "anime ?(.*)",
    fromMe: isPrivateBot,
    desc: "Search anime info",
    usage: ".anime <anime name>",
  },

  async (message, match) => {
    const query = match[1]?.trim();

    if (!query) {
      return await message.sendReply(
        "❌ *Missing Query!*\n\n👉 Example: .anime death note"
      );
    }

    try {
      const res = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`
      );

      const anime = res.data.data?.[0];

      if (!anime) {
        return await message.sendReply(
          "❌ *Not Found!*\n\nNo anime matched your search 😭"
        );
      }

      const txt = `
╭━━━〔 🎌 *ANIME INFO* 〕━━━⬣

📺 *Title:* ${anime.title || "N/A"}
⭐ *Score:* ${anime.score || "N/A"}
🎬 *Episodes:* ${anime.episodes || "N/A"}
📡 *Status:* ${anime.status || "N/A"}
📅 *Year:* ${anime.year || "N/A"}
🎭 *Type:* ${anime.type || "N/A"}

━━━━━━━━━━━━━━━
📝 *Synopsis:*
${anime.synopsis ? anime.synopsis.slice(0, 500) + "..." : "N/A"}

╰━━━━━━━━━━━━━━⬣
👑 *Kira X Achu Bot*
`;

      await message.sendReply(txt.trim());

    } catch (err) {
      console.log("Anime error:", err);

      await message.sendReply(
        "⚠️ *Error Occurred!*\n\nFailed to fetch anime data 😭"
      );
    }
  }
);