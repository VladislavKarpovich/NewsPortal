;
var articlesController = (function () {
    const ARTICLES_AMOUNT = 5;
    const TAGS = ['Разработка', 'Администрирование', 'Дизайн', 'Управление', 'Маркетинг'];

    var filter = {};
    var paginationPosition = 0;
    var paginationPagesAmount = 1;

    function displayMainPage() {
        requests.getArticles({ skip: 0, amount: 6 }, function (status, articles) {
            var container = document.querySelector('.last-article-list');
            htmlPresenter.displayArticles(container, articles);
        });

        var containerClasses = ['.development-article-list', '.administration-article-list',
            '.design-article-list', '.management-article-list', '.marketing-article-list'];

        for (let i = 0; i < containerClasses.length; i++) {
            requests.getArticles({ skip: 0, amount: 4, tags: [TAGS[i]] }, function (status, articles) {
                var container = document.querySelector(containerClasses[i]);
                htmlPresenter.displayArticles(container, articles);
            });
        }

        htmlPresenter.displayMainPage();
        htmlPresenter.activateHeaderButton('Главная');
        document.getElementById('message-overlay').style.display = 'none';
        htmlPresenter.hidePostPageForm();
    }

    function tagClick_Handel(event) {
        if ((event.target.tagName !== 'H1') && (event.target.className !== 'header-tag-button')) {
            return;
        }

        paginationPosition = 0;

        var option = event.target.textContent.split(' ')[0];
        htmlPresenter.activateHeaderButton(option);

        switch (option) {
            case "Главная":
                filter = null;
                displayMainPage()
                break;
            case "Последние":
                filter = null;
                displayArticleList();
                break;
            default:
                filter = {
                    tags: [option]
                }
                displayArticleList();
        }
    }

    function filterArtices_Handel() {
        var form = document.getElementById('filter-form');
        var tags = [];
        filter = {};
        Array.prototype.forEach.call(form.querySelectorAll('label'), item => {
            if (item.querySelector('input').checked) {
                tags.push(item.textContent);
            }
        });
        if (tags.length > 0) {
            filter.tags = tags;
        }
        if (form.author.value !== 'Все') {
            console.log(form.author);
            filter.author = form.author.value;
        }
        var date = new Date(form.dateFrom.value);
        if (date != 'Invalid Date') {
            filter.dateFrom = date;
        }
        date = new Date(form.dateTo.value);
        if (date != 'Invalid Date') {
            filter.dateTo = date;
        }

        console.log(filter);
        paginationPosition = 0;
        displayArticleList();
    }

    function paginationClick_Handler(event) {
        if (Number(event.target.textContent)) {
            paginationPosition = Number(event.target.textContent) - 1;
            displayArticleList();
        } else if (event.target.id === 'prev-page') {
            paginationPosition--;
            displayArticleList();
        } else if (event.target.id === 'next-page') {
            paginationPosition++;
            displayArticleList();
        }
    }

    function displayArticleList() {
        var options = Object.assign({}, filter);
        options.skip = ARTICLES_AMOUNT * paginationPosition;
        options.amount = ARTICLES_AMOUNT;

        requests.getArticles(options, function (status, articles, amount) {
            htmlPresenter.displayArticleList(articles);
            paginationPagesAmount = Math.ceil(amount / ARTICLES_AMOUNT);

            htmlPresenter.addPagination(paginationPagesAmount);
            htmlPresenter.activatePaginationButton(paginationPosition, paginationPagesAmount - 1);
        });
        window.scrollTo(0, 0);
    }

    return {
        displayMainPage: displayMainPage,
        tagClick_Handel: tagClick_Handel,
        filterArtices_Handel: filterArtices_Handel,
        paginationClick_Handler: paginationClick_Handler
    }

}());