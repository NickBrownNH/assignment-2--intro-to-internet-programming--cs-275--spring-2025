let body = document.querySelector(`body`);
let albumNames = document.getElementsByClassName(`album-names`);
let artistNames = document.getElementsByClassName(`artist-names`);
let imageCredits = document.getElementsByClassName(`image-credits`);
let reviewContents = document.getElementsByClassName(`review-contents`);
let reviewCredits = document.getElementsByClassName(`review-credits`);

let pos = -20;

window.onload = () => {
    items();
};

const items = (data) => {
    updateArrows();
    for (let i = 0; i < albumNames.length; i++) {
        albumNames[i].textContent = data.albums[i].album;
        artistNames[i].textContent = data.albums[i].artist;
        artistNames[i].href = data.albums[i].url;

        let creditText = document.createTextNode(`Credit: `);
        imageCredits[i].parentNode.insertBefore(creditText, imageCredits[i]);

        imageCredits[i].textContent = data.albums[i].cover_image.credit;
        imageCredits[i].href = data.albums[i].cover_image.url;

        reviewContents[i].textContent = data.albums[i].review.content;
        reviewCredits[i].textContent = `-` + data.albums[i].review.source;
        reviewCredits[i].href = data.albums[i].review.url;

        let albumPhoto = document.querySelector(
            `.carousel-slides > div:nth-child(${i + 1}) > .album-image`
        );
        albumPhoto.style.backgroundImage = `url('${data.albums[i].cover_image.path}')`;
    }
};

document.addEventListener(`keydown`, (event) => {
    if (event.keyCode === 37 && pos != -2060) {
        pos = pos - 680;
        document.documentElement.style.setProperty(`--slides-position`, pos + `px`);
        updateArrows();
    }
    if (event.keyCode === 39 && pos != -20) {
        pos = pos + 680;
        document.documentElement.style.setProperty(`--slides-position`, pos + `px`);
        updateArrows();
    }
});

let leftArrow = document.querySelector(`nav a:nth-child(1)`);
leftArrow.addEventListener(`click`, () => {
    if (pos != -2060) {
        leftArrow.style.display = `inline-block`;
        pos = pos - 680;
        document.documentElement.style.setProperty(`--slides-position`, pos + `px`);
    }
    updateArrows();
});

let rightArrow = document.querySelector(`nav a:nth-child(2)`);
rightArrow.addEventListener(`click`, () => {
    if (pos != 20) {
        pos = pos + 680;
        document.documentElement.style.setProperty(`--slides-position`, pos + `px`);
    }
    updateArrows();
});

const updateArrows = () => {
    if (pos == -20) {
        rightArrow.style.visibility = `hidden`;
    } else {
        rightArrow.style.visibility = `visible`;
    }

    if (pos == -2060) {
        leftArrow.style.visibility = `hidden`;
    } else {
        leftArrow.style.visibility = `visible`;
    }
};

for (let i = 0; i < 4; i++) {
    updateArrows();

    let carouselSlidesPosition = document.querySelector(`.carousel-slides`);

    let albumDivider = document.createElement(`div`);
    albumDivider.setAttribute(`class`, `album`);
    carouselSlidesPosition.appendChild(albumDivider);

    let topHeaders = document.createElement(`header`);
    albumDivider.appendChild(topHeaders);

    let albumNameHeader = document.createElement(`h2`);
    albumNameHeader.setAttribute(`class`, `album-names`);
    topHeaders.appendChild(albumNameHeader);

    let artistNameHeader = document.createElement(`h3`);
    topHeaders.appendChild(artistNameHeader);

    let artistAnchor = document.createElement(`a`);
    artistAnchor.href = `filler`;
    artistAnchor.classList.add(`artist-names`);
    artistNameHeader.appendChild(artistAnchor);

    let imageDivider = document.createElement(`div`);
    imageDivider.setAttribute(`class`, `album-image`);
    albumDivider.appendChild(imageDivider);

    let creditHeader = document.createElement(`header`);
    albumDivider.appendChild(creditHeader);

    let imageCreditsHeader = document.createElement(`h4`);
    creditHeader.appendChild(imageCreditsHeader);

    let imageCreditsAnchor = document.createElement(`a`);
    imageCreditsAnchor.href = `filler`;
    imageCreditsAnchor.classList.add(`image-credits`);
    imageCreditsHeader.appendChild(imageCreditsAnchor);

    let reviewParagraph = document.createElement(`p`);
    reviewParagraph.classList.add(`review-contents`);
    albumDivider.appendChild(reviewParagraph);

    let bottomHeader = document.createElement(`header`);
    albumDivider.appendChild(bottomHeader);

    let reviewCreditsHeader = document.createElement(`h5`);
    bottomHeader.appendChild(reviewCreditsHeader);

    let reviewCreditsAnchor = document.createElement(`a`);
    reviewCreditsAnchor.href = `filler`;
    reviewCreditsAnchor.classList.add(`review-credits`);
    reviewCreditsHeader.appendChild(reviewCreditsAnchor);
}

let script = document.createElement(`script`);
script.setAttribute(`src`, `json/data.json`);
body.appendChild(script);
