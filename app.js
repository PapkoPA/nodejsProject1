var http = require('http');
var serverConfig = require('./server/config/server-config');
var scraper = require('./server/helpers/scraper-articles');
var url = require('url');
var article = require('./server/models/article-model');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    if (pathname == '/') {

        article.find({}, function(err, articles) {
            if (err) {
                throw err;
            }

            var page = articles.reduce(function (response, item) {
                return response + '<h3>' + '<a href='+ item.id +'>' + item.title + '</a>' + '</h3>' + '<p>' + item.summary + '</p>';
            }, '');

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            response.end(page);
        });
    }
    else {

        article.findOne({id: pathname.replace('/', '')}, function (error, item) {

            if(item != null) {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                response.end(item.description);
            }
            else {
                response.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
                response.end('Not found');
            }
        })

    }
});

setInterval(function() {
    scraper.update();
    console.log('Search...');
}, 10000);

server.listen({port: serverConfig.port});