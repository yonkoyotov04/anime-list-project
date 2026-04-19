# AniList+

## Application Purpose
The main purpose of AniList+ is to be a tool for users to document their anime journey, by making a list of animes they've watched, leaving reviews for animes they liked a lot, or perhaps ones they didn't like at all, and share their opinions and taste with other users.

## User Roles
There are two user roles - Guests and Authenticated Users. 

Guest users: 
- can view the home page
- can view the catalogue page
- can view details for any anime
- can view other user's profile and anime list (but can't interact with them in any way other than viewing)
- can view the about page
- can register and login

Authenticated users: 
- can do everything the guests can, except for registering or logging in
- can add animes to their anime list
- can complete, drop or remove animes from their anime list
- can leave a review on any anime
- can edit and delete their own reviews through their profile
- can add animes that haven't been added to the site yet
- can edit and delete animes they've added if they find it necessary
- can edit and delete their profile
- can edit their password
- can logout

## Public Features
- viewing the home page
- viewing the catalogue
- viewing anime details
- viewing user profiles
- viewing user anime lists
- viewing the about page
- registering and logging in

## Authenticated Features
- adding animes to your own anime list
- completing animes in your own anime list
- dropping animes in your own anime list
- removing animes from your own anime list
- leaving reviews
- editing and deleting your reviews
- adding animes to the catalogue
- editing and deleting animes you've added
- viewing your own profile page
- editing or deleting your profile
- editing your password

## Main Application Flow
1. Users open the home page by default
2. They likely look at the animes displayed in the home page, which are sorted by top 5 trending, top 5 most popular, top 5 highrst rated and top 5 lowest rated.
3. They go to the catalogue page.
4. They click on one of the animes
5. They register or login after seeing the message that says they can't leave a review without logging in
6. They add an anime they like to their list
7. They leave a review on said anime.
8. They look for another anime they like, but can't find it
9. They add that anime to the site.

## Data Structure
There are three main data collections the site has - users, animes and reviews.
Here's a list of what each collection contains:
Users:
- id
- email
- password
- username
- profile picture
- bio
- anime list (it contains an array of objects that have an anime id and a status)

Animes: 
- id
- title
- author
- producer
- genres
- date of the first episode
- date of the last episode (if there is a last episode yet)
- description
- image URL
- rating
- currentlyWatched (the number of currently watching users)
- completed (the number of how many times it has been watched completely)
- dropped (the number of how many times it has been dropped)
- ownerId (the id of the user that has added that anime to the site)

Reviews:
- id
- anime id (the id of the anime for which the review has been left)
- user id (the id of the user that has left the review)
- rating
- comment

## Project Architecture
- client/ (the main folder of the angular client)
    - public/ (contains just the site icon for now)
    - src/
        - app/ (contains the main component and all of it's sub-components)
            - core/ (contains services, guards and interceptors)
            - features/ (contains all the main components that are displayed based on the url)
            - layout/ (contains the header and footer - the only components that are always visible)
            - shared/ (contains interfaces and components that are reused within the application)
        - index.html (the main html file)
        - main.ts (the main typescript file)
        - style.css (the main css file. Contains the css code for the entire application)

- server/ (the main folder of the node.js server)
    - src/
        - controllers (contains the controllers, in which all endpoints are defined)
        - middlewares (contains middlewares. Currently only the auth middleware)
        - models (contains the models for the site's main collections)
        - services (contains all Mongoose functions used in the controllers)
        - utils (contains helper functions that are mostly used to prevent repetition)
        - index.js (the main file of the server)
        - routes.js (connects all the controllers into one to prevent constant imports)


## Technologies Used
- Angular
- Typescript
- RxJS
- HTML
- CSS
- Node.js
- Express.js
- MongoDB
- Mongoose
- Vercel (for deploying the client)
- Render (for deploying the server)

## How to run the project
- By using the link for the deployed version of it
1. Follow this link https://anime-list-project-ten.vercel.app/
- By running it in Visual Studio Code
1. In the terminal run 'cd server
2. Run 'npm install' to install all dependencies of the server
3. Run 'npm start' to start the server
4. In a new terminal run 'cd client'
5. Run 'npm install' to install all dependencies of the client
6. Run 'ng serve' to start the client
7. Follow the link given after starting the client
