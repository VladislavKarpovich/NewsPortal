(function () {
  function heyId(id) {
    return document.getElementById(id);
  }

  function heyClassName(className) {
    return document.getElementsByClassName(className);
  }

  function heyQuery(query) {
    return document.querySelector(query);
  }

  function queryAll(query) {
    return document.querySelectorAll(query);
  }

  const menu = heyId('main-menu');

  function openMenu() {
    menu.style.right = '0';
    document.body.style.overflowY = 'hidden';
  }

  function closeMenu() {
    menu.style.right = '-101%';
    document.body.style.overflowY = '';
  }

  const burgerButton = heyId('burger-menu-button');
  burgerButton.addEventListener('click', openMenu);

  const closeMenuButton = heyId('close-main-menu-button');
  closeMenuButton.addEventListener('click', closeMenu);

  function tagClickHandler(event) {
    const cl = event.target.className;
    const id = event.target.id;

    const isTagButton = cl === 'header-tag-button';
    const isOkButton = id === 'filter-form-button-ok';
    if (isTagButton || isOkButton) {
      closeMenu();
    }
  }

  function initAuthorsFilter(authors) {
    if (!authors) return;

    const tags = authors.map(a => `<option>${a}</option>`);
    const html = `<option>Все</option>${tags.join()}`;
    heyId('filter-autors').innerHTML = html;
  }

  function init() {
    requests.getAuthors().then(initAuthorsFilter, console.log);
  }

  init();
  heyId('main-menu').addEventListener('click', tagClickHandler);
}());
