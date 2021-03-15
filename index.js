const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 8080;

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto("https://cv.maltebaer.vercel.app", {
    waitUntil: "networkidle0",
  });
  await page.addStyleTag({ content: "#print-pdf { display: none } " });
  page.emulateMediaType("screen");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: 30,
      botton: 30,
      right: 30,
      left: 30,
    },
    scale: 0.6,
  });

  await browser.close();
  return pdf;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pdf", (req, res) => {
  printPDF().then((pdf) => {
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
