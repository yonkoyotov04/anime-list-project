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

    const exists = await Review.findOne({ anime, user })

    if (exists) {
        hasLeftReview = true;
    }

    return res.status(200).json(hasLeftReview);
})

reviewController.post('/:animeId', isAuth, async (req, res) => {
    const animeId = req.params.animeId;
    const userId = req.user?.id;
    let reviewData = req.body;

    const exists = await Review.findOne({ anime: animeId, user: userId });

    if (exists) {
        res.statusMessage = "You've already left a review!";
        res.status(400).json({error: "You've already left a review!"});
    }

    const animeRating = await animeService.getCurrentRating(animeId);
    const reviewCount = await reviewService.getAnimeReviewsCount(animeId);

    try {
        let newRating = ((animeRating * reviewCount) + reviewData.rating) / (reviewCount + 1);

        if (newRating > 10) {
            newRating = 10;
        }

        reviewData = { anime: animeId, user: userId, ...reviewData };
        const review = await reviewService.reviewAnime(reviewData);

        await animeService.updateRating(animeId, newRating);

        res.status(201).json(review ?? {});
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(400).json({message: errorMessage});
    }
})

reviewController.put('/:reviewId', isAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user?.id;
    const currentReview = await reviewService.getReviewById(reviewId);
    const animeId = currentReview.anime;
    let newReviewData = req.body;

    const animeRating = await animeService.getCurrentRating(animeId);
    const reviewCount = await reviewService.getAnimeReviewsCount(animeId);

    try {
        const newRating = (animeRating * reviewCount - currentReview.rating + newReviewData.rating) / reviewCount;

        if (newRating > 10) {
            newRating = 10;
        }

        newReviewData = { anime: animeId, user: userId, ...newReviewData };
        const newReview = await reviewService.editReview(reviewId, newReviewData);

        await animeService.updateRating(currentReview.anime, newRating);

        res.status(201).json(newReview ?? {});
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.statusMessage = errorMessage;
        res.status(400).json({message: errorMessage});
    }
})

reviewController.delete('/:reviewId', isAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const review = await reviewService.getReviewById(reviewId);
    const animeId = review.anime;

    const animeRating = await animeService.getCurrentRating(animeId);
    const reviewCount = await reviewService.getAnimeReviewsCount(animeId);

    try {
        const newRatingTotal = animeRating * reviewCount - review.rating;
        let newRating = 0;

        if (newRatingTotal > 0) {
            newRating = newRatingTotal / (reviewCount - 1)
        }

        await reviewService.deleteReview(reviewId);
        await animeService.updateRating(animeId, newRating);

        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(400).json({message: 'Failed to delete review!'});
    }
})

export default reviewController;

