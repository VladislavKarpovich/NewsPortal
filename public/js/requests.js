;
var requests = (function () {

    function getArticles(options, callBack) {
        var req = new XMLHttpRequest();

        function loadHandler() {
            var res = JSON.parse(this.responseText);
            res.articles.forEach(item => item.createdAt = new Date(item.createdAt));

            callBack(req.status, res.articles, res.amount);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('GET', '/articles?' + convertToQuery(options));

        function convertToQuery(obj) {
            var str = [];
            let ownPropKeys = Object.keys(obj);
            ownPropKeys.forEach(key => str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])));
            return str.join('&');
        }

        req.send();
    }

    function getArticle(id, callBack) {
        var req = new XMLHttpRequest();

        function loadHandler() {
            var article = JSON.parse(this.responseText);
            article.createdAt = new Date(article.createdAt);

            callBack(req.status, article);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);

        req.open('GET', '/article/' + id);
        req.send();
    }

    function addArticle(article, callBack) {
        var req = new XMLHttpRequest();

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
        var req = new XMLHttpRequest();

        function loadHandler() {
            callBack();
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('PUT', '/article/' + id);
        req.setRequestHeader('content-type', 'application/json');
        req.send(JSON.stringify(article));
    }

    function deleteArticle(id, callBack) {
        var req = new XMLHttpRequest();

        function loadHandler() {
            callBack(req.status);
            req.removeEventListener('load', loadHandler);
        }

        req.addEventListener('load', loadHandler);
        req.open('DELETE', 'article/' + id);
        req.send();
    }

    return {
        getArticles: getArticles,
        getArticle: getArticle,
        addArticle: addArticle,
        updateArticle: updateArticle,
        deleteArticle: deleteArticle
    }


}());