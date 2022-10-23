// ======================= IMDB API ======================= //
const authKey = '012c842bef3de130f841ee794abef215';
const apiPopularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${authKey}&sort_bypopularity.desc`;
const apiSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${authKey}&query=`;
const posterUrlPath = 'https://image.tmdb.org/t/p/w220_and_h330_face';
const smallBannerUrlPath = 'https://www.themoviedb.org/t/p/w500';
const bannerUrlPath = 'https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces';
const language = '&language=pt-BR';

let popularCarouselTag = 'carousel-recommended';
let marvelCarouselTag = 'carousel-my-list';
// const dcMoviesCarouselTag = GetData(apiSearchUrl + 'dc&comics');

const categories = []

function GetData(url) {

    fetch(url + language)
        .then(res => res.json())
        .then(data => {
            GetMoviesFromData(data.results);
        });
};

function GetMoviesFromData(data) {
    let movies = [];
    data.forEach((movie) => {
        movies.push({
            movieTitle: movie.title,
            movieDesc: movie.overview,
            moviePoster: posterUrlPath + movie.poster_path,
            movieBanner: bannerUrlPath + movie.backdrop_path,
            movieSmallBanner: smallBannerUrlPath + movie.backdrop_path,
        })
    })
    categories.push(movies);

}
GetData(apiSearchUrl + 'marvel');
setTimeout(() => {
    GetData(apiPopularUrl);
}, 40);

// ======================= CAROUSEL ======================= //

const carouselSectionQuerySelectorName = '.section-carousel';
const carouselWrapperQuerySelectorName = '.carousel-wrapper';
const carouselQuerySelectorName = '.carousel';
const carouselItemQuerySelectorName = '.carousel-item';
const carouselProgressItemQuerySelectorName = '.progress-item';

const allCarouselSection = document.querySelectorAll(carouselSectionQuerySelectorName)
let itensOnScreen;

let carouselSection;
let carouselWrapper;
let carousel;
let carouselItems;
let carouselProgressItem;
let timerOut = true;

window.addEventListener('resize', () => {
    RefreshWindowSize();
    LoadImages();
})

function RefreshWindowSize() {
    allCarouselSection.forEach((section, sectionIndex) => {
        carouselProgressItem = section.querySelectorAll(carouselProgressItemQuerySelectorName)
        carousel = section.querySelectorAll(carouselQuerySelectorName)


        itensOnScreen = getComputedStyle(carousel[0]).getPropertyValue('--carousel-item-on-screen')

        carouselProgressItem.forEach((progressIndicator, index) => {

            if (index >= carousel.length)
                progressIndicator.classList.add('inactive')
        })


        carousel.forEach((carouselElement, carouselIndex) => {

            carouselItems = carouselElement.querySelectorAll(carouselItemQuerySelectorName)

            carouselItems.forEach((item, index) => {
                item.classList.remove('inactive')
                item.classList.remove('active')


                if (index >= itensOnScreen)
                    item.classList.add('inactive')
                else
                    item.classList.add('active')
            })
        })
    })
}

function SwipeCarousel(carouselSectionQuerySelector, value) {

    if (!timerOut)
        return

    timerOut = false;
    carouselSection = document.querySelector(carouselSectionQuerySelector)
    carouselWrapper = carouselSection.querySelector(carouselWrapperQuerySelectorName)
    carousel = carouselWrapper.querySelectorAll(carouselQuerySelectorName)
    carouselProgressItem = carouselSection.querySelectorAll(carouselProgressItemQuerySelectorName)

    const disabledControl = document.querySelector(carouselSectionQuerySelector + ' .disable')


    if (disabledControl != null)
        disabledControl.classList.remove('disable')

    carouselProgressItem.forEach((p) => {
        p.classList.remove('active')
    })


    let lastPick = 0;

    carousel.forEach((element, index) => {
        let computedStyle = getComputedStyle(element)
        let pos = new WebKitCSSMatrix(computedStyle.transform)
        let gap = computedStyle.gap

        let currentIndex = parseInt(computedStyle.getPropertyValue('--current-index')) + value;

        element.classList.remove('instant')
        let endOfList = Math.floor(carousel.length / 2)
        if (Math.abs(currentIndex) > endOfList) {
            currentIndex = currentIndex > 0 ? -endOfList + lastPick : endOfList - lastPick;
            lastPick++
            element.classList.add('instant')
        }

        element.style.setProperty('--current-index', (currentIndex))


        if (currentIndex == 0)
            carouselProgressItem[index].classList.add('active');

    });

    setTimeout(() => {
        timerOut = true;
    }, 300);
}

// ======================= HEADER INFO ======================= //

const headerImageQuerySelector = '.bg-img';
const headerTitleQuerySelector = '.header-title';
const headerOverviewQuerySelector = '.header-description';

const headerImg = document.querySelector(headerImageQuerySelector);
const headerTitle = document.querySelector(headerTitleQuerySelector);
const headerDesc = document.querySelector(headerOverviewQuerySelector);
let currentMovie;


function LoadImages() {
    setTimeout(() => {


        allCarouselSection.forEach((section) => {
            carouselItems = section.querySelectorAll(carouselItemQuerySelectorName + '.active')

            carouselItems.forEach((item, index) => {
                if (!item.classList.contains('inactive')) {
                    let itemImg = item.querySelector('img');
                    if (section.classList.contains(popularCarouselTag)) {
                        let banner = categories[1][index].movieSmallBanner;
                        let poster = categories[1][index].moviePoster;
                        item.addEventListener('click', function () { LoadInfo(1, index) })
                        itemImg.src = banner != null ? banner : poster;
                    }

                    if (section.classList.contains(marvelCarouselTag)) {
                        let banner = categories[0][index].movieSmallBanner;
                        let poster = categories[0][index].moviePoster;
                        item.addEventListener('click', function () { LoadInfo(0, index) })
                        // item.innerHTML = 'escre';
                        itemImg.src = banner != null ? banner : poster;
                    }
                }
            })
        });
    }, 600);
}

function LoadInfo(catIndex, movieIndex) {
    currentMovie = categories[parseInt(catIndex)][parseInt(movieIndex)];
    headerImg.style.backgroundImage = 'url(' + currentMovie.movieBanner + ')';
    headerImg.classList.add('active');
    let movieTitle = currentMovie.movieTitle.replace(": ", ":<br>");
    headerTitle.innerHTML = movieTitle;
    headerDesc.innerHTML = currentMovie.movieDesc;
}

RefreshWindowSize();
LoadImages();