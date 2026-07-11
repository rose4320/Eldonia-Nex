-- Gallery: 3D model (GLB / GLTF) support

alter type public.artwork_media_type add value if not exists 'model';

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/x-flac',
  'audio/mp4',
  'audio/x-m4a',
  'application/pdf',
  'model/gltf-binary',
  'model/gltf+json'
]
where id = 'artworks';
