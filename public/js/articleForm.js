(function () {
  const TITLE_MAX_SIZE = 100;
  const SHORT_DISCRIPTION = 200;
  const IMAGES_MAX_AMOUNT = 10;

  let OPERATION;

  const currentArticleHtml = heyId('post-page');
  let currentArticleId;
  const form = heyId('edit-form');

  function showArticleDetailViewHandler(event) {
    const t = event.target;
    if (t.className !== 'show-more-article-button' &&
      t.tagName !== 'H2' &&
      t.className !== 'post-image') {
      return;
    }

    const id = t.parentNode.id;
    currentArticleId = id;
    OPERATION = 'EDIT';

    requests.getArticle(id).then(
      (article) => {
        displayPostPageForm(article);
        const images = queryAll('#edit-form-images-container div');
        [].forEach.call(images, item => item.addEventListener('click', deleteImageBlock));
      },
      status => messageService.showErrorForm(`Статья не найдена. ${status}`)
    );
  }

  function displayPostPageForm(article) {
    window.scrollTo(0, 0);
    const cont = heyId('post-page');

    cont.querySelector('h1').textContent = article ? article.title : 'title';
    form.postName.value = article ? article.title : '';

    const shd = article ? article.shortDescription : 'description';
    cont.querySelector('h6').textContent = shd;
    form.shortDiscription.value = article ? article.shortDescription : '';

    heyQuery('#post-page .image-container').style.display = 'block';

    initDetailViewImages(article ? article.images : ['../img/image-template.png']);

    cont.querySelector('p').innerHTML = article ? article.text : 'text';
    form.text.value = article ? article.text : '';
    cont.querySelector('.author-name').textContent = article ? article.author : '';

    const date = article ? convDate(article.createdAt) : convDate(new Date());
    cont.querySelector('.publication-date').textContent = date;

    initDetailViewTags(article ? article.tags || [] : []);

    heyId('post-page').style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }

  function initDetailViewImages(images) {
    if (!images.length) {
      heyQuery('#post-page .image-container').style.display = 'none';
      heyId('dots-container').style.display = 'none';
      return;
    }

    let slidesHtml = '';
    let dotsHtml = '';
    heyId('edit-form-images-container').innerHTML = '';

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
    if ((text.length > TITLE_MAX_SIZE) || (text.length === 0)) {
      form.postName.className = 'wrong';
      return;
    }

    currentArticleHtml.querySelector('h1').textContent = text;
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
    currentArticleHtml.querySelector('p').textContent = text;
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
      text: form.text.value,
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
    heyId('exclamation-form-ok-button').addEventListener('click', handler);

    function handler() {
      heyId('exclamation-form-ok-button').removeEventListener('click', handler);
      requests.deleteArticle(currentArticleId).then(
        () => {
          messageService.showMessageForm('Новость успешно удалена из ленты.', 'Готово');
          articleList.displayMainPage();
        },
        status => messageService.showErrorForm(`Ошибка удаления${status}`)
      );
    }
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
    const promise = requests.getArticleFormMeduza(url);
    promise.then(displayPostPageForm, messageService.showErrorForm);
    messageService.hideUrlInputForm();
  }

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
