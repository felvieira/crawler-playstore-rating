const fs = require("fs");
const puppeteer = require("puppeteer");

function extractItems() {
  let all = document.querySelectorAll("div[jscontroller=H6eOGe]");
  let qualificacaoContainer = [];
  let positivas = [];
  let negativas = [];

  let botaoMaisResenha = document.querySelectorAll(
    "button.LkLjZd.ScJHi.OzU4dc"
  );
  botaoMaisResenha.forEach(item => {
    item.click();
  });

  [].forEach.call(all, function(item) {
    if (
      item
        .querySelector("div > div:nth-child(2) div[aria-label *= Avaliado]")
        .getAttribute("aria-label")
        .match(/(4 de 5|5 de 5)/)
    ) {
      positivas.push({
        name: `${item.querySelector("div > div:nth-child(2) span").innerText}`,
        date: `${
          item.querySelector("div > div:nth-child(2) div > span:nth-child(2)")
            .innerText
        }`,
        avaliacao: `${item
          .querySelector("div > div:nth-child(2) div[aria-label *= Avaliado]")
          .getAttribute("aria-label")}`,
        img: `${item.querySelector("div > div img").getAttribute("src")}`,
        txt: `${
          item
            .querySelector("div[jscontroller = LVJlx] span")
            .innerText.includes("Resenha")
            ? item.querySelector(
                "div[jscontroller = LVJlx] span[jsname = fbQN7e]"
              ).innerText
            : item.querySelector("div[jscontroller = LVJlx] span").innerText
        }`
      });
    } else {
      negativas.push({
        name: `${item.querySelector("div > div:nth-child(2) span").innerText}`,
        date: `${
          item.querySelector("div > div:nth-child(2) div > span:nth-child(2)")
            .innerText
        }`,
        avaliacao: `${item
          .querySelector("div > div:nth-child(2) div[aria-label *= Avaliado]")
          .getAttribute("aria-label")}`,
        img: `${item.querySelector("div > div img").getAttribute("src")}`,
        txt: `${
          item
            .querySelector("div[jscontroller = LVJlx] span")
            .innerText.includes("Resenha")
            ? item.querySelector(
                "div[jscontroller = LVJlx] span[jsname = fbQN7e]"
              ).innerText
            : item.querySelector("div[jscontroller = LVJlx] span").innerText
        }`
      });
    }
  });
  if (document.querySelector("span.RveJvd.snByac"))
    document.querySelector("span.RveJvd.snByac").click();
  qualificacaoContainer = [
    { positivas: [...positivas] },
    { negativas: [...negativas] }
  ];
  return qualificacaoContainer;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (itemTargetCount == null || items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.evaluate("window.scrollBy(0, -100)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {}
  return items;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  // const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "https://play.google.com/store/apps/details?id=br.com.personalvirtual&showAllReviews=true"
  );

  // clicar nos mais recentes
  await page.evaluate(() => {
    document.querySelectorAll(".vRMGwf.oJeWuf")[0].click();
    setTimeout(() => {
      document.querySelectorAll(".vRMGwf.oJeWuf")[3].click();
    }, 2000);
  });

  const items = await scrapeInfiniteScrollItems(page, extractItems, 100);

  // Save extracted items to a file.
  fs.writeFileSync("./items.json", JSON.stringify(items, null, 4));

  // Close the browser.
  await browser.close();
})();
