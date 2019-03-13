const download = require("image-downloader");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const data = require("./qualificacoes.json")[0].positivas;
let dataFinal = [];
let dataFinalCsv = [];
const emojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const headTxt = "Nome,Texto,Foto\r\n";

// Pegar somente textos maiores que X caracteres
let bigtestmonials = data.filter(item => {
  return item.txt.length >= 200;
});

// Aumentar tamanho das imagens
bigtestmonials.map(item => {
  item.imgBig = item.img.replace("w48-h48", "w200-h200");
  item.txtSemEmoji = item.txt.replace(emojis, "");
});

// Salvar as imagens em uma pasta
bigtestmonials.forEach(item => {
  options = {
    url: item.imgBig,
    dest: `./imgs/${item.name}.jpg`
  };

  // Adicionar endereco local
  item.imgLocal = `${process.cwd()}\\imgs\\${item.name}.jpg`;

  async function downloadIMG() {
    try {
      const { filename, image } = await download.image(options);
      console.log(filename); // => /path/to/dest/image.jpg
    } catch (e) {
      console.error(e);
    }
  }
  downloadIMG();

  // download
  //   .image(options)
  //   .then(({ filename, image }) => {
  //     console.log("File saved to", filename);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
});

// Preparar data para ser salva em um txt
bigtestmonials.forEach(item => {
  dataFinal += `${item.name},"${item.txtSemEmoji}",${item.imgLocal}\r\n`;
  dataFinalCsv.push({
    Nome: item.name,
    Texto: item.txtSemEmoji,
    Foto: item.imgLocal.replace(/\\/g, "/")
  });
});
// console.log("TCL: dataFinalCsv", dataFinalCsv);

// Criar o TXT
fs.writeFile("testimonials.txt", headTxt, function(err, data) {
  if (err) console.log(err);
  console.log("Successfully create head of TXT File.");
});

fs.writeFile("json.txt", JSON.stringify(dataFinalCsv), function(err, data) {
  if (err) console.log(err);
  console.log("Successfully create head of TXT File.");
});

// Escrever o data no TXT
fs.appendFile("testimonials.txt", dataFinal, function(err, data) {
  if (err) return console.log(err);
  console.log("Appended data into txt!");
});

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "Nome", title: "Nome" },
    { id: "Texto", title: "Texto" },
    { id: "Foto", title: "Foto" }
  ]
});

csvWriter
  .writeRecords(dataFinalCsv)
  .then(() => console.log("The CSV file was written successfully"));

// gerar um arquivo json
// converter json para tablimited
// tentar converter todas as imagens para jpg
