import { generateUniqueCode, validateVanitySlug } from '../services/links/shortCodeService.js';
import { getLinksByUser, deleteLink as deleteLinkService } from '../services/links/linkService.js';
import AppError from '../utils/AppError.js';

export const createLink = async (req, res, next) => {
  try {
    const { destinationUrl, vanitySlug } = req.body;
    let link;

    if (vanitySlug) {
      link = await validateVanitySlug(vanitySlug, destinationUrl, req.user._id);
    } else {
      link = await generateUniqueCode(destinationUrl, req.user._id);
    }

    res.status(201).json({ status: 'success', data: { link } });
  } catch (error) { next(error); }
};

export const getLinks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const result = await getLinksByUser(req.user._id, page, 10, search);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) { next(error); }
};

export const deleteLink = async (req, res, next) => {
  try {
    const link = await deleteLinkService(req.params.id, req.user._id);
    if (!link) return next(new AppError('Link not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (error) { next(error); }
};