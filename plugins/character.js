const { Module } = require("../main");
const axios = require("axios");
const config = require("../config");

const isPrivateBot = config.MODE !== "public";
const BRAND = config.BRAND || "👑 Kira X Achu Bot";

Module(
  {
    pattern: "char ?(.*)",
    fromMe: isPrivateBot,
    desc: "Search anime character",
    usage: ".char <name>",
  },

  async (message, match) => {
    const query = match[1]?.trim();

    if (!query) {
      return await message.sendReply(
        `❌ *Missing Query!*\n\n👉 Example: .char kakashi\n\n⚡ ${BRAND}`
      );
    }

    try {
      const res = await axios.get(
        `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`
      );

      const ch = res.data.data?.[0];

      if (!ch) {
        return await message.sendReply(
          `❌ *Character Not Found!*\n\nTry another name 😭\n\n⚡ ${BRAND}`
        );
      }

      let txt = `
╭━━━〔 👤 *CHARACTER INFO* 〕━━━⬣

📛 *Name:* ${ch.name || "N/A"}
🎌 *Anime:* ${ch.anime?.[0]?.anime?.title || "Unknown"}
❤️ *Favorites:* ${ch.favorites || "N/A"}

━━━━━━━━━━━━━━━
📝 *About:*
${ch.about ? ch.about.substring(0, 500) + "..." : "No info available"}

╰━━━━━━━━━━━━━━⬣
⚡ ${BRAND}
`;

      await message.sendReply(txt.trim());

    } catch (err) {
      console.log("Character error:", err);

      await message.sendReply(
        `⚠️ *Error Occurred!*\n\nFailed to fetch character 😭\n\n⚡ ${BRAND}`
      );
    }
  }
);