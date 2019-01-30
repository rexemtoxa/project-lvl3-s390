import validator from 'validator';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import _ from 'lodash';
import renderInput from './renderInput';
import renderList from './renderList';
import parseXml from './parser';

// http://lorem-rss.herokuapp.com/feed?unit=minute&interval=7

const isChanged = (oldState, newState) => (
  (_.differenceWith(newState, oldState, _.isEqual).length) !== 0);

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
      state.input.loading = false;
      console.log(err);
    });
    state.listFeed = state.listFeed.add(value);
    state.input.value = '';
    state.input.valid = false;
  });

  const update = (flowsFeed) => {
    console.log('step1');
    const requests = flowsFeed.map(({ url }) => axios.get(url));
    axios.all(requests).then((responses) => {
      const newFeeds = responses.map(res => parseXml(res.data, res.config.url));
      if (isChanged(flowsFeed, newFeeds)) {
        state.flowsFeed = newFeeds;
      } else {
        setTimeout(update, 5000, flowsFeed);
      }
    }).catch((err) => {
      console.log(err);
    });
  };


  watch(state.input, () => renderInput(state.input));
  watch(state, 'flowsFeed', () => {
    renderList(state.flowsFeed);
    setTimeout(update, 5000, state.flowsFeed);
  });
};
