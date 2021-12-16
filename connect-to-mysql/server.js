const http = require("http");
const fs = require("fs");
const mysql = require('mysql');

const ejs = require("ejs");

const viewPath = "views/";


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});


const views = {
    home: "index.ejs",
    about: "home.ejs",
    notFound: "404.ejs",
}



// Loading a view
function display(page) {

    if (!page) return viewPath + views.home;

    return views[page] !== undefined ? viewPath + views[page] : viewPath + views.notFound;

}


const routes = {
    "/": (req, res) => {

        const filePath = display("home");
        connection.connect();



        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);

            ejs.renderFile(filePath, { results }, (err, str) => {

                if (err) {
                    console.log(err);
                    res.end();
                    return;
                }

                res.end(str);

            });
        });

        connection.end();

    },
    about: (req, res) => {
        console.log("about");
        res.end();
    },
    notFound: (req, res) => { res.end(); }
}


//loading route
function load(page) {

    if (!page) return routes["/"];

    return routes[page] !== undefined ? routes[page] : routes.notFound;

}

http.createServer((req, res) => {
    const url = req.url.replace(/^\/+|\/+$/g, "");

    const route = load(url);

    if (!route) {
        fs.readFile(req.url, (err, content) => {

            if (err) return;

            res.end(content.toString());
        })
        return;
    }

    route(req, res);
}).listen(7000, () => console.log("Server Started"));