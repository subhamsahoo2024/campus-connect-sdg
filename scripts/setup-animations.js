const fs = require('fs');
const path = require('path');
const https = require('https');

// Animation files to download with primary and fallback URLs
const animations = [
  {
    name: 'avatar_idle.json',
    urls: [
      'https://assets3.lottiefiles.com/packages/lf20_q7uarxsb.json',
      'https://lottie.host/4db645cb-e8f5-46ea-ab03-a2e2aad554a7/Dr4wVl1AXM.json', // Fallback: idle robot
    ],
  },
  {
    name: 'avatar_running.json',
    urls: [
      'https://assets4.lottiefiles.com/packages/lf20_jzpjbmvn.json',
      'https://lottie.host/91c823fc-7a2d-4a3a-a0ad-f2f5e5d5e5d5/running.json', // Fallback: running character
    ],
  },
  {
    name: 'avatar_excited.json',
    urls: [
      'https://assets9.lottiefiles.com/packages/lf20_u4yrau.json',
      'https://lottie.host/4e0cc60f-9a7d-4d8a-9e5b-5e5d5e5d5e5d/celebration.json', // Fallback: celebration
    ],
  },
  {
    name: 'avatar_sad.json',
    urls: [
      'https://assets1.lottiefiles.com/packages/lf20_bhw1ul4g.json',
      'https://lottie.host/6f1dd71f-0a8d-4c7e-8f6d-6f6e6f6e6f6e/sad.json', // Fallback: sad/waiting
    ],
  },
];

// Target directory
const animationsDir = path.join(__dirname, '..', 'public', 'animations');

// Helper function to download a file
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          // Validate that the content is valid JSON
          JSON.parse(data);
          resolve(data);
        } catch (e) {
          reject(new Error('Downloaded content is not valid JSON'));
        }
      });
    }).on('error', reject);
  });
}

// Create fallback animation as a last resort
function createFallbackAnimation(type) {
  const fallbacks = {
    idle: {
      v: '5.7.4',
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: 'Idle Animation',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape Layer',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [50, 50, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'el',
                  d: 1,
                  s: { a: 0, k: [80, 80], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: 'Ellipse Path 1',
                },
                {
                  ty: 'fl',
                  c: { a: 0, k: [0.2, 0.4, 0.8, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  bm: 0,
                  nm: 'Fill 1',
                },
              ],
              nm: 'Group 1',
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
      markers: [],
    },
    running: {
      v: '5.7.4',
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: 'Running Animation',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape Layer',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0], e: [5] }, { t: 60, s: [5] }], ix: 10 },
            p: { a: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [20, 50, 0], e: [80, 50, 0] }, { t: 60, s: [80, 50, 0] }], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'el',
                  d: 1,
                  s: { a: 0, k: [40, 40], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: 'Ellipse Path 1',
                },
                {
                  ty: 'fl',
                  c: { a: 0, k: [0.1, 0.5, 0.9, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  bm: 0,
                  nm: 'Fill 1',
                },
              ],
              nm: 'Group 1',
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
      markers: [],
    },
    excited: {
      v: '5.7.4',
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: 'Excited Animation',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape Layer',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0], e: [-10] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [-10], e: [10] }, { t: 30, s: [10] }], ix: 10 },
            p: { a: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [50, 50, 0], e: [50, 35, 0] }, { t: 30, s: [50, 35, 0] }], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100], e: [110, 110, 100] }, { t: 30, s: [110, 110, 100] }], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'el',
                  d: 1,
                  s: { a: 0, k: [60, 60], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: 'Ellipse Path 1',
                },
                {
                  ty: 'fl',
                  c: { a: 0, k: [1, 0.8, 0.2, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  bm: 0,
                  nm: 'Fill 1',
                },
              ],
              nm: 'Group 1',
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
      markers: [],
    },
    sad: {
      v: '5.7.4',
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: 'Sad Animation',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape Layer',
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [50, 60, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'el',
                  d: 1,
                  s: { a: 0, k: [70, 70], ix: 2 },
                  p: { a: 0, k: [0, 0], ix: 3 },
                  nm: 'Ellipse Path 1',
                },
                {
                  ty: 'fl',
                  c: { a: 0, k: [0.6, 0.2, 0.2, 1], ix: 4 },
                  o: { a: 0, k: 100, ix: 5 },
                  r: 1,
                  bm: 0,
                  nm: 'Fill 1',
                },
              ],
              nm: 'Group 1',
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: 'ADBE Vector Group',
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
      markers: [],
    },
  };

  return JSON.stringify(fallbacks[type] || fallbacks.idle, null, 2);
}

// Main execution
async function setupAnimations() {
  try {
    // Create animations directory if it doesn't exist
    if (!fs.existsSync(animationsDir)) {
      fs.mkdirSync(animationsDir, { recursive: true });
      console.log(`✓ Created directory: ${animationsDir}`);
    }

    // Download each animation
    for (const animation of animations) {
      const filePath = path.join(animationsDir, animation.name);
      let success = false;
      let lastError = null;

      // Try each URL until one succeeds
      for (const url of animation.urls) {
        try {
          console.log(`⏳ Downloading ${animation.name} from ${url}...`);
          const data = await downloadFile(url);
          fs.writeFileSync(filePath, data);
          console.log(`✓ Successfully saved: ${animation.name}`);
          success = true;
          break;
        } catch (error) {
          lastError = error;
          console.log(`  ⚠ Failed: ${error.message}`);
        }
      }

      // If all URLs failed, use fallback animation
      if (!success) {
        console.log(`⚠ All URLs failed for ${animation.name}, using fallback animation...`);
        const animationType = animation.name.replace('avatar_', '').replace('.json', '');
        const fallbackData = createFallbackAnimation(animationType);
        fs.writeFileSync(filePath, fallbackData);
        console.log(`✓ Created fallback animation: ${animation.name}`);
      }
    }

    console.log('\n✅ Animation setup complete!');
    console.log(`📁 Files saved to: ${animationsDir}`);
    console.log('\nNext steps:');
    console.log('1. Update EvolutionAvatar.tsx to use local files');
    console.log('2. Run: npm run dev');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

setupAnimations();
