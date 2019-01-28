export default (list) => {
  const div = document.querySelector('div.list');
  const html = `<ul>${list.map(({ title, description, items }) => `<li class="list-group-item list-group-item-secondary"><h5>${title}</h5>
  <p>${description}</p></li>
  <ul>
    ${items.map(({ titleArticle, linkArticle }) => `
      <li class="">
        <div class="col-4">
          <a btn-sm" href="${linkArticle}">${titleArticle}</a>
        </div>
      </li>`).join('')}
  </ul>
`).join('')}
  </ul>`;
  div.innerHTML = html;
};
