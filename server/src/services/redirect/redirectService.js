import Link from '../../models/Link.js';

export const resolveShortCode = async (shortCode) => {
  const link = await Link.findOne({ shortCode });
  return link;
};