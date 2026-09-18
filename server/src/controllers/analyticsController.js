import { getAnalytics as getAnalyticsData } from '../services/analytics/analyticsService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const data = await getAnalyticsData(req.user._id);
    res.status(200).json({ status: 'success', data });
  } catch (error) { next(error); }
};