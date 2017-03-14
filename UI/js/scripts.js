;
var user = null;

function displayMainPage() {
  var lastArticles = articlesPresenter.getArticles(0, 5);
  var developmentArticles = articlesPresenter.getArticles(0, 3, { tags: ["Разработка"] });
  var administrationArticles = articlesPresenter.getArticles(0, 3, { tags: ["Администрирование"] });
  var designArticles = articlesPresenter.getArticles(0, 3, { tags: ["Дизайн"] });
  var managementArticles = articlesPresenter.getArticles(0, 3, { tags: ["Управление"] })
  var marketingArticles = articlesPresenter.getArticles(0, 3, { tags: ["Маркетинг"] });
  htmlController.displayMainPage(lastArticles, developmentArticles, administrationArticles,
    designArticles, managementArticles, marketingArticles);
}

function displayArticleList(skip, top, filter) {
  var articles = articlesPresenter.getArticles(skip, top, filter);
  htmlController.displayArticleList(articles);
  console.log(articles);
}

function addArticle(article) {
  htmlController.addArticle(article);
  console.log(article);
}

function removeArticle(id) {
  var article = articlesPresenter.removeArticle(id);
  console.log(article);
  htmlController.removeArticle(id);
}

function editArticle(id, article) {
  htmlController.editArticle(id, article);
}

function showFilterForm() {
  htmlController.showFilterForm();
}

function hideFilterForm() {
  htmlController.hideFilterForm();
}

function showLoginForm() {
  htmlController.showLoginForm();
}

function hideLoginForm() {
  htmlController.hideLoginForm();
}

function userIn() {
  htmlController.userIn({ name: "Владислав Карпович", mail: "vladislavkarpovich1@gmail.com"});
}

function userOut() {
  htmlController.userOut();
}

(function startApp() {
  displayMainPage();
  userOut();
}());