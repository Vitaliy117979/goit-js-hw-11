import axios from 'axios';
import Notiflix from 'notiflix';

async function fetchPhoto(qwery, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = 'key=31800478-a20a78587ca44585fac1c0189';
  const TYPE_PHOTO = 'photo';

  const response = await axios.get(
    `${BASE_URL}?${KEY}&q=${qwery}&image_type=${TYPE_PHOTO}&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  if (!response.data.total || !qwery) {
    {throw new Error(`Find ${ response.data.total } matches`)}
  }
  return response.data
}

export { fetchPhoto };

