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

// ###############################################################################################
// Platform Dropdown Selector - code based on https://www.w3schools.com/howto/howto_custom_select.asp

/* Look for any elements with the class "platformSelector": */
const platformSelectorDiv = document.getElementsByClassName('platformSelector')
const platformSelect = platformSelectorDiv[0].getElementsByTagName('select')[0]
/* For each element, create a new DIV that will act as the selected item: */
const newSelectedOptionDiv = document.createElement('div')
newSelectedOptionDiv.setAttribute('class', 'select-selected')
// sets innerHTML of top div to the innerHTML of selected option using <select>.selectedIndex
newSelectedOptionDiv.innerHTML = platformSelect.options[platformSelect.selectedIndex].innerHTML
// append to platformSelector div
platformSelectorDiv[0].appendChild(newSelectedOptionDiv)
/* For each element, create a new DIV that will contain the option list: */
let newDropdownList = document.createElement('div')
newDropdownList.setAttribute('class', 'select-items select-hide')
for (let i = 1; i < platformSelect.length; i++) {
  /* For each option in the original select element,
    create a new DIV that will act as an option item: */
  let dropdownDiv = document.createElement('div')
  dropdownDiv.innerHTML = platformSelect.options[i].innerHTML;
  dropdownDiv.addEventListener('click', function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
  newDropdownList.appendChild(dropdownDiv)
}
platformSelectorDiv[0].appendChild(newDropdownList);
newSelectedOptionDiv.addEventListener("click", function(e) {
  /* When the select box is clicked, close any other select boxes,
  and open/close the current select box: */
  e.stopPropagation();
  closeAllSelect(this);
  this.nextSibling.classList.toggle("select-hide");
  this.classList.toggle("select-arrow-active");
});

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

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
// Games Lists
class Games {
  constructor () {
    this.searchList = {}
    this.myGamesList = {
      nes: {},
      master : {},
      gameboy: {},
      gamegear: {},
      genesis: {},
      snes: {}
    }
    this.wishList = {
      nes: {},
      master : {},
      gameboy: {},
      gamegear: {},
      genesis: {},
      snes: {}
    }
  }
  logSearchResults(data, platformName, platformId) {
    // add property platformName so that games with multiple platforms can be kept track of separatly when added to myGamesList or wishList
    for (const game of data) {
      game.platformName = platformName
      game.platformId = platformId
      console.log(game.cover)
      if (game.cover != null) {
        this.addSearchList(game)
      }
    }
  }

  addSearchList(game) {
    this.searchList[game.id] = new Game(game)
    // check if games are already in myGamesList or wishList for icon display.  updateListStatus will also add or update the list status property of the game
    // this.updateListStatus(this.myGamesList, this.searchList[game.id])
    // this.updateListStatus(this.wishList, this.searchList[game.id])
  }

  updateListStatus(list, game) {
    console.log(list + ' list status')
    // check list for game - using game.properties so that list icon can change without updating diplay
    // 
  }

  
  clearList(list) {
    this[list] = {}
  }
  addMyGamesList(event) {
    // console.log(event)
    // console.log(parseInt(event.path[2].dataset.id))
    // console.log(event.path[2].dataset.platform)
    let gameId = parseInt(event.path[2].dataset.id)
    let platform = event.path[2].dataset.platform
    let game = this.searchList[gameId]
    this.myGamesList[platform][gameId] = game
    
  }
  addWishList() {
    console.log('add wishList')
  }

  findReleaseDateForPlatform(releaseDates, platformId) {
    let date = ''
    // first iterate over releaseDates and check for region 2 or North America
    releaseDates.forEach((releaseDate) => {
      if (releaseDate.region === 2 && releaseDate.platform == platformId && date === '') {
        date = releaseDate.human
      }
    })
    // if not found iterate over releaseDates and check for region 8 or Worldwide
    if (date === '') {
      releaseDates.forEach((releaseDate) => {
        if (releaseDate.region === 8 && releaseDate.platform == platformId && date === '') {
        date = releaseDate.human
        }
      })
    }
    // if release date is still not found grab first one in releaseDates array
    if (date === '') {
        date = releaseDates[0].human
    }
    return date
  }

  displaySearchResults() {
    let searchResultsContainer = document.getElementById('searchResults')
    for (const game in this.searchList) {
      let resultDiv = document.createElement('div')
      // add class so that elements can be removed by searching for class
      resultDiv.className = 'resultContainer'
      // assign gameId property so that divs can be searched for and if clicked referenced in searchList
      resultDiv.dataset.id = this.searchList[game].id
      resultDiv.dataset.platform = this.searchList[game].platformName
      searchResultsContainer.appendChild(resultDiv)

      // cover art div
      let coverImg = document.createElement('img')
      coverImg.className = 'cover'
      coverImg.src = `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.searchList[game].cover.image_id}.jpg`
      resultDiv.appendChild(coverImg)

      // title and summary
      let titleDivContainer = document.createElement('div')
      titleDivContainer.className = 'titleContainer'
      let titleDiv = document.createElement('div')
      titleDiv.className = 'title'
      titleDiv.innerText = this.searchList[game].name
      titleDivContainer.appendChild(titleDiv)
      let summaryDiv = document.createElement('div')
      summaryDiv.className = 'summary'
      let summaryArray = this.searchList[game].summary.split('.')
      let summaryBrief = ''
      for (let sentence of summaryArray) {
        if (summaryBrief.length < 400) {
          summaryBrief += sentence + '. '
        }
      }
      summaryDiv.innerText = summaryBrief
      titleDivContainer.appendChild(summaryDiv)
      let releaseDateDiv = document.createElement('div')
      releaseDateDiv.className = 'releaseDate'
      releaseDateDiv.innerText = 'Release Date: ' + this.findReleaseDateForPlatform(this.searchList[game].releaseDates, this.searchList[game].platformId)
      titleDivContainer.appendChild(releaseDateDiv)
      resultDiv.appendChild(titleDivContainer)

      // listIcons
      let listIconsContainer = document.createElement('div')
      listIconsContainer.className = 'listIconsContainer'
      let myGamesIconDiv = document.createElement('div')
      myGamesIconDiv.className = 'listIcon fa-solid fa-list-check fa-2x'
      myGamesIconDiv.id = 'myGamesIcon'
      myGamesIconDiv.addEventListener('click', this.addMyGamesList.bind(this))
      let wishIconDiv = document.createElement('div')
      wishIconDiv.className = 'listIcon fa-solid fa-gift fa-2x'
      wishIconDiv.id = 'wishIcon'
      wishIconDiv.addEventListener('click', this.addWishList.bind(this))
      listIconsContainer.appendChild(myGamesIconDiv)
      listIconsContainer.appendChild(wishIconDiv)
      resultDiv.appendChild(listIconsContainer)


      

      
      
    }
  }
  clearDisplay() {
    let toBeRemoved = document.querySelectorAll('.resultContainer')
    for (const element of toBeRemoved) {
      element.remove()
    }
  }
}

class Game {
  constructor(game) {
    this.artworks = game.artworks
    this.cover = game.cover
    this.firstReleaseDate = game.first_release_date
    this.id = game.id
    this.name = game.name
    this.platformId = game.platformId
    this.platformName = game.platformName
    this.platforms = game.platforms
    this.releaseDates = game.release_dates
    this.screenshots = game.screenshots
    this.summary = game.summary
    this.videos = game.videos
  }
}

gamesList = new Games()

// IGDB API calls ################################################
// igdb url
const getIgdbUrl = (resource) => {
    let igdbUrl = ''
    if (useCorsAnywhere) {
        igdbUrl += corsAnywhere;
    }
    return igdbUrl = igdbUrl + igdbBaseUrl + resource.toString()
}

async function getIgdbData(resource, query) {
  const res = await fetch(getIgdbUrl(resource), {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'Client-ID': twitchOAuth.client_id,
        'Authorization': `Bearer ${twitchToken.access_token}`
    },
    body: query
  });
  return res
};

// IGDB query
let igdbResource = 'games'
let searchInput = ''
const searchButton = document.querySelector('#searchButton')
const textInput = document.querySelector('#inputBar')
const myGamesButton = document.querySelector('#myGamesButton')
const wishListButton = document.querySelector('#wishListButton')
// let searchResults = {}

const buildSearch = (event) => {
    event.preventDefault()

    console.log(platformSelect.options[platformSelect.selectedIndex].value)
    let platformName = platformSelect.options[platformSelect.selectedIndex].value
    searchInput = textInput.value.toLowerCase()

    let platformId = '18'
    switch (platformName) {
      case 'all':
        platformId = '18, 19, 22, 29, 33, 35, 64'
        break
      case 'nes':
        platformId = '18'
        break
      case 'master':
        platformId = '64'
        break
      case 'gameboy':
        platformId = '22, 33'
        break
      case 'gamegear':
        platformId = '35'
        break
      case 'genesis':
        platformId = '29'
        break
      case 'snes':
        platformId = '19'
        break
    }
    // build query
    // igdbQuery = `fields *; search "mario"; limit 10;`
    // igdbQuery = `fields *; limit 100; sort id asc;`
    // igdbQuery = `search "Super Mario"; fields *; where platforms = 18; limit 100;`
    // igdbQuery = `search "${searchInput}"; fields *; where platforms = (${platformId}) & (age_ratings != null | category = 3) ; limit 50;`
    
    let igdbBaseQuery = `fields artworks.*, cover.*, first_release_date, name, platforms, release_dates.*, screenshots.*, summary, videos.*;
                where platforms = (${platformId}) & (age_ratings != null | category = 3);
                limit 50;`
    if (searchInput === '') {
      igdbQuery = igdbBaseQuery
    } else {
    igdbQuery = `search "${searchInput}"; 
                fields artworks.*, cover.*, first_release_date, name, platforms, release_dates.*, screenshots.*, summary, videos.*;
                where platforms = (${platformId}) & (age_ratings != null | category = 3);
                limit 50;`
    }
    getIgdbData(igdbResource, igdbQuery)
    .then((res) => res.json())
    .then(data => {
        console.log(data)
        // searchResults = data
        gamesList.clearList('searchList')
        gamesList.clearDisplay()
        // pass in platformName of the current search (nes, snes, genesis, etc) to add to game object
        gamesList.logSearchResults(data, platformName, platformId)
        gamesList.displaySearchResults()
    });
    
}



// Event Listeners
searchButton.addEventListener('click', buildSearch)
