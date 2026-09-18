import Link from '../../models/Link.js';

export const getLinksByUser = async (userId, page = 1, limit = 10, search = '') => {
  const query = { userId };
  if (search) {
    query.$or = [
      { destinationUrl: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } }
    ];
  }

  const links = await Link.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Link.countDocuments(query);
  return { links, total, pages: Math.ceil(total / limit) };
};

export const deleteLink = async (linkId, userId) => {
  const link = await Link.findOneAndDelete({ _id: linkId, userId });
  return link;
};