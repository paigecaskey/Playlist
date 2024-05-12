# Spotify Playlist Generator

## Deployment Hosted by Netlify: https://playlistgenerator2.netlify.app

## Overview

This playlist generator is a web application designed to help users create customized playlists based on their music preferences and recommendations. The application offers features to recommend songs, generate a playlist, and allows the user to manage music selections seamlessly.
** Because the app is still in development mode through Spotify, only users added through the app's settings can currently use its functionality **

## Design Principles

### Color Palette
The color palette was choosen using [coolors]((https://coolors.co)) in order to form a cohesive and clean design. 

### Fonts
The primary font used in the application was choosen from [Google Fonts](https://fonts.google.com/specimen/Montserrat?query=montserrat) for its readability and modern appearance, with fallback options for cross-browser compatibility.

### Layout
The layout of the application is designed to be intuitive and responsive, and adapts to various screen sizes using media queries.

## Purpose
The purpose of this app is to provide users with a convenient tool for curating personalized playlists effortlessly. By leveraging Spotify's external APIs, the application delivers tailored song recommendations and playlist generation capabilities, allowing the user to customize their listening habits.

### Features
Song Recommendations: Utilizes Spotify's external API to suggest songs based on user preferences.
Playlist Generation: Allows users to generate custom playlists tailored to their music tastes.
Responsive Design: Ensures that the application looks good and functions well on multiple screen sizes and devices.

### State Management

The application uses state management techniques, such as React's useState and useEffect hooks, to keep track of user interactions and data retreived from the API.

## Data Sources

The application fetches additional data from the Spotify API to access user playlists, top tracks, and artist information. Specifically, it takes 20 of the users top songs and 20 of the users top artists, randomly chooses 2 of each, and generates recommendations based on those four criteria. 

## User Authentication 

This app uses the Authorization Code flow for user authenication on the back-end to ensure the safety of important variables. The [Spotify WebAPI Documentation](https://developer.spotify.com/documentation/web-api) was used as reference during develoopment. 

