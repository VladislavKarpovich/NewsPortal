(function () {
  const TITLE_MAX_SIZE = 100;
  const SHORT_DISCRIPTION = 200;
  const IMAGES_MAX_AMOUNT = 10;

  let OPERATION;

  const currentArticleHtml = heyId('post-page');
  let currentArticleId;
  const form = heyId('edit-form');

  function showArticleDetailViewHandler(event) {
    const id = getArticleId(event);
    if (!id) return;

    currentArticleId = id;
    OPERATION = 'EDIT';
    requests.getArticle(id)
      .then(displayPostPage, articleNotFound);

    messageService.showLoader();
  }

  function getArticleId(event) {
    const t = event.target;
    const isButton = t.className === 'show-more-article-button';
    const isTitle = t.tagName === 'H2';
    const isPostImg = t.className === 'post-image';

    if (!isButton && !isTitle && !isPostImg) return null;
    if (isButton) return t.parentNode.id;
    return t.parentNode.parentNode.id;
  }

  function displayPostPage(article) {
    messageService.hideLoader();
    displayPostPageForm(article);
    const images = queryAll('#edit-form-images-container div');
    const forEach = Array.prototype.forEach;
    forEach.call(images, item =>
      item.addEventListener('click', deleteImageBlock));
  }

  function articleNotFound(status) {
    const message = `Статья не найдена. ${status}`;
    messageService.showErrorForm(message);
  }

  function displayPostPageForm(article) {
    messageService.hideLoaderSuccessful();
    window.scrollTo(0, 0);
    const cont = heyId('post-page');
    heyId('post-page').style.display = 'block';
    document.body.style.overflowY = 'hidden';

    heyQuery('#post-page .image-container').style.display = 'block';
    const date = article ? convDate(article.createdAt) : convDate(new Date());
    cont.querySelector('.publication-date').textContent = date;
    initDetailViewTags(article ? article.tags || [] : ['Другое']);

    if (article) displayArticlePostPageForm(article);
    else displayEmptyPostPageForm();
  }

  function displayArticlePostPageForm(article) {
    const blocks = article.text.replace(/<(?:.|\n)*?>/gm, '#').split('#');
    const text = blocks.join('\n').replace(/[\n]+/g, '\n');
    const textHtml = article.text;

    postNameChanged(article.title);
    form.postName.value = article.title;
    shortDiscriptionChanged(article.shortDescription);
    form.shortDiscription.value = article.shortDescription;
    textContentChanged(textHtml);
    form.text.value = text;

    const cont = heyId('post-page');
    cont.querySelector('.author-name').textContent = article.author;
    initDetailViewImages(article.images);
  }

  function displayEmptyPostPageForm(article) {
    postNameChanged('');
    form.postName.value = '';
    shortDiscriptionChanged('');
    form.shortDiscription.value = '';
    textContentChanged('');
    form.text.value = '';
    initDetailViewImages([]);

    const username = heyQuery('.header-user-panel-container h1').textContent;
    const cont = heyId('post-page');
    cont.querySelector('.author-name').textContent = username;
  }

  function initDetailViewImages(images) {
    heyId('edit-form-images-container').innerHTML = '';
    if (!images.length) {
      heyQuery('#post-page .image-container').style.display = 'none';
      heyId('dots-container').style.display = 'none';
      return;
    }

    let slidesHtml = '';
    let dotsHtml = '';

    for (let i = 0; i < images.length; i++) {
      slidesHtml += `<div class="slides fade"><img src="${images[i]}"></div>`;
      dotsHtml += `<span class="dot">${i + 1}</span>`;
      addDetailViewFormImageBlock(images[i], i);
    }

    heyId('slides-container').innerHTML = slidesHtml;
    heyId('dots-container').innerHTML = dotsHtml;
    heyQuery('#post-page .image-container').style.display = 'block';
    heyId('dots-container').style.display = 'block';
  }

  function addDetailViewFormImageBlock(image, i) {
    const temp = heyId('template-detail-view-image').content;
    const id = `image-edit-form-container-${new Date().getTime()}${i || ''}`;
    temp.querySelector('div').id = id;
    temp.querySelector('input').value = (image) || '';

    const imageBlock = temp.querySelector('div').cloneNode(true);
    heyId('edit-form-images-container').appendChild(imageBlock);
    return id;
  }

  function convDate(date) {
    return `${date.getUTCFullYear()}/${
      (`0${date.getUTCMonth() + 1}`).slice(-2)}/${
      (`0${date.getUTCDate()}`).slice(-2)} ${
      (`0${date.getUTCHours()}`).slice(-2)}:${
      (`0${date.getUTCMinutes()}`).slice(-2)}`;
  }

  function initDetailViewTags(tags) {
    let tagsHtml = '';
    const tagsCheckBoxes = queryAll('.edit-form-tags input');

    [].forEach.call(tagsCheckBoxes, item => item.checked = false);
    tags.forEach((item) => {
      tagsHtml += ` ${item}`;
      switch (item) {
        case 'Разработка':
          tagsCheckBoxes[0].checked = true;
          break;
        case 'Администрирование':
          tagsCheckBoxes[1].checked = true;
          break;
        case 'Дизайн':
          tagsCheckBoxes[2].checked = true;
          break;
        case 'Управление':
          tagsCheckBoxes[3].checked = true;
          break;
        case 'Маркетинг':
          tagsCheckBoxes[4].checked = true;
          break;
        default:
      }
    });
    heyQuery('#post-page .post-tags').textContent = tagsHtml;
  }

  function showAddArticleFormHandler() {
    displayPostPageForm();
    OPERATION = 'ADD';
  }

  function hidePostPageFormHandler() {
    heyId('overlay').style.display = 'none';
    heyId('post-page').style.display = 'none';
    document.body.style.overflowY = '';
  }

  function contentChanged(event) {
    switch (event.target.name) {
      case 'postName':
        postNameChanged(form.postName.value);
        break;
      case 'shortDiscription':
        shortDiscriptionChanged(form.shortDiscription.value);
        break;
      case 'text':
        textContentChanged(form.text.value);
        break;
      default:
        break;
    }
  }

  function postNameChanged(text) {
    currentArticleHtml.querySelector('h1').textContent = text;
    if ((text.length > TITLE_MAX_SIZE) || (text.length === 0)) {
      form.postName.className = 'wrong';
      return;
    }
    form.postName.className = '';
  }

  function shortDiscriptionChanged(text) {
    if (text.length > SHORT_DISCRIPTION) {
      form.shortDiscription.className = 'wrong';
      return;
    }

    currentArticleHtml.querySelector('h6').textContent = text;
    form.shortDiscription.className = '';
  }

  function textContentChanged(text) {
    currentArticleHtml.querySelector('p').innerHTML = text;
  }

  function deleteImageBlock(event) {
    if (event.target.className === 'delete-image-input-button') {
      this.remove();
    }

    if (queryAll('#edit-form-images-container div').length < IMAGES_MAX_AMOUNT) {
      heyId('edit-form-add-image-button').style.display = 'inline';
    }
  }

  function addImageBlock() {
    const id = addDetailViewFormImageBlock('');
    heyId(id).addEventListener('click', deleteImageBlock);

    if (queryAll('#edit-form-images-container div').length >= IMAGES_MAX_AMOUNT) {
      heyId('edit-form-add-image-button').style.display = 'none';
    }
  }

  function saveArticleHandler() {
    if (form.getElementsByClassName('wrong').length !== 0) {
      messageService.showErrorForm('Не валидная статья!');
      return;
    }

    messageService.showExclamationForm('Сохранить изменения?', 'Сохранить');
    const exclamationForm = heyId('exclamation-form-ok-button');

    switch (OPERATION) {
      case 'EDIT':
        exclamationForm.addEventListener('click', editArticle);
        break;
      case 'ADD':
        exclamationForm.addEventListener('click', addArticle);
        break;
      default:
    }
  }

  function addArticle() {
    const newArticle = {
      title: form.postName.value,
      shortDescription: form.shortDiscription.value,
      text: form.text.value.split('\n').map(p => `<p>${p}</p>`).join(''),
      images: getImages(),
      author: heyQuery('#post-page .author-name').textContent,
      tags: getTags(),
    };

    const exclamationForm = heyId('exclamation-form-ok-button');
    exclamationForm.removeEventListener('click', editArticle);

    requests.addArticle(newArticle).then(
      () => messageService.showMessageForm('Новость успешно сохранена.', 'Готово'),
      status => messageService.showErrorForm(`Ошибка сохраненения${status}`)
    );
  }

  function editArticle() {
    const newArticle = {
      title: form.postName.value,
      shortDescription: form.shortDiscription.value,
      text: form.text.value,
      images: getImages(),
      tags: getTags(),
    };

    const exclamationForm = heyId('exclamation-form-ok-button');
    exclamationForm.removeEventListener('click', editArticle);

    requests.updateArticle(currentArticleId, newArticle).then(
      () => messageService.showMessageForm('Новость успешно сохранена.', 'Готово'),
      status => messageService.showErrorForm(`Ошибка сохраненения${status}`)
    );
  }

  function deleteArticleHandler() {
    messageService.showExclamationForm('Удалить новость?', 'Удаление');
    heyId('exclamation-form-ok-button').addEventListener('click', deleteArticle);
  }

  function deleteArticle() {
    heyId('exclamation-form-ok-button').removeEventListener('click', deleteArticle);
    messageService.showLoader();
    requests.deleteArticle(currentArticleId)
      .then(articleDeletedHandle, articleDeletingErrorHandle);
  }

  function articleDeletedHandle() {
    messageService.hideLoaderSuccessful();
    articleList.displayArticleList();
    document.body.style.overflowY = '';
  }

  function articleDeletingErrorHandle(status) {
    messageService.hideLoader();
    messageService.showErrorForm(status, 'Ошибка удаления!');
    document.body.style.overflowY = '';
  }

  function getImages() {
    const imagesArray = [];
    [].forEach.call(form.getElementsByClassName('image-url-input'), (item) => {
      imagesArray.push(item.value);
    });
    return imagesArray;
  }

  function getTags() {
    const tags = [];
    const tagsCheckBoxes = queryAll('.edit-form-tags label');
    [].forEach.call(tagsCheckBoxes, (item) => {
      if (item.querySelector('input').checked) {
        tags.push(item.textContent);
      }
    });
    return tags;
  }

  function showUrlInputForm() {
    messageService.showUrlInputForm();
    heyId('url-input-form-ok-button').addEventListener('click', loadFromMeduzaHandler);
  }

  function loadFromMeduzaHandler() {
    heyId('url-input-form-ok-button').removeEventListener('click', loadFromMeduzaHandler);
    let url = heyQuery('#url-input-form input').value;
    url = url.replace('https://meduza.io/', '');

    requests.getArticleFormMeduza(url)
      .then(displayPostPageForm, getDataFromMeduzaError);

    messageService.hideUrlInputForm();
    messageService.showLoader();
  }

  function getDataFromMeduzaError(message) {
    messageService.hideLoader();
    messageService.showErrorForm(message);
  }

  const mainBlock = document.querySelector('main');
  mainBlock.addEventListener('click', showArticleDetailViewHandler);
  heyId('user-panel-add-article-button').addEventListener('click', showAddArticleFormHandler);
  heyId('close-post-page-button').addEventListener('click', hidePostPageFormHandler);
  heyId('overlay').addEventListener('click', hidePostPageFormHandler);
  heyId('edit-form-add-image-button').addEventListener('click', addImageBlock);

  heyId('edit-form').addEventListener('keyup', contentChanged);
  heyId('edit-form').addEventListener('change', contentChanged);

  heyId('editing-save-button').addEventListener('click', saveArticleHandler);
  heyId('editing-delete-button').addEventListener('click', deleteArticleHandler);
  heyId('load-from-meduza-button').addEventListener('click', showUrlInputForm);
}());
