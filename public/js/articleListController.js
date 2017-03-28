var articleListControoler = (function () {
    var ARTICLES_AMOUNT = 10;

    var currentPosition;
    var paginationSize;
    var currentArticlesArray;

    function dispalyArticleList(filter) {
        currentArticlesArray = articlesPresenter.filterArticles(filter);
        currentPosition = 1;
        htmlController.displayArticleList(currentArticlesArray.slice(0, ARTICLES_AMOUNT));
        if (currentArticlesArray.length > ARTICLES_AMOUNT) {
            htmlController.addPagination(paginationSize = Math.ceil(currentArticlesArray.length / ARTICLES_AMOUNT));
            document.querySelector('#pagination .pages a').className = 'active';
            hideButtons();
            document.getElementById('pagination').style.display = 'block';
        } else {
            document.getElementById('pagination').style.display = 'none';
        }
    }

    function displayMainPage() {
        var lastArticles = articlesPresenter.getArticles(0, 5);
        var developmentArticles = articlesPresenter.getArticles(0, 3, { tags: ['Разработка'] });
        var administrationArticles = articlesPresenter.getArticles(0, 3, { tags: ['Администрирование'] });
        var designArticles = articlesPresenter.getArticles(0, 3, { tags: ['Дизайн'] });
        var managementArticles = articlesPresenter.getArticles(0, 3, { tags: ['Управление'] })
        var marketingArticles = articlesPresenter.getArticles(0, 3, { tags: ['Маркетинг'] });
        htmlController.displayMainPage(lastArticles, developmentArticles, administrationArticles,
            designArticles, managementArticles, marketingArticles);
        htmlController.activateHeaderButton('Главная');
    }

    function showPage(n) {
        currentPosition = n;
        var pages = document.querySelectorAll('#pagination .pages a');
        if (pages.length) {
            Array.prototype.forEach.call(pages, (item) => item.className = '');
            pages[n - 1].className = 'active';
            hideButtons();
            var articles = currentArticlesArray.slice(ARTICLES_AMOUNT * (currentPosition - 1), ARTICLES_AMOUNT * currentPosition);
            htmlController.displayArticleList(articles);
        }
        [].forEach.call(document.getElementsByTagName('article'), function (item) {
            item.addEventListener('click', showArticleDetailView);
        });
    }

    function hideButtons() {
        if (currentPosition === 1) {
            document.getElementById('prev-page').style.display = 'none';
        } else {
            document.getElementById('prev-page').style.display = 'flex';
        }
        if (currentPosition === paginationSize) {
            document.getElementById('next-page').style.display = 'none';
        } else {
            document.getElementById('next-page').style.display = 'flex';
        }
    }

    function showArticleDetailView(event) {
        console.log(this);
        var article = articlesPresenter.getArticle(this.id);
        htmlController.deactivateHeaderButtons();
        articleEditForm.dispalyPostPage(article);
        window.scrollTo(0, 0);
    }

    document.getElementById('prev-page').addEventListener('click', () => showPage(+currentPosition - 1));
    document.getElementById('next-page').addEventListener('click', () => showPage(+currentPosition + 1));
    document.querySelector('#pagination .pages').addEventListener('click', () => showPage(+event.target.textContent));

    return {
        dispalyArticleList: dispalyArticleList,
        displayMainPage: displayMainPage
    }
}());