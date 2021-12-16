const http = require("http");
const fs = require("fs");

const viewPath = "views/";

const pages = {
    home: "index.html",
    faq: "faq.html",
    notFound: "404.html"
}

function display(page) {

    if (!page) return viewPath + pages.home;

    return pages[page] ? viewPath + pages[page] : viewPath + pages.notFound;

}

http.createServer((req, res) => {

    const url = req.url.replace(/^\/+|\/+$/g, "");

    const filePath = display(url);

    fs.readFile(filePath, (error, content) => {

        if (error) return;

        res.end(content.toString());
    });


}).listen(7000, () => console.log("Server Started"));