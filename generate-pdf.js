const request = require('request');
const fs = require('fs');
const http = require('http');

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
        }, response)
        .on('complete', (res, body) => {
            mdFile.close()
        })
        // Error
        .on('error', err => console.error(`could not convert, (${err})`))
        // Response
        ;
        /* // TODO: .on('response', res => {
            let data = JSON.parse(res.body);
            let pdfFile = fs.createWriteStream(pdf);
            http
                .get(`${url}/app/download/${data.foldername}/${data.urlfilename}`, (res) => {
                    res.pipe(pdfFile);
                })
                .on('close', () => pdfFile.close())
                // Logs
                .on('close', () => console.log('converted'))
                .on('error', err => console.error(`could not convert, (${JSON.stringify(err)})`));
        });*/
    
    function response(err, res, body) {
        if (err) return;

        let data = JSON.parse(res.body);
        let pdfFile = fs.createWriteStream(pdf);
        http
            .get(`${url}/app/download/${data.foldername}/${data.urlfilename}`, (res) => {
                res.pipe(pdfFile);
            })
            .on('close', () => pdfFile.close())
            // Logs
            .on('close', () => console.log('converted'))
            .on('error', err => console.error(`could not convert, (${JSON.stringify(err)})`));
    }
}