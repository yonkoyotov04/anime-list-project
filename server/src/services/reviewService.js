import Review from "../models/Review.js"

export default {
    reviewAnime(reviewData) {
        return Review.create(reviewData);
    },

    getReviewById(reviewId) {
        return Review.findById(reviewId);
    },

    getAnimeReviews(animeId) {
        return Review.find({anime: animeId}).populate({path: 'user', select: 'username profilePic'});
    },

    getAnimeReviewsCount(animeId) {
        return Review.countDocuments({anime: animeId});
    },

    getUserReviews(userId) {
        return Review.find({user: userId}).populate({path: 'anime', select: 'title imageUrl'})
    },

    editReview(reviewId, newReview) {
        return Review.findByIdAndUpdate(reviewId, newReview, {runValidators: true, new: true});
    },

    deleteReview(reviewId) {
        return Review.findByIdAndDelete(reviewId);
    },

    deleteReviewsForAnime(animeId) {
        return Review.deleteMany({anime: animeId});
    },

    deleteReviewsForUser(userId) {
        return Review.deleteMany({user: userId});
    }
}