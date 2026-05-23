const https = require('https');

const KEY = 'sb_publishable_rWk3eBI0m2wfWHN2DxVhag_slI3ZuJY';
const HOST = 'aihdjvjjwxolwjasssim.supabase.co';

function patch(table, id, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const opts = {
            hostname: HOST,
            path: `/rest/v1/${table}?id=eq.${id}`,
            method: 'PATCH',
            headers: {
                'apikey': KEY,
                'Authorization': 'Bearer ' + KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve({ status: res.statusCode, body: d }));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// 映射表：旧路径 → 新路径
const MAP = {
    // 微信图片
    'images/微信图片_20260328111059_564_4.jpg': '/images/wechat-img-20260328-564.jpg',
    'images/微信图片_20260328111053_563_4.jpg': '/images/wechat-img-20260328-563.jpg',
    'images/微信图片_20260328111259_565_4.png': '/images/wechat-img-20260328-565.png',
    'images/微信图片_20260328113429_570_4.png': '/images/wechat-img-20260328-570.png',
    'images/微信图片_20260328111408_566_4.png': '/images/wechat-img-20260328-566.png',
    'images/微信图片_20260328112006_568_4.png': '/images/wechat-img-20260328-568.png',
    // Snipaste
    'images/Snipaste_2026-03-23_21-04-16.png': '/images/snipaste-2026-03-23-21-04-16.png',
    'images/Snipaste_2026-03-23_21-04-30.png': '/images/snipaste-2026-03-23-21-04-30.png',
    'images/Snipaste_2026-03-23_21-04-44.png': '/images/snipaste-2026-03-23-21-04-44.png',
    'images/Snipaste_2026-03-28_11-57-54.png': '/images/snipaste-2026-03-28-11-57-54.png',
    'images/Snipaste_2026-03-28_11-58-58.png': '/images/snipaste-2026-03-28-11-58-58.png',
    'images/Snipaste_2026-03-28_13-36-19.png': '/images/snipaste-2026-03-28-13-36-19.png',
    'images/Snipaste_2026-03-28_13-38-26.png': '/images/snipaste-2026-03-28-13-38-26.png',
    'images/Snipaste_2026-03-28_14-01-15.png': '/images/snipaste-2026-03-28-14-01-15.png',
    'images/Snipaste_2026-03-28_16-15-49.png': '/images/snipaste-2026-03-28-16-15-49.png',
    'images/Snipaste_2026-03-28_16-17-35.png': '/images/snipaste-2026-03-28-16-17-35.png',
    'images/Snipaste_2026-03-28_16-17-55.png': '/images/snipaste-2026-03-28-16-17-55.png',
    'images/Snipaste_2026-03-28_16-18-14.png': '/images/snipaste-2026-03-28-16-18-14.png',
    'images/Snipaste_2026-03-28_16-18-57.png': '/images/snipaste-2026-03-28-16-18-57.png',
    'images/Snipaste_2026-03-29_23-23-30.png': '/images/snipaste-2026-03-29-23-23-30.png',
    'images/Snipaste_2026-03-29_23-23-59.png': '/images/snipaste-2026-03-29-23-23-59.png',
    'images/Snipaste_2026-03-29_23-24-12.png': '/images/snipaste-2026-03-29-23-24-12.png',
    'images/Snipaste_2026-03-29_23-24-28.png': '/images/snipaste-2026-03-29-23-24-28.png',
    'images/Snipaste_2026-03-30_18-58-36.png': '/images/snipaste-2026-03-30-18-58-36.png',
    'images/Snipaste_2026-03-30_20-27-19.png': '/images/snipaste-2026-03-30-20-27-19.png',
};

function fixArr(arr) {
    return arr.map(u => MAP[u] || u);
}

async function main() {
    const tasks = [
        // highlights
        patch('highlights', 1, { preview: ['/images/wechat-img-20260328-564.jpg', '/images/wechat-img-20260328-563.jpg'] }),
        patch('highlights', 2, { preview: ['/images/wechat-img-20260328-565.png', '/images/wechat-img-20260328-570.png'] }),
        patch('highlights', 3, { preview: [
            '/images/snipaste-2026-03-23-21-04-16.png',
            '/images/snipaste-2026-03-23-21-04-30.png',
            '/images/snipaste-2026-03-23-21-04-44.png',
            '/images/snipaste-2026-03-28-11-57-54.png',
            '/images/snipaste-2026-03-28-11-58-58.png',
            '/images/wechat-img-20260328-566.png',
            '/images/wechat-img-20260328-568.png'
        ]}),
        patch('highlights', 4, { preview: [
            '/images/snipaste-2026-03-30-18-58-36.png',
            '/images/snipaste-2026-03-28-16-15-49.png',
            '/images/snipaste-2026-03-28-16-17-35.png',
            '/images/snipaste-2026-03-28-16-17-55.png',
            '/images/snipaste-2026-03-28-16-18-14.png',
            '/images/snipaste-2026-03-28-16-18-57.png',
            '/images/snipaste-2026-03-29-23-23-30.png',
            '/images/snipaste-2026-03-29-23-23-59.png',
            '/images/snipaste-2026-03-29-23-24-12.png',
            '/images/snipaste-2026-03-29-23-24-28.png'
        ]}),
        // skills
        patch('skills', 1, { preview: [
            '/images/snipaste-2026-03-28-14-01-15.png',
            '/images/wechat-img-20260328-571.jpg',
            '/images/wechat-img-20260328-572.jpg'
        ]}),
        patch('skills', 2, { preview: [
            '/images/snipaste-2026-03-28-13-36-19.png',
            '/images/snipaste-2026-03-28-13-38-26.png'
        ]}),
        patch('skills', 3, { preview: [
            '/images/snipaste-2026-03-30-20-27-19.png'
        ]}),
        // ppt_works
        patch('ppt_works', 1, { image_url: '/images/snipaste-2026-03-23-21-04-16.png' }),
        patch('ppt_works', 2, { image_url: '/images/snipaste-2026-03-23-21-04-30.png' }),
        patch('ppt_works', 3, { image_url: '/images/snipaste-2026-03-23-21-04-44.png' }),
    ];

    const results = await Promise.all(tasks);
    results.forEach((r, i) => {
        const ok = r.status >= 200 && r.status < 300;
        console.log(`任务${i+1}: HTTP ${r.status} ${ok ? '✅' : '❌'}`);
    });
    console.log('\n全部完成！');
}

main().catch(console.error);
