export interface Review {
    id: string,
    anime: {
        id: string,
        title: string,
        imageUrl: string
    },
    user: {
        id: string,
        username: string,
        profilePic: string
    },
    rating: number,
    comment: string
}
