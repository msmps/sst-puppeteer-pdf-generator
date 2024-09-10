# SST Puppeteer PDF Generator

This project is a serverless PDF generator built with SST, Puppeteer, and Hono. It creates PDFs from HTML/JSX templates and stores them in an S3 bucket, providing a signed URL for downloading the generated PDF.

## Features

- Serverless architecture using SST
- PDF generation with Puppeteer
- API built with Hono
- S3 storage for generated PDFs
- Customizable HTML/JSX templates

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- AWS account and configured credentials

## Installation

To install dependencies:

```bash
bun install
```

## Running the Project

To run:

```bash
bun sst dev
```

This command starts the SST development environment, allowing you to test and debug your application locally.

## Project Structure

- `src/index.tsx`: Hono API handler
- `sst.config.ts`: SST configuration file

## How It Works

1. The application exposes a GET endpoint at the root ("/").
2. When a request is made, it accepts an optional "name" query parameter.
3. An HTML template is generated using the provided name (or "world" if no name is given).
4. Puppeteer is used to create a PDF from the HTML/JSX template.
5. The generated PDF is uploaded to an S3 bucket.
6. A signed URL for the PDF is generated and returned in the response.

## API Usage

Make a GET request to the root endpoint:

```
GET /?name=John
```

Response:

```json
{
  "success": true,
  "url": "https://your-signed-s3-url.com/path/to/pdf"
}
```

## Customization

You can customize the HTML/JSX template by modifying the Template component in `src/index.tsx`.

## Deployment

To deploy the application to your AWS account:

```bash
bun sst deploy --stage production
```

## Local Development

For local development, the application uses a local Chromium executable. Make sure the path in LOCAL_EXECUTABLE_PATH is correct for your system. See [this](https://sst.dev/docs/examples/#puppeteer-in-lambda) guide for more information.

## Credits

- [SST Puppeteer Example](https://sst.dev/docs/examples/#puppeteer-in-lambda)
- [Pontus Abrahamsson Cloudflare Example](https://x.com/pontusab/status/1832772994219008180)

---

This project was created using `bun init` in bun v1.1.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
