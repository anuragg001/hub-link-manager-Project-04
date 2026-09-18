import logger from '../../utils/logger.js';

export const sendResetEmail = async (to, token) => {
  logger.info(`[Simulated Email] To: ${to} | Subject: Password Reset | Token: ${token}`);
};