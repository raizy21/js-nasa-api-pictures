/***************
 *
 * links
 * {@link} - https://getloaf.io/
 * {@link} - https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
 * {@link} - https://api.nasa.gov/
 * {@link} - https://www.w3schools.com/jsref/jsref_includes.asp
 * {@link} - https://www.w3schools.com/js/js_json_stringify.asp
 * {@link} - https://www.w3schools.com/js/js_json_parse.asp
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
 *
 ****************/
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


//nasa api
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};


function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }

    loader.classList.add('hidden');
}

function createDomNodes(page) {
    //console.log(page);
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    //console.log('current Array: ', page, currentArray);
    currentArray.forEach((result) => {
        //card container
        const card = document.createElement('div');
        card.classList.add('card');
        //link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'view full image';
        link.target = '_blank';
        //image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'nasa picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');

        if (page === 'results') {
            saveText.textContent = 'add to favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);

        } else {
            saveText.textContent = 'remove favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        //card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`;

        //append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        //console.log(card);
        imagesContainer.append(card);
    });
}



function updateDOM(page) {

    //get favorites from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        //console.log('favorites from local storage', favorites);
    }
    imagesContainer.textContent = '';
    createDomNodes(page);
    showContent(page);
}


//get 10 images from nasa api
async function getNasaPictures() {
    //show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log(resultsArray);
        updateDOM('results');
    } catch (error) {
        //catch error here
        console.log('error: ', error);
    }
}

//add result to favorite
function saveFavorite(itemUrl) {
    //console.log(itemUrl);
    //loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            //console.log(favorites);
            //show save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            //set favorites in loacal storage
            //console.log(JSON.stringify(favorites));
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));

        }
    });
}

// remove item form favorites 
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        //set favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

//on load 
getNasaPictures();