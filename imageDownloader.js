const download = require("image-downloader");
const fs = require("fs");
const tsvConverter = require("./tsvConverter").TSV;
const legacy = require("legacy-encoding");

const Jimp = require("jimp");
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
var webp = require("webp-converter");

const qualificacoesPositivas = require("./itens.json")[0].positivas;
const qualificacoesNegativas = require("./itens.json")[0].negativas;

let dataFinal = [],
  dataFinalCsv = [];
const emojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const headTxt = "Nome,Texto,Foto\r\n";

// Pegar somente textos maiores que X caracteres
let bigtestmonials = qualificacoesPositivas.filter(item => {
  return item.txt.length >= 200;
});

// Aumentar tamanho das imagens
bigtestmonials.map(item => {
  item.imgBig = item.img.replace("w48-h48", "w200-h200");
  item.txtSemEmoji = item.txt.replace(emojis, "");
});

// Salvar as imagens em uma pasta
async function saveImages() {
  await bigtestmonials.forEach(item => {
    // Tirar espaco dos nomes
    // .replace(/ /g,"_");
    options = {
      url: item.imgBig,
      dest: `./imgs/${item.name}.webp`
    };

    // Adicionar endereco local
    item.imgLocal = `${process.cwd()}\\imgs\\${item.name}.jpg`;

    // Jimp.read(options.url)
    //   .then(img => {
    //     return img.write(`./imgs/converted/${item.name}.jpg`); // save
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    async function downloadIMG() {
      try {
        const { filename, image } = await download.image(options);
        // console.log(filename); // => /path/to/dest/image.jpg
      } catch (e) {
        console.error(e);
      }
    }
    downloadIMG().then(() => {
      // webp.dwebp(
      //   item.imgLocal,
      //   `./imgs/converted/${item.name}.jpg`,
      //   "-o",
      //   function(status, error) {
      //     //if conversion successful status will be '100'
      //     //if conversion fails status will be '101'
      //     console.log(status, error);
      //   }
      // );
    });

    // download
    //   .image(options)
    //   .then(({ filename, image }) => {
    //     console.log("File saved to", filename);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  });
}

saveImages();

// Preparar data para ser salva em um txt/csv
bigtestmonials.forEach(item => {
  dataFinal += `${item.name},"${item.txtSemEmoji}",${item.imgLocal}\r\n`;
  dataFinalCsv.push({
    Nome: item.name,
    Texto: item.txtSemEmoji,
    Foto: item.imgLocal.replace(/\\/g, "/")
  });
});

// Criar o TXT
fs.writeFile("testimonials.txt", headTxt, function(err, data) {
  if (err) console.log(err);
  console.log("Criado arquivo testimonials.txt");
});
// Escrever o dataFinal no TXT
fs.appendFile("testimonials.txt", dataFinal, function(err, data) {
  if (err) return console.log(err);
  console.log("Adicionado data Final ao arquivo testimonials.txt");
});

fs.writeFile("json.txt", JSON.stringify(dataFinalCsv), function(err, data) {
  if (err) console.log(err);
  console.log("Successfully create head of TXT File.");
});

// Convertendo DataFinal com encode Western Windows 1252 para o Photoshop entender
const encode1252 = legacy.encode(
  tsvConverter.stringify(dataFinalCsv),
  "windows-1252"
);

fs.writeFile("tab-delimited-1252.txt", encode1252, function(err, data) {
  if (err) console.log(err);
  console.log("Successfully create head of TXT File.");
});

// Usando a lib local de parser para tab-delimited
fs.writeFile(
  "tab-delimited-function.txt",
  tsvConverter.stringify(dataFinalCsv),
  function(err, data) {
    if (err) console.log(err);
    console.log("Successfully create head of TXT File.");
  }
);

// fazer if no nome da imagem se for Um usuário do Google colocar uma imagem fixa
// gerar um arquivo json
// converter json para tablimited
// tentar converter todas as imagens para jpg
