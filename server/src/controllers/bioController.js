import { getBioByUserId, getBioByUsername, upsertBio } from '../services/bio/bioPageService.js';
import AppError from '../utils/AppError.js';

export const getMyBio = async (req, res, next) => {
  try {
    const bio = await getBioByUserId(req.user._id);
    res.status(200).json({ status: 'success', data: { bio } });
  } catch (error) { next(error); }
};

export const updateMyBio = async (req, res, next) => {
  try {
    const bio = await upsertBio(req.user._id, req.body);
    res.status(200).json({ status: 'success', data: { bio } });
  } catch (error) { next(error); }
};

export const getPublicBio = async (req, res, next) => {
  try {
    const bio = await getBioByUsername(req.params.username);
    if (!bio) return next(new AppError('Bio profile not found', 404));
    res.status(200).json({ status: 'success', data: { bio } });
  } catch (error) { next(error); }
};