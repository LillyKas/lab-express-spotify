require('dotenv').config();

const express = require('express');
const hbs = require('hbs');



// require spotify-web-api-node package here:


const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get("/", (req, res) => 

{
    res.render("index", {heading: 'home page'})}


);



app.get('/search', (req,res) => {

    spotifyApi.searchArtists(req.query.queryTyped)
    .then(function(data) {
   
      //console.log('Search artists by', data.body.artists.items);
    res.render('artist-search-results', {artists: data.body.artists.items ,doctitle: 'Search Page'})
    
    
    }, function(err) {
      console.error(err);
    });

 })



 app.get('/albums/:id', (req, res, next) => {

    const routeParam = req.params.id;
 
    spotifyApi.getArtistAlbums(routeParam).then(
        function(data) {
            //console.log('ALBUMS', data.body.items );
           res.render('albums', {albums: data.body.items , doctitle: 'Albums Page'})
        },
        function(err) {
          console.error(err);
        }
      );
  });

  app.get('/albums/tracks/:id', (req, res, next) => {

    const routeParam = req.params.id;
    console.log(routeParam)

    spotifyApi.getAlbumTracks(routeParam, { limit : 5, offset : 1 })
  .then(function(data) {
   // console.log(data.body.items);

    res.render('tracks', {tracks: data.body.items , doctitle: 'Tracks Page'})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 
  });





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

