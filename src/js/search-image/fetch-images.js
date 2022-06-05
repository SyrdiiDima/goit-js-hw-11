import axios from 'axios';

export default async function fetchImages(value, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '27846474-86321aa934b5e53f59beaee5e';
  const url = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}`).then(response => response.data);
}
