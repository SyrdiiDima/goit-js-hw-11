import fetchImages from './fetch-images';
import cardsSearch from '../cards-search.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
////
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  finalText: document.querySelector('.final-text'),
};

const { searchForm, gallery, btnLoadMore, finalText } = refs;

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function renderImageCard(arr) {
  const markup = arr.map(item => cardsSearch(item)).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  currentPage = 1;
  refs.searchForm.reset();

  if (searchQuery === '') {
    return alert('Please enter a valid request');
  }
  

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    btnLoadMore.classList.remove('is-hidden');
  } else {
    btnLoadMore.classList.add('is-hidden');
    finalText.classList.remove('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderImageCard(response.hits);
      lightbox.refresh();

      finalText.classList.add('is-hidden');
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.classList.add('is-hidden');
      finalText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}
//////////// loadmore btn ////////
btnLoadMore.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderImageCard(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    btnLoadMore.classList.add('is-hidden');
    finalText.classList.remove('is-hidden');
  }
}
