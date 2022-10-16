console.log('main')

// twitch OAuth vars
const twitchOAuth = {
    client_id: '7lwevq8847m3b6kohjj47j7a6imdnf',
    client_secret: 'tc1w2n9jnjr0vbduuknw2g9rc32xc3',
    grant_type: 'client_credentials'
};

const twitchBaseUrl = 'https://id.twitch.tv/oauth2/token';
let twitchToken = {
    access_token: "k2vbk6bi6fyk69e8w08lehqn2fc5vg"
};

// igdb vars
const corsAnywhere = 'https://shielded-mesa-30168.herokuapp.com/'
const useCorsAnywhere = true

const igdbBaseUrl = 'https://api.igdb.com/v4/'

const searchButton = document.querySelector('#searchButton')
const textInput = document.querySelector('#inputBar')
let searchData = {}

// ###############################################################################################
// build twitch post data for OAuth token
let twitchBody = [];
for (let prop in twitchOAuth) {
  let encodedKey = encodeURIComponent(prop);
  let encodedValue = encodeURIComponent(twitchOAuth[prop]);
  twitchBody.push(encodedKey + "=" + encodedValue);
}
twitchBody = twitchBody.join("&");

async function getTwitchToken(url = '', data = '') {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  });
  return res.json();
};

// getTwitchToken(twitchBaseUrl, twitchBody)
//    .then((data) => {
//      console.log(data)
//      twitchToken = data; // JSON data parsed by `data.json()` call
//     })
//     .catch(err => console.log(err));

// some current twitch token
// access_token: "t2bsgq72um22dhfu3vy2z8ydugdx6d"
// access_token: '7olqgdxlx0lnlh7d90qqhwih7hu4y8'

// ###############################################################################################

// igdb url
const getIgdbUrl = (resource) => {
    let igdbUrl = ''
    if (useCorsAnywhere) {
        igdbUrl += corsAnywhere;
    }
    return igdbUrl = igdbUrl + igdbBaseUrl + resource.toString()
}

// igdb query
let igdbQuery = 'fields *; where id = 1943;'
// let igdbQuery = 'fields *;'
// let igdbResource = 'platform'
let igdbResource = 'games'


async function getIgdbData(resource, query) {
  const res = await fetch(getIgdbUrl(resource), {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'Client-ID': twitchOAuth.client_id,
        'Authorization': `Bearer ${twitchToken.access_token}`
    },
    body: 'fields *; where id = 1943;'
  });
  return res
};

const buildSearch = () => {
    let searchInput = textInput.value.toLowerCase()
    console.log(searchInput)
    getIgdbData(igdbResource, igdbQuery)
    .then((res) => res.json())
    .then(data => {
        console.log(data)
        searchResult = data
    });
}

// Event Listeners
searchButton.addEventListener('click', buildSearch)