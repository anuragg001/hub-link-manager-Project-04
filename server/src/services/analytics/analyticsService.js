import Click from '../../models/Click.js';
import Link from '../../models/Link.js';

export const getAnalytics = async (userId) => {
  const links = await Link.find({ userId }).select('_id');
  const linkIds = links.map(l => l._id);

  const clicksOverTime = await Click.aggregate([
    { $match: { linkId: { $in: linkIds } } },
    { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const topReferrers = await Click.aggregate([
    { $match: { linkId: { $in: linkIds } } },
    { $group: { _id: "$referrer", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const deviceDistribution = await Click.aggregate([
    { $match: { linkId: { $in: linkIds } } },
    { $group: { _id: "$deviceType", count: { $sum: 1 } } }
  ]);

  return { clicksOverTime, topReferrers, deviceDistribution };
};