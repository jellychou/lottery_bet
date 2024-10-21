import fs from 'fs';
import csv from 'csvtojson';
import https from 'https';

const SHEETS_URL = 'https://docs.google.com/spreadsheets/u/2/d/1BvarkqQuCGHLUJUtTjEG7a-A_BzAnxsGezcIwjZdFgE/gviz/tq?tqx=out:csv&sheet=i18n';

const file = fs.createWriteStream(`./src/utils/site.csv`);
await https.get(SHEETS_URL, async response => await response.pipe(file));

file.on('finish', () => {
    console.log('download csv ok');
    file.close();
    setLang();
});

file.on('error', err => {
    // Handle errors
    console.log('download csv error', err);
});

function setLang() {
    const csvFilterPath = './src/utils/site.csv';
    csv()
        .fromFile(csvFilterPath)
        .then(jsonObj => {
            const result = {
                cn: {},
                en: {},
                th: {},
                vi: {}
            };
            jsonObj.forEach(item => {
                result.cn[item.field1] = item.cn;
                result.en[item.field1] = item.en;
                result.th[item.field1] = item.th;
                result.vi[item.field1] = item.vi;
            });
            fs.writeFile('./src/assets/lang/lang.json', JSON.stringify(result, '', '\t'), err => {
                !err ? console.log('i18n write ok') : console.log(err);
            });
            fs.unlink(csvFilterPath, err => {
                !err ? console.log('csv delete ok') : console.log(err);
            });
        });
}
