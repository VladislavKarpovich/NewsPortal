const requests = (function () {
    function getArticles(options, callBack) {
        const req = new XMLHttpRequest();

        function loadHandler() {
            const res = JSON.parse(this.responseText);
            res.articles.forEach(item => item.createdAt = new Date(item.createdAt));

            callBack(req.status, res.articles, res.amount);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('GET', `/articles?${convertToQuery(options)}`);

        req.send();
    }

    function convertToQuery(obj) {
        const str = [];
        const keys = Object.keys(obj);

        keys.forEach(key => {
            str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
        });

        return str.join('&');
    }


    function getArticle(id, callBack) {
        const req = new XMLHttpRequest();

        function loadHandler() {
            const article = JSON.parse(this.responseText);
            article.createdAt = new Date(article.createdAt);

            callBack(req.status, article);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);

        req.open('GET', `/article/${id}`);
        req.send();
    }


    function addArticle(article, callBack) {
        const req = new XMLHttpRequest();

        function loadHandler() {
            callBack(req.status);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('POST', '/article');
        req.setRequestHeader('content-type', 'application/json');
        req.send(JSON.stringify(article));
    }


    function updateArticle(id, article, callBack) {
        const req = new XMLHttpRequest();

        function loadHandler() {
            callBack();
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('PUT', `/article/${id}`);
        req.setRequestHeader('content-type', 'application/json');
        req.send(JSON.stringify(article));
    }


    function deleteArticle(id, callBack) {
        const req = new XMLHttpRequest();

        function loadHandler() {
            callBack(req.status);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('DELETE', `article/${id}`);
        req.send();
    }


    return {
        getArticles,
        getArticle,
        addArticle,
        updateArticle,
        deleteArticle
    };
}());
