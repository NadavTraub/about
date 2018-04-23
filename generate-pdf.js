const request = require('request');
const fs = require('fs');
const http = require('http');

const null_func = () => { };
const url = 'http://www.markdowntopdf.com/';

md2pdf(`${__dirname}/README.md`);

function md2pdf(md) {
    let pdf = `${md}.pdf`;

    console.log(`Converting '${md}' to '${pdf}'`);

    let mdFile = fs.createReadStream(md);

    request
        // Request
        .post({
            url: `${url}/app/upload`,
            formData: {
                'file': mdFile,
            }
        }, null_func /* The code creates and sends a body parameter only if a callback was sent in `.post()` */)
        // Logs
        .on('error', err => console.error(`could not convert(${err})`))
        // Flow
        .on(/* clean: */ 'complete', _ => mdFile.close()) // Clean
        .on('complete', (res, body) => {
            let data = JSON.parse(body);
            let pdfFile = fs.createWriteStream(pdf);

            http
                .get(`${url}/app/download/${data.foldername}/${data.urlfilename}`)
                // Logs
                .on('close', () => console.log('converted'))
                .on('error', err => console.error(`could not convert, (${JSON.stringify(err)})`))
                // Flow
                .on(/* clean: */ 'close', () => pdfFile.close())
                .on('response', res => res.pipe(pdfFile));
        });
}