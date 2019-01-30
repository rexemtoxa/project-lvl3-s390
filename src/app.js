import validator from 'validator';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import _ from 'lodash';
import renderInput from './renderInput';
import renderList from './renderList';
import parseXml from './parser';
import renderModal from './renderModal';

// http://lorem-rss.herokuapp.com/feed?unit=minute

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
    modal: {
      show: false,
      description: '',
    },
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
    const requests = flowsFeed.map(({ url }) => axios.get(url));
    axios.all(requests).then((responses) => {
      const newFeeds = responses.map(res => parseXml(res.data, res.config.url));
      if (isChanged(flowsFeed, newFeeds)) {
        const updatedFlowsFeeds = flowsFeed.reduce((acc, value, index) => {
          const { items } = value;
          const newValue = {
            ...value,
            items: _.unionWith(newFeeds[index].items, items, _.isEqual),
          };
          return [...acc, newValue];
        }, []);

        const amountNewFlows = state.flowsFeed.length - updatedFlowsFeeds.length;

        if (amountNewFlows === 0) {
          state.flowsFeed = updatedFlowsFeeds;
        } else {
          const newFlows = state.flowsFeed.slice(0, amountNewFlows);
          state.flowsFeed = [...newFlows, ...updatedFlowsFeeds];
        }
      } else {
        setTimeout(update, 5000, flowsFeed);
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  const handlerBtnOpenModal = ({ target }) => {
    const currentTitle = target.nextElementSibling.textContent;

    const id = target.parentElement.dataset.title;
    const flowTitle = document.getElementById(id).textContent;


    console.log(flowTitle);
    const { items } = state.flowsFeed.find(({ title }) => title === flowTitle);
    const { linkDescription } = _.find(items, ({ titleArticle }) => titleArticle === currentTitle);
    state.modal.description = linkDescription;
    state.modal.show = true;
  };

  watch(state.modal, () => renderModal(state.modal));

  watch(state.input, () => renderInput(state.input));
  watch(state, 'flowsFeed', () => {
    renderList(state.flowsFeed, handlerBtnOpenModal);
    setTimeout(update, 5000, state.flowsFeed);
  });
};
