export interface User {
    _id: string,
    email: string,
    username: string,
    bio: string,
    profilePic: string
    animeList: [{
        animeId: string,
        status: string
    }]
}
