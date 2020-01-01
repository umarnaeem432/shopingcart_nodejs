const fs = require('fs');
const htmlForm = '<form action="/message" method="POST"><input type="text" name="msg"><button type="submit">Send</button></form>';

const requestHandler = (req , res) => {

    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<h1>Home Page</h1>');
        res.write(htmlForm);
        return res.end(); // We should not write to response after this line. So just return it. So we can not execute anything after it.
    }


    if (req.url === '/message') {
        const parsedBody = [];
        req.on('data', chunk => {
            parsedBody.push(chunk);
        });

        req.on('end', () => {
            const message = Buffer.concat(parsedBody).toString().split('=')[1];
            fs.writeFile('./server/text_output/msg.txt', message, err => {
                if (err) throw err;
                res.statusCode = 302; // code for redirection.
                res.setHeader('Location', '/');
                res.end();
            });
        });
    }
}

module.exports = requestHandler;
