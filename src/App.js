/*global swal*/

import React from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import { useState, useEffect } from 'react';


const apiToken = 'BQBmF0tDcYDfUwQ45kBm-01-71DmCNjWA4pdXr3EnyfA1zfl2p2U7jAu5B1sO6zKPq2Sz_VoLTSJh-b4ajzs0xpvgGwruIiqqcf4JPdPE9Q_VGv8IJYfnlLraLabeuTboJn-KISI7wXStGZDAx3okI-k';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

const App = () => {
  const [tracks, setTracks] = useState([{},{}]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [songs, setSongs] = useState([{}, {}, {}]);
  const [songID, setSongID] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');
  const [autresChansons, setAutresChansons] = useState([{},{}]);
  const [nb, setNb] = useState(0);
  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => {
    fetch('https://api.spotify.com/v1/me/tracks', {
    method: 'GET',
    headers: {
    Authorization: 'Bearer ' + apiToken,
    },
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
        setTracks(data['items']);
        
        setNb(getRandomNumber(data['items'].length));
        console.log('length : ', data['items'].length);
        setCurrentTrack(data['items'][nb]['track']);

        const nb1 = getRandomNumber(data['items'].length);
        const nb2 = getRandomNumber(data['items'].length);
        //console.log("nb alea : ",nb1, " / ",nb2);
        setAutresChansons([data['items'][nb1]['track'],data['items'][nb2]['track']]);

        setSongs([data['items'][6]['track'], data['items'][7]['track'], data['items'][10]['track']]);
        setSongID(data['items'][6]['track']['id']);
        
        setSongsLoaded(true);
      })
  }, [])


  const AlbumCover = (props) =>  {
    let chanson = props.track;
    console.log("currentTrack : ", currentTrack);
    console.log("chanson : ", chanson);
    //let src = '';
    const src = chanson['album']['images'][0]['url'];
    //if (!(currentTrack == '')){const src = currentTrack['album']['images'][0]['url'];}
    const previewUrl = chanson['preview_url'];
    //const sons = [chanson[6]['track']['name'], chanson[7]['track']['name'], chanson[10]['track']['name']]
    
    
    return (
      <>
        <img src={src} style={{ width: 400, height: 400 }} />
        <Sound url={previewUrl} playStatus={Sound.status.PLAYING}/>
      </>
    );
  } 

  const BoutonAlea = () => {
    const tableauA = [tracks[nb]['track'], autresChansons[0], autresChansons[1]];
    console.log("tableauA : ", tableauA);
    const tableau = shuffleArray(tableauA);

    return (
      tableau.map(item => (
        <Button onClick={() => checkAnswer(item['id'])}>{item['name']}</Button>
      ))
    )
  }


  const checkAnswer = (id) => {
    if (id === tracks[nb]['track']['id']){
      clearTimeout(timeoutId);
      swal('Bravo', "C'est la bonne réponse", 'success').then(nvlleTrack);
    }
    else {
      swal('Faux !', "Réessayez", 'error');
    }

  }

  const nvlleTrack = () => {
    setNb(getRandomNumber(tracks.length));
    setCurrentTrack(tracks[nb]['track']);

    let nb1 = getRandomNumber(tracks.length);
    let nb2 = getRandomNumber(tracks.length);
    while (nb1 === nb){ nb1 = getRandomNumber(tracks.length); }
    while ((nb2 === nb) || (nb2 === nb1)){ nb2 = getRandomNumber(tracks.length); }
    //console.log("nb alea : ",nb1, " / ",nb2);
    setAutresChansons([tracks[nb1]['track'],tracks[nb2]['track']]);
  }

  useEffect(() => {
    setTimeoutId(setTimeout(() => nvlleTrack(), 30000));
  }, [tracks, nb, autresChansons]);

  const track1 = currentTrack;

  if (songsLoaded){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <p>Vous avez liké {tracks.length} chansons</p>
          <p>La première chanson est "{tracks[0]['track']['name']}"</p>
          <AlbumCover track = {tracks[nb]['track']}></AlbumCover>
        </div>
        <div className="App-buttons">
          <BoutonAlea></BoutonAlea>
          {/* <Button onClick={() => checkAnswer(tracks[nb]['track']['id'])}>{tracks[nb]['track']['name']}</Button>
          <Button onClick={() => checkAnswer(autresChansons[0]['id'])}>{autresChansons[0]['name']}</Button>
          <Button onClick={() => checkAnswer(autresChansons[1]['id'])}>{autresChansons[1]['name']}</Button> */}
        </div>
      </div>
    );
  } else {
    return (<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <img src={loading} className="App-loading" alt="loading"/>
        </div>
        <div className="App-buttons">
        </div>
      </div>
    )
  }
  
}

export default App;
