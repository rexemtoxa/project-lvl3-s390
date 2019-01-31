export default (message) => {
  const div = document.getElementById('myAlert');
  const html = message.length === 0 ? '' : `<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Oops </strong>${message}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
`;
  div.innerHTML = html;
};
