const CLOUD_NAME = 'dafi2yzol'
const FOLDER = 'plakzo'

export const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
export const CLOUDINARY_FOLDER = FOLDER

export function cloudinaryUrl(publicId, transforms = 'f_auto,q_auto') {
  return `${CLOUDINARY_BASE}/${transforms}/${FOLDER}/${publicId}`
}

export function cloudinaryFrameUrl(frameDir, frameNum) {
  const pad = String(frameNum).padStart(3, '0')
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${FOLDER}/${frameDir}/${pad}.png`
}
