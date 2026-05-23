// fix-db-images.js - 修复 Supabase 数据库中所有旧图片路径
const https = require('https');

const KEY = 'sb_publishable_rWk3eBI0m2wfWHN2DxVhag_slI3ZuJY';
const HOST = 'aihdjvjjwxolwjasssim.supabase.co';

// 旧路径 → 新路径 完整映射表
const MAP = {
  // 微信图片系列（中文原名 → wechat-img 英文名）
  'images/微信图片_20260321160029_532_4.jpg':  '/images/wechat-img-20260321-532.jpg',
  'images/微信图片_20260328111053_563_4.jpg':  '/images/wechat-img-20260328-563.jpg',
  'images/微信图片_20260328111059_564_4.jpg':  '/images/wechat-img-20260328-564.jpg',
  'images/微信图片_20260328111259_565_4.png':  '/images/wechat-img-20260328-565.png',
  'images/微信图片_20260328111408_566_4.png':  '/images/wechat-img-20260328-566.png',
  'images/微信图片_20260328112006_568_4.png':  '/images/wechat-img-20260328-568.png',
  'images/微信图片_20260328113429_570_4.png':  '/images/wechat-img-20260328-570.png',
  'images/微信图片_20260328140240_571_4.jpg':  '/images/wechat-img-20260328-571.jpg',
  'images/微信图片_20260328140258_572_4.jpg':  '/images/wechat-img-20260328-572.jpg',
  'images/微信图片_20260330_579_4.png':        '/images/wechat-img-20260330-579.png',

  // Snipaste 系列（大写下划线 → 小写连字符）
  'images/Snipaste_2026-03-23_21-04-16.png':  '/images/snipaste-2026-03-23-21-04-16.png',
  'images/Snipaste_2026-03-23_21-04-30.png':  '/images/snipaste-2026-03-23-21-04-30.png',
  'images/Snipaste_2026-03-23_21-04-44.png':  '/images/snipaste-2026-03-23-21-04-44.png',
  'images/Snipaste_2026-03-28_11-57-54.png':  '/images/snipaste-2026-03-28-11-57-54.png',
  'images/Snipaste_2026-03-28_11-58-58.png':  '/images/snipaste-2026-03-28-11-58-58.png',
  'images/Snipaste_2026-03-28_13-36-19.png':  '/images/snipaste-2026-03-28-13-36-19.png',
  'images/Snipaste_2026-03-28_13-38-26.png':  '/images/snipaste-2026-03-28-13-38-26.png',
  'images/Snipaste_2026-03-28_14-01-15.png':  '/images/snipaste-2026-03-28-14-01-15.png',
  'images/Snipaste_2026-03-28_16-15-49.png':  '/images/snipaste-2026-03-28-16-15-49.png',
  'images/Snipaste_2026-03-28_16-17-35.png':  '/images/snipaste-2026-03-28-16-17-35.png',
  'images/Snipaste_2026-03-28_16-17-55.png':  '/images/snipaste-2026-03-28-16-17-55.png',
  'images/Snipaste_2026-03-28_16-18-14.png':  '/images/snipaste-2026-03-28-16-18-14.png',
  'images/Snipaste_2026-03-28_16-18-57.png':  '/images/snipaste-2026-03-28-16-18-57.png',
  'images/Snipaste_2026-03-29_23-23-30.png':  '/images/snipaste-2026-03-29-23-23-30.png',
  'images/Snipaste_2026-03-29_23-23-59.png':  '/images/snipaste-2026-03-29-23-23-59.png',
  'images/Snipaste_2026-03-29_23-24-12.png':  '/images/snipaste-2026-03-29-23-24-12.png',
  'images/Snipaste_2026-03-29_23-24-28.png':  '/images/snipaste-2026-03-29-23-24-28.png',
  'images/Snipaste_2026-03-29_23-24-41.png':  '/images/snipaste-2026-03-29-23-24-41.png',
  'images/Snipaste_2026-03-29_23-24-58.png':  '/images/snipaste-2026-03-29-23-24-58.png',
  'images/Snipaste_2026-03-29_23-25-18.png':  '/images/snipaste-2026-03-29-23-25-18.png',
  'images/Snipaste_2026-03-29_23-25-29.png':  '/images/snipaste-2026-03-29-23-25-29.png',
  'images/Snipaste_2026-03-29_23-25-39.png':  '/images/snipaste-2026-03-29-23-25-39.png',
  'images/Snipaste_2026-03-29_23-25-51.png':  '/images/snipaste-2026-03-29-23-25-51.png',
  'images/Snipaste_2026-03-29_23-26-16.png':  '/images/snipaste-2026-03-29-23-26-16.png',
  'images/Snipaste_2026-03-30_18-58-36.png':  '/images/snipaste-2026-03-30-18-58-36.png',
  'images/Snipaste_2026-03-30_20-27-19.png':  '/images/snipaste-2026-03-30-20-27-19.png',
};

function fixPath(p) {
  return MAP[p] !== undefined ? MAP[p] : p;
}

function fixArray(arr) {
  return arr.map(fixPath);
}

function patch(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: HOST,
      path,
      method: 'PATCH',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Prefer': 'return=representation'
      }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`PATCH ${path} → HTTP ${res.statusCode}: ${d.substring(0, 200)}`);
        resolve({ status: res.statusCode, body: d });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== 开始修复 Supabase 数据库图片路径 ===\n');

  // ---- 1. 修复 highlights 表 ----
  const highlightsData = [
    { id: 1, preview: [
      'images/微信图片_20260328111059_564_4.jpg',
      'images/微信图片_20260328111053_563_4.jpg'
    ]},
    { id: 2, preview: [
      'images/微信图片_20260328111259_565_4.png',
      'images/微信图片_20260328113429_570_4.png'
    ]},
    { id: 3, preview: [
      'images/Snipaste_2026-03-23_21-04-16.png',
      'images/Snipaste_2026-03-23_21-04-30.png',
      'images/Snipaste_2026-03-23_21-04-44.png',
      'images/Snipaste_2026-03-28_11-57-54.png',
      'images/Snipaste_2026-03-28_11-58-58.png',
      'images/微信图片_20260328111408_566_4.png',
      'images/微信图片_20260328112006_568_4.png'
    ]},
    { id: 4, preview: [
      'images/Snipaste_2026-03-30_18-58-36.png',
      'images/Snipaste_2026-03-28_16-15-49.png',
      'images/Snipaste_2026-03-28_16-17-35.png',
      'images/Snipaste_2026-03-28_16-17-55.png',
      'images/Snipaste_2026-03-28_16-18-14.png',
      'images/Snipaste_2026-03-28_16-18-57.png',
      'images/Snipaste_2026-03-29_23-23-30.png',
      'images/Snipaste_2026-03-29_23-23-59.png',
      'images/Snipaste_2026-03-29_23-24-12.png',
      'images/Snipaste_2026-03-29_23-24-28.png'
    ]}
  ];

  for (const row of highlightsData) {
    const newPreview = fixArray(row.preview);
    console.log(`highlights id=${row.id}:`);
    row.preview.forEach((old, i) => console.log(`  ${old}\n  → ${newPreview[i]}`));
    await patch(`/rest/v1/highlights?id=eq.${row.id}`, { preview: newPreview });
    console.log('');
  }

  // ---- 2. 修复 skills 表 ----
  const skillsData = [
    { id: 1, preview: [
      'images/Snipaste_2026-03-28_14-01-15.png',
      'images/微信图片_20260328140240_571_4.jpg',
      'images/微信图片_20260328140258_572_4.jpg'
    ]},
    { id: 2, preview: [
      'images/Snipaste_2026-03-28_13-36-19.png',
      'images/Snipaste_2026-03-28_13-38-26.png'
    ]},
    { id: 3, preview: [
      'images/Snipaste_2026-03-30_20-27-19.png'
    ]}
  ];

  for (const row of skillsData) {
    const newPreview = fixArray(row.preview);
    console.log(`skills id=${row.id}:`);
    row.preview.forEach((old, i) => console.log(`  ${old}\n  → ${newPreview[i]}`));
    await patch(`/rest/v1/skills?id=eq.${row.id}`, { preview: newPreview });
    console.log('');
  }

  // ---- 3. 修复 ppt_works 表 ----
  const pptData = [
    { id: 1, image_url: 'images/Snipaste_2026-03-23_21-04-16.png' },
    { id: 2, image_url: 'images/Snipaste_2026-03-23_21-04-30.png' },
    { id: 3, image_url: 'images/Snipaste_2026-03-23_21-04-44.png' }
  ];

  for (const row of pptData) {
    const newUrl = fixPath(row.image_url);
    console.log(`ppt_works id=${row.id}: ${row.image_url} → ${newUrl}`);
    await patch(`/rest/v1/ppt_works?id=eq.${row.id}`, { image_url: newUrl });
    console.log('');
  }

  console.log('=== 全部修复完成！===');
}

main().catch(console.error);
