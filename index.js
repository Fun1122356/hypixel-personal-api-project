// index.js
// 用于申请 Hypixel Personal API Key 的后端示例代码
const HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY; // 从环境变量中安全读取密钥
const API_URL = 'https://api.hypixel.net/v2/skyblock/bazaar';

async function fetchHypixelData() {
    if (!HYPIXEL_API_KEY) {
        console.error('错误：未设置 HYPIXEL_API_KEY 环境变量');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'API-Key': HYPIXEL_API_KEY
            }
        });

        // 处理速率限制 (Rate Limit)
        if (response.status === 429) {
            console.warn('警告：已达到请求速率限制，请稍后重试');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log('成功获取 Hypixel API 数据');
            return data.products;
        } else {
            console.error(`API 返回错误: ${data.cause}`);
        }

    } catch (error) {
        console.error('请求失败:', error.message);
    }
}

fetchHypixelData();
