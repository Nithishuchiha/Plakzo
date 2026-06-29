import { v2 as cloudinary } from 'cloudinary'
import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

cloudinary.config({
  cloud_name: 'dafi2yzol',
  api_key: '262259392636957',
  api_secret: 'JOWUZmMXNW3A1cR0WRff13u6H3s',
})

const FOLDER = 'plakzo'
const FRAMES_DIR = join(ROOT, 'public', 'product2_lamp_frames')
const THUMBNAIL_SRC = join(ROOT, 'public', 'product2_lamp_frames', 'ezgif-frame-001.png')

async function uploadThumbnail() {
  console.log('Uploading thumbnail...')
  try {
    await cloudinary.uploader.upload(THUMBNAIL_SRC, {
      folder: `${FOLDER}/thumbnails`,
      public_id: 'gallery_lamp_frames_v2',
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      resource_type: 'image',
    })
    console.log('  Thumbnail uploaded.')
  } catch (err) {
    console.error('  Thumbnail failed:', err.message)
  }
}

async function uploadFrames() {
  const files = readdirSync(FRAMES_DIR)
    .filter(f => f.endsWith('.png') && f !== 'ezgif-frame-001.png')
    .sort()
  console.log(`Uploading ${files.length} frames to ${FOLDER}/product2_lamp_frames/...`)

  for (const file of files) {
    const filePath = join(FRAMES_DIR, file)
    const publicId = `product2_lamp_frames/${file.replace('.png', '')}`
    try {
      await cloudinary.uploader.upload(filePath, {
        folder: FOLDER,
        public_id: publicId,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
        resource_type: 'image',
      })
      console.log(`  Uploaded: ${file}`)
    } catch (err) {
      console.error(`  Failed: ${file}`, err.message)
    }
  }
  console.log('Done uploading frames.')
}

await uploadThumbnail()
await uploadFrames()