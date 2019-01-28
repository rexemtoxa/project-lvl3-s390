import validator from 'validator';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import renderInput from './renderInput';
import renderList from './renderList';
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
// http://www.autoexpress.co.uk/car-news/feed/
// http://www.autocar.co.uk/rss
// http://www.telegraph.co.uk/cars/rss.xml
// http://feeds.bbci.co.uk/news/rss.xml

const parseXml = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const items = [...doc.querySelectorAll('item')].map((item) => {
    const titleArticle = item.querySelector('title').textContent;
    const linkArticle = item.querySelector('link').textContent;
    return { titleArticle, linkArticle };
  });
  return { title, description, items };
};


export default () => {
  const state = {
    input: {
      valid: false,
      value: '',
      loading: false,
    },
    listFeed: new Set(),
    flowsFeed: [],
  };

  const input = document.getElementById('link');
  input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.input.value = value;
    state.input.valid = validator.isURL(value) && !(state.listFeed.has(value));
  });

  const proxy = 'https://cors-anywhere.herokuapp.com/';

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = input;
    state.input.loading = true;
    axios.get(`${proxy}${value}`).then((res) => {
      const rssFlow = parseXml(res.data);
      state.flowsFeed = [rssFlow, ...state.flowsFeed];
      state.input.loading = false;
    }).catch((err) => {
      console.log(err);
      state.input.loading = false;
    });
    state.listFeed = state.listFeed.add(value);
    state.input.value = '';
    state.input.valid = false;
  });

  watch(state.input, () => renderInput(state.input));
  watch(state, 'flowsFeed', () => renderList(state.flowsFeed));
};
