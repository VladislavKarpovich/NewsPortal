;
var articleFormController = (function () {
    var TITLE_MAX_SIZE = 100;
    var SHORT_DISCRIPTION = 200;
    var IMAGES_MAX_AMOUNT = 10;

    var OPERATION;

    var currentArticleHtml = document.getElementById('post-page');
    var currentArticleId;
    var form = document.getElementById('edit-form');
    var user;

    function showArticleDetailView_Handler(event) {
        if (event.target.className === 'show-more-article-button') {
            let id = event.target.parentNode.id;
            currentArticleId = id;
            OPERATION = 'EDIT';

            requests.getArticle(id, function (status, article) {
                htmlPresenter.displayPostPageForm(article);
                let images = document.querySelectorAll('#edit-form-images-container div');
                Array.prototype.forEach.call(images, item => item.addEventListener('click', deleteImageBlock));
            });
        }
    }

    function showAddArticleForm_Handler() {
        htmlPresenter.displayPostPageForm();
        OPERATION = 'ADD';
        cur

    }

    function hidePostPageForm_Handel() {
        htmlPresenter.hidePostPageForm();
        htmlPresenter.hideOverlay();
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

    function deleteImageBlock(event) {
        if (event.target.className === 'delete-image-input-button') {
            console.log(this);
            this.remove();
        }

        if (document.querySelectorAll('#edit-form-images-container div').length < IMAGES_MAX_AMOUNT) {
            document.getElementById('edit-form-add-image-button').style.display = 'inline';
        }
    }

    function addImageBlock() {
        let id = htmlPresenter.addDetailViewFormImageBlock('');
        document.getElementById(id).addEventListener('click', deleteImageBlock);

        if (document.querySelectorAll('#edit-form-images-container div').length >= IMAGES_MAX_AMOUNT) {
            document.getElementById('edit-form-add-image-button').style.display = 'none';
        }
    }

    function saveArticle_Handel() {
        if (form.getElementsByClassName('wrong').length === 0) {
            htmlPresenter.showExclamationForm('Сохранить изменения?', 'Сохранить');
            var exclamationForm = document.getElementById('exclamation-form-ok-button');

            switch (OPERATION) {
                case "EDIT":
                    exclamationForm.addEventListener('click', editArticle);
                    break;
                case "ADD":
                    exclamationForm.addEventListener('click', addArticle);
                    break;
                default:
            }
        } else {
            htmlPresenter.showErrorForm('Не валидная статья!');
        }
    }

    function addArticle() {
        var newArticle = {
            title: form.postName.value,
            shortDescription: form.shortDiscription.value,
            text: form.text.value,
            images: getImages(),
            author: document.querySelector('#post-page .author-name').textContent,
            tags: getTags(),
        }

        var exclamationForm = document.getElementById('exclamation-form-ok-button');
        exclamationForm.removeEventListener('click', editArticle);

        requests.addArticle(newArticle, function () {
            htmlPresenter.showMessageForm("Новость успешно сохранена.", "Готово");
        });
    }

    function editArticle() {
        var newArticle = {
            title: form.postName.value,
            shortDescription: form.shortDiscription.value,
            text: form.text.value,
            images: getImages(),
            tags: getTags()
        }

        var exclamationForm = document.getElementById('exclamation-form-ok-button');
        exclamationForm.removeEventListener('click', editArticle);

        requests.updateArticle(currentArticleId, newArticle, function () {
            htmlPresenter.showMessageForm("Новость успешно сохранена.", "Готово");
        });
    }

    function deleteArticle_Handel() {
        htmlPresenter.showExclamationForm("Удалить новость?", "Удаление");
        document.getElementById('exclamation-form-ok-button').addEventListener('click', handler);

        function handler() {
            document.getElementById('exclamation-form-ok-button').removeEventListener('click', handler);
            requests.deleteArticle(currentArticleId, function () {
                htmlPresenter.showMessageForm("Новость успешно удалена из ленты.", "Готово");
                articleListControoler.displayMainPage();
            });
        }
    }

    function getImages() {
        var imagesArray = [];
        Array.prototype.forEach.call(form.getElementsByClassName('image-url-input'), (item) => {
            imagesArray.push(item.value);
        });
        return imagesArray;
    }

    function getTags() {
        var tags = [];
        var tagsCheckBoxes = document.querySelectorAll('.edit-form-tags label');
        Array.prototype.forEach.call(tagsCheckBoxes, function (item) {
            console.log(item);
            if (item.querySelector('input').checked) {
                tags.push(item.textContent);
            }
        });
        return tags;
    }

    return {
        showArticleDetailView_Handler: showArticleDetailView_Handler,
        hidePostPageForm_Handel: hidePostPageForm_Handel,
        showAddArticleForm_Handler: showAddArticleForm_Handler,
        addImageBlock: addImageBlock,
        contentChanged: contentChanged,
        saveArticle_Handel: saveArticle_Handel,
        deleteArticle_Handel: deleteArticle_Handel
    }
}());