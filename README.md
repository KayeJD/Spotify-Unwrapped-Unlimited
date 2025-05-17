# [Spotify-WebAPI](https://kayejd.github.io/project-spotifyapi.html)

This Spotify WebAPI application is a small little web-based system project that allows users to authenticate with their Spotify account, view their personalized music data (top artists, tracks, genres), and get music recommendations based on their preferences. I initially pursued so that I no longer have to wait until the end of the year to see my **Spotify Wrapped**! :D The application implements OAuth 2.0 for Spotify authentication and uses Pug templates for rendering views.

<p align="center">
    <img src="https://github.com/user-attachments/assets/b81f6968-cc13-41b6-9648-b8f825db0b08" width="600" />
</p>

_Guidance credit to Alvaro Navarro_

## Table of Contents
1. [Core Functionality](#core-functionality)
2. [Development Setup](#development-environment-setup)
3. [Project Architecture](#project-architecture)

## Core Functionality 

|Feature|Description|
| -------- | ------- |
|Authentication|	OAuth 2.0 flow with Spotify for secure user authorization|
|User Profile|	Display of user profile information from Spotify|
|Music Analysis|	Visualization of user's top artists, tracks, and genres across different time periods (short, medium, and long term)|
|Saved Tracks|	Display of user's recently saved tracks|
|Recommendations|	Generation of personalized music recommendations based on user preferences|

## Development Environment Setup

### Prerequisites
- Node.js (12.20.0 or higher)
- npm
- A Spotify Developer account: For API credentials

### Setup Process
![image](https://github.com/user-attachments/assets/944f4bd3-2527-4089-975f-c64228d25b13)

1. **Clone the Repository**
   ```
   git clone https://github.com/KayeJD/Spotify-WebAPI.git
   cd Spotify-WebAPI
   ```
  
2. **Install the required dependencies from pacakge.json**
   ```
   npm install
   ```
    **Dependency Structure**
    <p align="center">
      <img src="https://github.com/user-attachments/assets/ed030485-b3ee-4fd8-9441-dd1c91c08d82" width="900" />
    </p>
    
      The application currently relies on several key dependencies to function properly if you wish to build upon it. Here's an overview of the primary dependencies and their purposes:
      |Dependency	|Version	|Purpose|
      | --- | --- | --- |
      |express|^4.17.1|Web application framework for handling HTTP requests, routing, and middleware|
      |node-fetch	|^3.3.2|	Library for making HTTP requests to the Spotify API|
      |pug|^3.0.0|	Template engine for generating HTML views|
      |nodemon|^2.0.15|	Development utility that monitors for changes and automatically restarts the server|
    > 💡 **ES Modules Configuration**: The project uses ECMAScript modules instead of CommonJS.
    
3. **Spotify API Configuration**
    - Visit [Spotify Developer Dashboard](https://developer.spotify.com/) and log in with your Spotify account
    - Register a New Application
        - Note the Client ID and Client Secret
        - Set Redirect URi (e.g., http://localhost:3000/callback)
    - Configure Environment Variables _(Spotify Client ID, Client Secret, Redirect URI)_
      
4. **Run Application** to execute _nodemon server.js_
   ```
   npm start
   ```


## Project Architecture
<p align="center">
    <img src="https://github.com/user-attachments/assets/e992f79c-c7e1-4df9-9647-cf84548a57b2" width="600" />
</p>

### Components
|Component|Description|Implementation|
| --- | --- | --- |
|Express Server| Central hub handling client requests, API interactions, and view rendering| Initialized in _server.js_|
|Pug View Engine| Template for generating HTML responses| Configured in _server.js 6-8_|
|Spotify Web API| External service providing user data and recommendations | Accessed via _getData()_ function |
|Static Resources| CSS and other static files for frontend styling| _server.js_ |

## Server Overview
The server implementation is built using Express.js. It acts as the central component, handling HTTP requests, managing authentication with Spotify, fetching user data from Spotify's API, and rendering views to the client.

<p align="center">
    <img src="https://github.com/user-attachments/assets/2d1b02e3-f768-488f-a96f-428ee73d69ad" />
</p>

## Authentication Flow 
The authentication flow involves three main routes:
- /**authorize** Route _(server.js 24-38)_: Initiates authentication by redirecting to Spotify's authorization endpoint with required parameters:
    - **response_type**: Set to "code" for authorization code flow
    - **client_id**: Application's Spotify client ID
    - **scope**: Required permissions (user-library-read user-top-read)
    - **redirect_uri**: Callback URL for handling authorization response
- /**callback** Route _(server.js 40-67)_: Handles the authorization response from Spotify:
    - Receives authorization code from Spotify
    - Exchanges code for access token via POST request to Spotify's token endpoint
    - Stores access token globally
    - Redirects user to dashboard
- /**logout** Route _(server.js 132-135)_: Handles user logout by clearing the access token.

<p align="center">
    <img src="https://github.com/user-attachments/assets/f8362f05-e104-455d-baec-f166b558dd1d" width="600" />
</p>

## Data Flow
The application uses the getData() function to retrieve user data from Spotify's API. This function handles the HTTP requests and authentication with the user's access token.

<p align="center">
    <img src="https://github.com/user-attachments/assets/7f9ca5b8-e6d0-4fe1-8dab-5bd2d3f4c17c" width="600" />
</p>


## Frontend
The application uses Pug (formerly Jade) as its templating engine to generate HTML dynamically. The templates follow a hierarchical inheritance pattern with a base layout. 

### Base Template

The application uses a base template _(layout.pug)_ that defines the common HTML structure shared by all pages. This template establishes the HTML document structure, includes necessary CSS resources, and defines a content block that child templates can fill.

- Document Structure: Defines HTML5 doctype and basic HTML structure
- Head Section: Contains the page title "My Spotify API app ✨" and links to external and internal stylesheets
- Body Section: Contains a content block that will be filled by child templates
- CSS Integration: Links to both Spotify Bootstrap CSS and a custom stylesheet

<p align="center">
    <img src="https://github.com/user-attachments/assets/c0d22971-c3ee-4855-91b9-041ab38f41b1" />
</p>

There are three main view templates that extend the base template:
1. **Index** Template (Landing Page): The entry point to the application. It extends the base layout and provides a login button to authorize with Spotify.
2. **Dashboard** Template: Displays the user's profile and extensive music data. The dashboard template is divided into several sections:
    - User Profile Section: Displays user image, ID, and logout link
    - Top Genres Section: Lists the user's top 5 genres
    - Time-based Sections: Three separate sections showing top artists and tracks for different time periods:
        - Short term (Last 4 weeks)
        - Medium term (Last 6 months)
        - Long term (All time)
    - Recently Liked Tracks: Shows recently saved tracks with links to get recommendations based on those tracks. Each track listing includes:
        - Position number
        - Album cover image
        - Track name with preview link
        - Artist name
3. **Recommendation** Template: Displays a list of tracks recommended by Spotify's API based on the user's preferences or selected seed tracks.

## Frontend-Backend Integration
<p align="center">
    <img src="https://github.com/user-attachments/assets/9c4d9a9f-6271-4001-a5f9-264ff6ab4db0" />
</p>

1. The Express server handles incoming HTTP requests from the client
2. For routes that require data from Spotify, the server makes API calls using the user's access token
3. The server processes the API response and extracts relevant data
4. The server passes this data to the appropriate Pug template as variables
5. The Pug template engine renders the template with the provided data
6. The resulting HTML is sent back to the client browser

## Architecture Limitations
The current architecture has several limitations worth noting:
1. **Authentication Storage:** The application uses a global variable _(global.access_token in server.js 16)_ to store the access token, which:
    - Limits the application to a single authenticated user at a time
    - Doesn't persist across server restarts
    - Lacks token refresh capability when tokens expire
2. **Limited Error Handling:** The code doesn't implement comprehensive error handling for API failures or authentication issues.
3. **Fixed Configuration:** Client ID, client secret, and redirect URI are currently hardcoded rather than using environment variables _(server.js 12-14)_.
4. **Fixed Genre Seed:** Recommendations always use "rock" as a genre seed regardless of user preferences _(server.js 123)_.
