import { resolveShortCode } from '../services/redirect/redirectService.js';
import { logClickAsync } from '../services/redirect/clickLoggingService.js';

export const handleRedirect = async (req, res, next) => {
  try {
    const link = await resolveShortCode(req.params.shortCode);
    if (!link) return res.status(404).send('Link not found');

    logClickAsync(link._id, req);
    res.redirect(302, link.destinationUrl);
  } catch (error) { next(error); }
};