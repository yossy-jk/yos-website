// Format conversion only: preserve the approved cube artwork.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const sizes = [16, 32, 48];
// Optional source is the owner's 1000px padded logo. A literal square crop
// preserves the source pixels, with no generated or redrawn logo artwork.
if (process.argv[2]) {
  const source = sharp(process.argv[2]);
  const metadata = await source.metadata();
  if (metadata.width !== 1000 || metadata.height !== 1000) throw new Error('Expected original 1000px padded logo');
  await source.extract({ left: 139, top: 450, width: 100, height: 100 }).png().toFile('public/brand/yos-cube-source.png');
}
for (const [path, size] of [['public/favicon.png', 512], ['public/favicon-32.png', 32], ['public/favicon-192.png', 192], ['public/apple-touch-icon.png', 180]]) {
  await sharp('public/brand/yos-cube-source.png').resize(size, size).ensureAlpha().png().toFile(path);
}
const images = await Promise.all(sizes.map(size => sharp('public/favicon.png').resize(size, size).ensureAlpha().png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((bytes, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index]; header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(bytes.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += bytes.length;
});
const icon = Buffer.concat([header, ...images]);
await writeFile('public/favicon.ico', icon);
await writeFile('src/app/favicon.ico', icon);
