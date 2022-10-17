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
// API Search calls
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
    body: igdbQuery
  });
  return res
};

// igdb query
let igdbQuery = 'fields *; where id = 1943;'
let igdbResource = 'games'
const searchButton = document.querySelector('#searchButton')
const textInput = document.querySelector('#inputBar')
let searchData = {}

const buildSearch = (event) => {
    event.preventDefault()

    console.log(platformSelect.options[platformSelect.selectedIndex].value)
    let platform = platformSelect.options[platformSelect.selectedIndex].value
    let searchInput = textInput.value.toLowerCase()
    
    getIgdbData(igdbResource, igdbQuery)
    .then((res) => res.json())
    .then(data => {
        console.log(data)
        searchResult = data
    });
}

class Game {
  constructor() {

  }
}


// Event Listeners
searchButton.addEventListener('click', buildSearch)