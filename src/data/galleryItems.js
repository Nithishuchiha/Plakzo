import { cloudinaryUrl, cloudinaryFrameUrl } from '../lib/cloudinary'

export const GALLERY_ITEMS = [
  {
    slug: 'industrial-parts',
    label: 'Industrial Parts',
    tag: 'Industrial',
    accent: '#c3d9f3',
    image: cloudinaryUrl('thumbnails/gallery_industrial_parts.png'),
    frameDir: 'frames/industrial-parts/ezgif-frame-',
    frameCount: 138,
    description: 'Precision-engineered plastic components for industrial applications, manufactured using high-resolution FDM printing.',
  },
  {
    slug: 'photo-lamps',
    label: 'Photo Lamps',
    tag: 'Gift',
    accent: '#f9c98e',
    image: cloudinaryUrl('thumbnails/gallery_photo_lamp.png'),
    frameDir: 'frames/photo-lamps/ezgif-frame-',
    frameCount: 158,
    description: 'Transform photographs into glowing 3D-printed light sculptures. Ideal for birthdays, anniversaries, and home decor.',
  },
  {
    slug: 'keychains',
    label: 'Keychains',
    tag: 'Gift',
    accent: '#a8edca',
    image: cloudinaryUrl('thumbnails/gallery_keychains.png'),
    frameDir: 'frames/keychains/ezgif-frame-',
    frameCount: 155,
    description: 'Logo-accurate keychains in PLA or TPU with sub-millimeter detail, printed at scale for branding or personal use.',
  },
  {
    slug: 'cad-design',
    label: 'CAD Design',
    tag: 'CAD',
    accent: '#b9a0ef',
    image: cloudinaryUrl('thumbnails/gallery_cad_design.png'),
    frameDir: 'frames/cad-design/ezgif-frame-',
    frameCount: 139,
    description: 'Custom 3D CAD modeling and product design using SolidWorks for industrial parts, prototypes, and product development.',
  },
  {
    slug: 'bottle-caps',
    label: 'Bottle Caps',
    tag: 'Industrial',
    accent: '#e8a0cf',
    image: cloudinaryUrl('thumbnails/gallery_bottle_caps.png'),
    frameDir: 'frames/bottle-caps/ezgif-frame-',
    frameCount: 152,
    description: 'Personalized 3D printed bottle caps with custom logos, text, or unique shapes for branding, events, or gifts.',
  },
  {
    slug: 'prototypes',
    label: 'Prototypes',
    tag: 'Prototype',
    accent: '#a0d8ef',
    image: cloudinaryUrl('thumbnails/gallery_prototype.png'),
    frameDir: 'frames/prototypes/ezgif-frame-',
    frameCount: 110,
    description: 'Rapid prototyping from concept to physical model. Iterate fast with high-resolution 3D printing.',
  },
]

export function getGalleryItem(slug) {
  return GALLERY_ITEMS.find(item => item.slug === slug)
}
