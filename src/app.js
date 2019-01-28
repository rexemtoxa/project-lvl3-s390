import validator from 'validator';
import { watch } from 'melanke-watchjs';
import _ from 'lodash';


const render = ({ input }) => {
  const { value, valid } = input;

  const inputLink = document.querySelector('input');
  inputLink.value = value;
  const button = document.querySelector('button');
  button.disabled = !valid;
  if (valid) {
    inputLink.classList.remove('is-invalid');
    inputLink.classList.add('is-valid');
  } else {
    inputLink.classList.remove('is-valid');
    inputLink.classList.add('is-invalid');
  }
};

export default () => {
  const state = {
    input: {
      valid: false,
      value: '',
    },
    listFeed: {},
  };

  const input = document.getElementById('link');
  input.addEventListener('change', ({ target }) => {
    const { value } = target;
    state.input.value = value;
    state.input.valid = validator.isURL(value) && !_.has(state.listFeed, value);
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = event;
    state.listFeed = { ...state.listFeed, value };
    state.input.value = '';
    state.input.valid = false;
    console.log(state.listFeed);
  });

  watch(state, () => render(state));
};
