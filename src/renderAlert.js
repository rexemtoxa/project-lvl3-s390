export default (message) => {
  const div = document.getElementById('myAlert');
  const html = message.length === 0 ? '' : `
  <div class="alert alert-dark" role="alert">
${message}
  </div>
  `;
  div.innerHTML = html;
};
