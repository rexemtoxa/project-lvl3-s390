export default (message) => {
  const div = document.getElementById('myAlert');
  const html = message.length === 0 ? '' : `
  <div class="alert alert-dark justify-content-center mx-auto text-center shadow p-3 mb-5 bg-white rounded" style="width: 1200px; font-size: 32px" role="alert">
${message}
  </div>
  `;
  div.innerHTML = html;
};
