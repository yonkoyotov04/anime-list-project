import Anime from "../models/Anime.js"

export default {
    getAllAnime(filter = {}) {
        let query = Anime.find();

        if (filter.title) {
            query.find({ title: { $regex: filter.title, $options: 'i' } })
        }

        if (filter.author) {
            query.find({ author: { $regex: filter.author, $options: 'i' } })
        }

        if (filter.producedBy) {
            query.find({ producedBy: { $regex: filter.producedBy, $options: 'i' } })
        }

        if (filter.genres) {
            query.find({ genres: { $regex: filter.genres, $options: 'i' } })
        }

        return query;
    },

    getOneAnime(animeId) {
        return Anime.findById(animeId);
    },

    createAnime(animeData, userId) {
        return Anime.create({ownerId: userId, ...animeData});
    },

    editAnime(animeId, newData) {
        return Anime.findByIdAndUpdate(animeId, newData, {runValidators: true, new: true});
    },

    async getCurrentRating(animeId) {
        const anime = await Anime.findById(animeId).select({rating: true});
        return anime.rating;
    },

    updateRating(animeId, newRating) {
        return Anime.findByIdAndUpdate(animeId, {$set: {rating: newRating}}, {runValidators: true, new: true});
    },

    deleteAnime(animeId) {
        return Anime.findByIdAndDelete(animeId);
    }
}