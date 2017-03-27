var articleEditForm = (function () {
    var TITLE_MAX_SIZE = 100;
    var SHORT_DISCRIPTION = 200;
    var IMAGES_MAX_AMOUNT = 10;

    var OPERATION;

    var currentArticleHtml;
    var currentArticleId;
    var form = document.getElementById('edit-form');

    function dispalyPostPage(article, user) {
        if (article) {
            currentArticleId = article.id;
            htmlController.displayPostPage(article);
            OPERATION = 'EDIT';
        } else {
            currentArticleId = 'article' + new Date().getTime();
            htmlController.displayAddPostPage(user, currentArticleId);
            OPERATION = 'ADD';
        }
        addEvents();
        currentArticleHtml = document.getElementById('post-page');
    }

    function addEvents() {
        var images = document.querySelectorAll('#edit-form-images-container div');
        Array.prototype.forEach.call(images, (item) => item.addEventListener('click', deleteImageBlock));
        document.getElementById('edit-form-add-image-button').addEventListener('click', addImageBlock);

        document.getElementById('edit-form').addEventListener('keyup', contentChanged);
        document.getElementById('edit-form').addEventListener('change', contentChanged);

        document.getElementById('editing-save-button').addEventListener('click', saveArticleButtonClicked);
        document.getElementById('editing-delete-button').addEventListener('click', deleteArticleButtonClicked);

    }

    function deleteImageBlock(event) {
        if (event.target.className === 'delete-image-input-button') {
            this.remove();
        }

        if (document.querySelectorAll('#edit-form-images-container div').length < IMAGES_MAX_AMOUNT) {
            document.getElementById('edit-form-add-image-button').style.display = 'inline';
        }
    }

    function addImageBlock() {
        var id = htmlController.addDetailViewFormImageBlock('');
        document.getElementById(id).addEventListener('click', deleteImageBlock);
        if (document.querySelectorAll('#edit-form-images-container div').length >= IMAGES_MAX_AMOUNT) {
            document.getElementById('edit-form-add-image-button').style.display = 'none';
        }
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
        if ((text.length <= TITLE_MAX_SIZE) && (text.length !== 0)) {
            currentArticleHtml.querySelector('h1').textContent = text;
            form.postName.className = '';
        } else {
            form.postName.className = 'wrong';
        }
    }

    function shortDiscriptionChanged(text) {
        if (text.length <= SHORT_DISCRIPTION) {
            currentArticleHtml.querySelector('h6').textContent = text;
            form.shortDiscription.className = '';
        } else {
            form.shortDiscription.className = 'wrong';
        }
    }

    function textContentChanged(text) {
        currentArticleHtml.querySelector('p').textContent = text;
    }

    function saveArticleButtonClicked() {
        if (form.getElementsByClassName('wrong').length === 0) {
            htmlController.showExclamationForm('Сохранить изменения?', 'Сохранить');
            document.getElementById('exclamation-form-ok-button').addEventListener('click', saveArticle);
        } else {
            htmlController.showErrorForm('Не валидная статья!');
        }
    }

    function deleteArticleButtonClicked() {
        htmlController.showExclamationForm("Удалить новость?", "Удаление");
        document.getElementById('exclamation-form-ok-button').addEventListener('click', deleteArticle);
    }

    function saveArticle() {
        switch (OPERATION) {
            case "EDIT":
                editArticle();
                break;
            case "ADD":
                addArticle();
                break;
            default:

        }
    }

    function addArticle() {
        var newArticle = {
            id: currentArticleId,
            title: form.postName.value,
            shortDescription: form.shortDiscription.value,
            text: form.text.value,
            images: getImages(),
            author: document.querySelector('#post-page .author-name').textContent,
            tags: ["Разработка"],
            createdAt: new Date(document.querySelector('#post-page .publication-date').textContent),
        }
        articlesPresenter.addArticle(newArticle);
        htmlController.showMessageForm("Новость успешно сохранена.", "Готово");
        document.getElementById('exclamation-form-ok-button').removeEventListener('click', saveArticle);
    }

    function editArticle() {
        var newArticle = {
            title: form.postName.value,
            shortDescription: form.shortDiscription.value,
            text: form.text.value,
            images: getImages(),
            tags: ["Разработка"]
        }
        articlesPresenter.editArticle(currentArticleId, newArticle);
        htmlController.showMessageForm("Новость успешно сохранена.", "Готово");
        document.getElementById('exclamation-form-ok-button').removeEventListener('click', saveArticle);
    }

    function getImages() {
        var imagesArray = [];
        Array.prototype.forEach.call(form.getElementsByClassName('image-url-input'), (item) => {
            imagesArray.push(item.value);
        });
        return imagesArray;
    }

    function deleteArticle() {
        articlesPresenter.removeArticle(currentArticleId);
        document.getElementById('exclamation-form-ok-button').removeEventListener('click', deleteArticle);
        htmlController.showMessageForm("Новость успешно удалена из ленты.", "Готово");
        articleListControoler.displayMainPage();
    }

    return {
        dispalyPostPage: dispalyPostPage
    }
}());