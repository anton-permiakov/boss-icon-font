var xml2js = require('xml2js');
var fs = require('fs');
var generator = require('webfonts-generator');

var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

const cleanSvgFolder = './clean-svg/'

fs.readdir('./svg/', (err, files) => {
    console.log('Working...');
    let filepath = [];
    files.forEach(element => {
        cleanSvgIcon(element);
        filepath.push(cleanSvgFolder + cleanFileName(element));
    });

    var gen = generator({
        files: filepath,
        dest: 'output/fonts/',
        fontName: 'boss',
        html: true,
        fontHeight: 1024,
        htmlDest: 'output/boss.html',
        htmlTemplate: './templates/html.hbs',
        cssDest: 'output/styles/boss.css',
        cssTemplate: './templates/css.hbs',
        cssFontsUrl: '../fonts/',
        templateOptions: {
            classPrefix: 'boss ',
            baseSelector: '.boss',
            startCodepoint: 0xF101
        }

    }, error => {
        console.log(error ? 'Error!!!! ' + error : "Done!!!");
    });
});

var cleanSvgIcon = (icon) => {
    var data = fs.readFileSync('svg/' + icon, 'utf-8');
    parser.parseString(data, (err, result) => {
        var cleanSvg = result;
        delete cleanSvg.svg.g[0].g;
        var xml = builder.buildObject(cleanSvg);
        if(!fs.existsSync(cleanSvgFolder)){
            fs.mkdirSync(cleanSvgFolder);
        }
        if (fs.existsSync(cleanSvgFolder + cleanFileName(icon))) {
            fs.unlinkSync(cleanSvgFolder + cleanFileName(icon));
        }
        fs.appendFileSync(cleanSvgFolder + cleanFileName(icon), xml)
    });
}

var cleanFileName = (icon) => {
    return icon.replace(/^br-/, 'boss-').replace(/_/, '-').replace(/\s/g, '-');
}