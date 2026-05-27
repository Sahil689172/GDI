import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const srcSvg = path.join(root, 'assets', 'brand', 'lightning.svg');

const outPublicIcons = path.join(root, 'public', 'icons');
const outElectron = path.join(root, 'electron', 'assets');
const outPublic = path.join(root, 'public');

const ensure = (p) => fs.mkdirSync(p, { recursive: true });

const sizes = [16, 20, 24, 32, 40, 48, 64, 96, 128, 192, 256, 384, 512];

const renderPng = async ({ size, dest, padding = 0, bg = null }) => {
  const base = sharp(srcSvg, { density: 512 })
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain' });

  const withBg = bg
    ? sharp({
        create: { width: size, height: size, channels: 4, background: bg },
      }).composite([{ input: await base.png().toBuffer(), left: padding, top: padding }])
    : sharp({
        create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
      }).composite([{ input: await base.png().toBuffer(), left: padding, top: padding }]);

  await withBg.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(dest);
};

const main = async () => {
  if (!fs.existsSync(srcSvg)) {
    throw new Error(`Missing source svg: ${srcSvg}`);
  }

  ensure(outPublicIcons);
  ensure(outElectron);
  ensure(outPublic);

  // PWA icons
  await renderPng({
    size: 192,
    dest: path.join(outPublicIcons, 'icon-192.png'),
    bg: { r: 10, g: 10, b: 10, alpha: 1 },
  });
  await renderPng({
    size: 512,
    dest: path.join(outPublicIcons, 'icon-512.png'),
    bg: { r: 10, g: 10, b: 10, alpha: 1 },
  });
  // maskable: add safe padding so the bolt stays visible with OS masks
  await renderPng({
    size: 512,
    padding: 72,
    dest: path.join(outPublicIcons, 'maskable-512.png'),
    bg: { r: 10, g: 10, b: 10, alpha: 1 },
  });

  // Electron / taskbar icons
  await renderPng({
    size: 256,
    dest: path.join(outElectron, 'icon.png'),
    bg: { r: 10, g: 10, b: 10, alpha: 1 },
  });

  // Multi-size PNGs (optional, handy for other platforms)
  for (const s of sizes) {
    await renderPng({
      size: s,
      dest: path.join(outElectron, `icon-${s}.png`),
      bg: { r: 10, g: 10, b: 10, alpha: 1 },
    });
  }

  // Favicon ICO (Windows-friendly)
  const icoPngs = await Promise.all(
    [16, 32, 48].map((s) =>
      sharp(srcSvg, { density: 512 })
        .resize(s, s)
        .png()
        .toBuffer()
    )
  );
  const ico = await pngToIco(icoPngs);
  fs.writeFileSync(path.join(outPublic, 'favicon.ico'), ico);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

