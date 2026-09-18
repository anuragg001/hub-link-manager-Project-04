import Click from '../../models/Click.js';
import { UAParser } from 'ua-parser-js';
import { hashIp } from '../../utils/ipHash.js';
import logger from '../../utils/logger.js';

export const logClickAsync = (linkId, req) => {
  setImmediate(async () => {
    try {
      const parser = new UAParser(req.headers['user-agent']);
      const result = parser.getResult();
      let deviceType = 'Desktop';
      if (result.device.type === 'mobile') deviceType = 'Mobile';
      if (result.device.type === 'tablet') deviceType = 'Tablet';

      await Click.create({
        linkId,
        referrer: req.get('Referrer') || 'Direct',
        deviceType,
        ipHash: hashIp(req.ip)
      });

      // Increment the totalClicks counter on the Link document
      import('../../models/Link.js').then(async ({ default: Link }) => {
        await Link.updateOne({ _id: linkId }, { $inc: { totalClicks: 1 } });
      });
    } catch (err) {
      logger.error('Failed to log click asynchronously: ', err);
    }
  });
};