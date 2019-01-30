export default ({ description }) => {
  const modalContent = document.querySelector('.modal-body');
  modalContent.innerHTML = description;
};
