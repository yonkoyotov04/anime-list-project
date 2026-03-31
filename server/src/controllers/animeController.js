import { Router } from "express";
import animeService from "../services/animeService.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtil.js";
import reviewService from "../services/reviewService.js";

const animeController = Router();

animeController.get('/', async (req, res) => {
    const filter = req.query;
    const animes = await animeService.getAllAnime(filter);

    res.status(200).json(animes ?? []);
})

animeController.post('/', isAuth, async (req, res) => {
    let animeData = req.body;
    const userId = req.user?.id;

    animeData['title'] = animeData.title.trim();
    animeData['author'] = animeData.author.trim();
    animeData['producedBy'] = animeData.producedBy.trim();
    animeData['genres'] = animeData.genres.trim();
    animeData['startDate'] = animeData.startDate.trim();
    animeData['endDate'] = animeData.endDate.trim();
    animeData['description'] = animeData.description.trim();
    animeData['imageUrl'] = animeData.imageUrl.trim();

    if (animeData['endDate'] === '') {
        animeData['endDate'] = 'Ongoing';
    }

    try {
        const anime = await animeService.createAnime(animeData, userId);
        res.status(200).json(anime ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

animeController.get('/:animeId', async (req, res) => {
    const animeId = req.params.animeId;

    try {
        const anime = await animeService.getOneAnime(animeId);

        if (!anime) {
            res.status(404).end();
        }
        
        res.status(200).json(anime ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(404).end();
    }
})

animeController.get('/:animeId/status', isAuth, async (req, res) => {
    const animeId = req.params.animeId;
    const anime = await animeService.getOneAnime(animeId);
    let isOwner = true;

    if (!anime.ownerId.equals(req.user?.id) && !req.isAdmin) {
        isOwner = false;
    }

    return res.status(200).json(isOwner);
})

animeController.put('/:animeId', isAuth, async (req, res) => {
    const animeId = req.params.animeId;
    const anime = await animeService.getOneAnime(animeId);
    let newData = req.body;

    newData['title'] = newData.title.trim();
    newData['author'] = newData.author.trim();
    newData['producedBy'] = newData.producedBy.trim();
    newData['genres'] = newData.genres.trim();
    newData['startDate'] = newData.startDate.trim();
    newData['endDate'] = newData.endDate.trim();
    newData['description'] = newData.description.trim();
    newData['imageUrl'] = newData.imageUrl.trim();

    try {
        if (!anime.ownerId.equals(req.user?.id) && !req.isAdmin) {
            throw new Error('Only the owner and admin can edit!')
        }

        const editedAnime = await animeService.editAnime(animeId, {
            currentlyWatched: anime.currentlyWathced,
            completed: anime.completed,
            dropped: anime.dropped,
            ownerId: anime.ownerId,
             ...newData});
        res.status(201).json(editedAnime ?? {});
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

animeController.delete('/:animeId', isAuth, async (req, res) => {
    const animeId = req.params.animeId;
    const anime = await animeService.getOneAnime(animeId);

    try {
        if (!anime.ownerId.equals(req.user?.id) && !req.isAdmin) {
            throw new Error('Only the owner and admin can delete!')
        }

        await reviewService.deleteReviewsForAnime(animeId);
        await animeService.deleteAnime(animeId);

        res.status(200).end();
    } catch (error) {
        res.statusMessage = getErrorMessage(error);
        res.status(401).end();
    }
})

export default animeController;
