export default {
  name: 'album',
  title: 'Album',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'publishedAt', type: 'datetime' }
  ]
};
