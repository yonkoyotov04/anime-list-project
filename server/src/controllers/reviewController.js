import { Router } from "express";
import reviewService from "../services/reviewService.js";
import animeService from '../services/animeService.js'
import { getErrorMessage } from "../utils/errorUtil.js";
import Review from "../models/Review.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const reviewController = Router();

reviewController.get('/anime/:animeId', async (req, res) => {
    const animeId = req.params.animeId;

    try {
        const animeReviews = await reviewService.getAnimeReviews(animeId);
        res.status(200).json(animeReviews ?? []);
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

reviewController.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userReviews = await reviewService.getUserReviews(userId);
        res.status(200).json(userReviews ?? []);
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

reviewController.get('/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        const review = await reviewService.getReviewById(reviewId);
        res.status(200).json(review ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

reviewController.get('/:animeId/status', isAuth, async (req, res) => {
    const anime = req.params.animeId;
    const user = req.user?.id;

    let hasLeftReview = false;

    const exists = await Review.findOne({anime, user})

    if (exists) {
        hasLeftReview = true;
    }

    return res.status(200).json(hasLeftReview);
})

reviewController.post('/:animeId', isAuth, async (req, res) => {
    const animeId = req.params.animeId;
    const userId = req.user?.id;
    let reviewData = req.body;

    const exists = await Review.findOne({anime: animeId, user: userId});

    if (exists) {
        res.statusMessage = "You've already left a review!";
        res.status(400).end();
    }

    const anime = await animeService.getOneAnime(animeId);
    const reviewCount = await reviewService.getAnimeReviewsCount(animeId);

    try {
        const newRating = ((anime.rating * reviewCount) + reviewData.rating) / (reviewCount + 1);

        reviewData = {anime: animeId, user: userId, ...reviewData};
        const review = await reviewService.reviewAnime(reviewData);
        
        await animeService.updateRating(animeId, newRating);

        res.status(201).json(review ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

reviewController.put('/:reviewId', isAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user?.id;
    const animeId = await reviewService.getReviewById(reviewId).anime;
    const newReviewData = req.body;

    try {
        newReviewData = {anime: animeId, user: userId, ...newReviewData};
        const newReview = await reviewService.editReview(reviewId, newReviewData);
        res.status(201).json(newReview ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

reviewController.delete('/:reviewId', isAuth, async (req, res) => {
    const reviewId = req.params.reviewId;

    const review = await reviewService.getReviewById(reviewId);
    const animeId = review.anime;
    const anime = await animeService.getOneAnime(animeId);
    const reviewCount = await reviewService.getAnimeReviewsCount(animeId);

    try {
        const newRating = ((anime.rating * reviewCount) - review.rating) / (reviewCount - 1);

        await reviewService.deleteReview(reviewId);
        await animeService.updateRating(animeId, newRating);
        
        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).end();
    }
})

export default reviewController;

