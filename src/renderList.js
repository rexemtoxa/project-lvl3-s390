import _ from 'lodash';
import renderModal from './renderModal';

export default (list) => {
  const div = document.querySelector('div.list');
  const html = `
  <ul>${list.map(({ title, description, items }) => `
    <li class="list-group-item list-group-item-secondary col-4">
      <h5>${title}</h5>
      <p>${description}</p>
    </li>
    <ul>
      ${items.map(({ titleArticle, linkArticle, linkDescription }) => {
    const id = _.uniqueId('id');
    return `
      <li class="my-1">
        <div>
          ${renderModal(linkDescription, id)}
          <a class="col-6" href="${linkArticle}">${titleArticle}</a>
        </div>
      </li>`;
  }).join('')}
    </ul>
`).join('')}
  </ul>`;

  div.innerHTML = html;
};
