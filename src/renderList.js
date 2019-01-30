import _ from 'lodash';

export default (list, handler) => {
  const div = document.querySelector('div.list');
  const html = `
  <ul>${list.map(({ title, description, items }) => {
    const id = _.uniqueId('titleFlow-');
    return `
    <li class="list-group-item list-group-item-secondary col-4 mx-auto shadow p-3 mb-5 bg-white rounded" style="width: 1200px;">
      <p id="${id}" class="text-center display-4 ">${title}</p>
      <p>${description}</p>
    </li>
    <ul>
      ${items.map(({ titleArticle, linkArticle }) => `
      <li class="my-1">
        <div data-title=${id}>
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModalCenter">
            description
          </button>
          <a class="col-6 text-white bg-secondary" href="${linkArticle}">${titleArticle}</a>
        </div>
      </li>`).join('')}
    </ul>
`;
  }).join('')}
  </ul>`;

  div.innerHTML = html;
  const btns = [...div.querySelectorAll('[data-toggle="modal"]')];
  btns.forEach((btn) => {
    btn.addEventListener('click', handler);
  });
};
