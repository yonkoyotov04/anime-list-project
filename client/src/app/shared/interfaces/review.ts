export interface Review {
    _id: string,
    anime: {
        _id: string,
        title: string,
        imageUrl: string
    },
    user: {
        _id: string,
        username: string,
        profilePic: string
    },
    rating: number,
    comment: string
}
