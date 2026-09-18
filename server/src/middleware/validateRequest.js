import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(parsed.error.issues.map(e => e.message).join(', '), 400));
  }
  req.body = parsed.data;
  next();
};