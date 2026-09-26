const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const sourceImage = path.join(__dirname, '..', 'public', 'logo.jpg');
const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

async function createCircularMask(size) {
  const radius = size / 2;
  const svg = `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#fff" /></svg>`;
  return Buffer.from(svg);
}

async function generate() {
  console.log(`Reading source logo from: ${sourceImage}`);

  if (!fs.existsSync(sourceImage)) {
    console.error(`Source image not found at ${sourceImage}`);
    process.exit(1);
  }

  // Define sizes
  const iconSizes = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 }
  ];

  // 1. Generate standard square/rounded ic_launcher.png, ic_launcher_round.png, and ic_launcher_foreground.png
  for (const item of iconSizes) {
    const targetFolder = path.join(resDir, item.dir);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Standard square launcher icon
    await sharp(sourceImage)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher.png'));
    console.log(`Generated: ${item.dir}/ic_launcher.png (${item.size}x${item.size})`);

    // Circular launcher icon
    const roundMask = await createCircularMask(item.size);
    const circularBuffer = await sharp(sourceImage)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
      .composite([{ input: roundMask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    await sharp(circularBuffer)
      .toFile(path.join(targetFolder, 'ic_launcher_round.png'));
    console.log(`Generated: ${item.dir}/ic_launcher_round.png (${item.size}x${item.size})`);

    // Foreground icon for adaptive icons (padded with safe margin so logo is crisp and not clipped)
    const logoPadding = Math.round(item.fgSize * 0.15);
    const innerLogoSize = item.fgSize - (logoPadding * 2);

    const innerLogo = await sharp(sourceImage)
      .resize(innerLogoSize, innerLogoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: item.fgSize,
        height: item.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: innerLogo, top: logoPadding, left: logoPadding }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'));
    console.log(`Generated: ${item.dir}/ic_launcher_foreground.png (${item.fgSize}x${item.fgSize})`);
  }

  // 2. Generate Splash Screens
  const splashScreens = [
    { dir: 'drawable', w: 480, h: 480 },
    { dir: 'drawable-land-mdpi', w: 480, h: 320 },
    { dir: 'drawable-land-hdpi', w: 800, h: 480 },
    { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
    { dir: 'drawable-port-mdpi', w: 320, h: 480 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 }
  ];

  for (const splash of splashScreens) {
    const splashFolder = path.join(resDir, splash.dir);
    if (!fs.existsSync(splashFolder)) {
      fs.mkdirSync(splashFolder, { recursive: true });
    }

    const minDim = Math.min(splash.w, splash.h);
    const logoSize = Math.round(minDim * 0.55);

    const centeredLogo = await sharp(sourceImage)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const top = Math.round((splash.h - logoSize) / 2);
    const left = Math.round((splash.w - logoSize) / 2);

    await sharp({
      create: {
        width: splash.w,
        height: splash.h,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 } // slate-900 theme
      }
    })
      .composite([{ input: centeredLogo, top, left }])
      .png()
      .toFile(path.join(splashFolder, 'splash.png'));
    console.log(`Generated: ${splash.dir}/splash.png (${splash.w}x${splash.h})`);
  }

  console.log('All Android Launcher Icons and Splash Screens generated successfully from official logo!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
