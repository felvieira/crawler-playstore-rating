const download = require("image-downloader");
const data = require("./qualificacoes.json")[0].positivas;
const path = require("path");

let bigtestmonials = data.filter(item => {
  return item.txt.length >= 200;
});

// Aumentar tamanho das imagens
bigtestmonials.map(item => {
  item.imgBig = item.img.replace("w48-h48", "w200-h200");
});

bigtestmonials.forEach(item => {
  options = {
    url: item.imgBig,
    dest: `./imgs/${item.name}.jpg`
  };

  item.imgLocal = `${process.cwd()}/imgs/${item.name}.jpg`;

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

console.log("TCL: bigtestmonials", bigtestmonials);
