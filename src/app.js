import validator from 'validator';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import renderInput from './renderInput';
import renderList from './renderList';
import parseXml from './parser';

// http://lorem-rss.herokuapp.com/feed?unit=minute&interval=7

export default () => {
  const state = {
    input: {
      valid: false,
      submitDisable: true,
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
    state.input.valid = (validator.isURL(value) && !(state.listFeed.has(value)));
  });

  const proxy = 'https://cors-anywhere.herokuapp.com/';

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = input;
    const linkProxy = `${proxy}${value}`;
    state.input.loading = true;
    axios.get(linkProxy).then((res) => {
      const rssFlow = parseXml(res.data, linkProxy);
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
