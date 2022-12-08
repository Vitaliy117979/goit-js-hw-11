import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhoto } from './fetchPhoto';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  onLoadButton: document.querySelector('.load-more'),
};
const { searchQuery } = refs.form.elements;

let page = 1;
let gallery = new SimpleLightbox('.gallery a');

refs.onLoadButton.disabled = true;

refs.form.addEventListener('submit', onSearch);
refs.onLoadButton.addEventListener('click', () => {
  refs.onLoadButton.disabled = true;
  onLoad();
});

function onSearch(e) {
  e.preventDefault();
  refs.gallery.innerHTML = ""

  const value = searchQuery.value;

  fetchPhoto(value, page)
    .then(data => {
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        createMurkupRender(data.hits)
      );
      gallery.refresh();

      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function onLoad() {
  page += 1;
  const value = searchQuery.value;

  fetchPhoto(value, page).then(data => {
    refs.gallery.insertAdjacentHTML('beforeend', createMurkupRender(data.hits));
    gallery.refresh();

    console.log(page);
    if (data.total === data.totalHits) {
      refs.onLoadButton.disabled = true;
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    }
  });
}

function createMurkupRender(arr) {
  refs.onLoadButton.disabled = false;
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card"> 
    <div class="thumb"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/></div>
    <div class="info">
      <p class="info-item">
        <b>Likes <br>${likes}</b>
      </p>
      <p class="info-item">
        <b>Views <br>${views}</b>
      </p>
      <p class="info-item">
        <b>Comments <br>${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads <br>${downloads}</b>
      </p>
    </div>
  </div></a>`
    )
    .join('');
}


