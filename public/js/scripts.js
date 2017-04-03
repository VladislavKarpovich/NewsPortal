;
(function () {
  articlesController.displayMainPage();
  userController.userOut_Handel();

  document.getElementById('login-form-button').addEventListener('click', userController.userIn_Handel);
  document.getElementById('user-panel-out-button').addEventListener('click', userController.userOut_Handel);

  document.getElementsByClassName('header-menu')[0].addEventListener('click', articlesController.tagClick_Handel);
  document.getElementById('main-page').addEventListener('click', articlesController.tagClick_Handel);
  document.getElementById('filter-form-button-ok').addEventListener('click', articlesController.filterArtices_Handel);
  document.getElementById('pagination').addEventListener('click', articlesController.paginationClick_Handler);

  document.getElementById('message-form-ok-button').addEventListener('click', htmlPresenter.hideMessageForm);
  document.getElementById('overlay').addEventListener('click', () => {
    htmlPresenter.hideErrorForm();
    htmlPresenter.hideExclamationForm();
    htmlPresenter.hideLoginForm();
    htmlPresenter.hideMessageForm();
    htmlPresenter.hidePostPageForm();
  });

  document.getElementById('message-overlay').addEventListener('click', () => {
    htmlPresenter.hideErrorForm();
    htmlPresenter.hideExclamationForm();
    htmlPresenter.hideMessageForm();
  });


  document.getElementsByTagName('main')[0].addEventListener('click', articleFormController.showArticleDetailView_Handler);
  document.getElementById('user-panel-add-article-button').addEventListener('click', articleFormController.showAddArticleForm_Handler);
  document.getElementById('close-post-page-button').addEventListener('click', articleFormController.hidePostPageForm_Handel);
  document.getElementById('edit-form-add-image-button').addEventListener('click', articleFormController.addImageBlock);

  document.getElementById('edit-form').addEventListener('keyup', articleFormController.contentChanged);
  document.getElementById('edit-form').addEventListener('change', articleFormController.contentChanged);

  document.getElementById('editing-save-button').addEventListener('click', articleFormController.saveArticle_Handel);
  document.getElementById('editing-delete-button').addEventListener('click', articleFormController.deleteArticle_Handel);

  document.getElementById('error-form-ok-button').addEventListener('click', htmlPresenter.hideErrorForm);

  document.getElementById('exclamation-form-cancel-button').addEventListener('click', htmlPresenter.hideExclamationForm);
  document.getElementById('exclamation-form-ok-button').addEventListener('click', htmlPresenter.hideExclamationForm);

  document.getElementById('message-form-ok-button').addEventListener('click', articlesController.displayMainPage);

  document.getElementById('next-button').addEventListener('click', sliderController.showNextSlide_Handel);
  document.getElementById('prev-button').addEventListener('click', sliderController.showPrevSlide_Handel);
  document.getElementById('dots-container').addEventListener('click', sliderController.showSlide_Handel);
}());