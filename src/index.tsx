import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import chromium from "@sparticuz/chromium";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import type { FC } from "hono/jsx";
import puppeteer from "puppeteer-core";
import { Resource } from "sst";

const LOCAL_EXECUTABLE_PATH =
  "/tmp/localChromium/chromium/mac_arm-1353446/chrome-mac/Chromium.app/Contents/MacOS/Chromium";

const app = new Hono();
const s3 = new S3Client({});

const Template: FC<{ name: string }> = ({ name }) => {
  return (
    <html>
      <body>
        <h1>Hello {name || "world"}!</h1>
      </body>
    </html>
  );
};

app.get("/", async (c) => {
  try {
    const name = await c.req.query("name");
    const fileName = `pdf-${crypto.randomUUID()}.pdf`;
    const html = await c.html(<Template name={name} />);

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.SST_DEV
        ? LOCAL_EXECUTABLE_PATH
        : await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    await page.setContent(await html.text());

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    await s3.send(
      new PutObjectCommand({
        Bucket: Resource.Storage.name,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: Resource.Storage.name,
        Key: fileName,
      }),
      {
        expiresIn: 3600,
      }
    );

    return c.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    return c.json({ success: false }, 500);
  }
});

export const handler = handle(app);
