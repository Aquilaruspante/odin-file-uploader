const APPLICATION_TYPES = {
  'application/pdf': 'pdf',
  'application/zip': 'archive',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'other',
  'application/vnd.oasis.opendocument.text': 'document',
  'application/vnd.ms-excel': 'spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  'application/vnd.oasis.opendocument.spreadsheet': 'spreadsheet',
  'application/vnd.oasis.opendocument.graphics': 'drawing',
};

function fileCategory(mimetype) {
  const [type] = mimetype.split('/');
  if (['image', 'video', 'audio', 'text'].includes(type)) return type;
  return APPLICATION_TYPES[mimetype] ?? 'other';
}

module.exports = fileCategory;