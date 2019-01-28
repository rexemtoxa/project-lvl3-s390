export default (state) => {
  const { value, valid, loading } = state;

  const inputLink = document.querySelector('input');
  inputLink.value = value;
  if (valid) {
    inputLink.classList.remove('is-invalid');
    inputLink.classList.add('is-valid');
  } else {
    inputLink.classList.remove('is-valid');
    inputLink.classList.add('is-invalid');
  }
  const button = document.querySelector('button');
  button.disabled = !valid;
  if (loading) {
    button.textContent = 'loading';
  } else {
    button.textContent = 'add link';
  }
};
