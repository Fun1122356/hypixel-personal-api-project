// index.js
// 个人 Hypixel Discord 机器人
// 包含：10分钟内存缓存、速率限制处理、环境变量安全读取

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 内存缓存 (10分钟有效期)
const playerCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10分钟
const API_URL = 'https://api.hypixel.net/v2/player';

client.once('ready', () => {
    console.log(`✅ 机器人已上线: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!stats')) return;

    const args = message.content.split(' ');
    const playerName = args[1];
    
    if (!playerName) {
        return message.reply('请提供玩家 ID，例如：`!stats Notch`');
    }

    // 注意：实际开发中需要先通过 Mojang API 将玩家名转换为 UUID
    // 为了申请演示，这里假设直接使用 UUID 或简单查询逻辑
    const uuid = playerName; // 占位符

    // 1. 检查缓存
    if (playerCache.has(uuid)) {
        const cached = playerCache.get(uuid);
        if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return message.reply({ embeds: [buildEmbed(cached.data)] });
        }
    }

    // 2. 请求 Hypixel API
    try {
        const response = await fetch(`${API_URL}?uuid=${uuid}`, {
            headers: { 'API-Key': process.env.HYPIXEL_API_KEY }
        });

        if (response.status === 429) {
            return message.reply('⚠️ 请求过于频繁，请稍后再试。');
        }

        const data = await response.json();

        if (!data.success) {
            return message.reply(`❌ 查询失败: ${data.cause}`);
        }

        // 3. 写入缓存
        playerCache.set(uuid, { data: data.player, timestamp: Date.now() });
        
        // 4. 发送结果
        message.reply({ embeds: [buildEmbed(data.player)] });

    } catch (error) {
        console.error(error);
        message.reply('⚠️ 查询出错，请稍后再试。');
    }
});

// 构建 Discord 嵌入消息
function buildEmbed(playerData) {
    const embed = new EmbedBuilder()
        .setTitle(`📊 ${playerData.displayname} 的数据`)
        .setColor(0x00FF00)
        .addFields(
            { name: 'Bedwars 等级', value: playerData.stats?.Bedwars?.level || 'N/A', inline: true },
            { name: 'Skywars 等级', value: playerData.stats?.SkyWars?.level || 'N/A', inline: true }
        )
        .setTimestamp();
    return embed;
}

client.login(process.env.DISCORD_TOKEN);
