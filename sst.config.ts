/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-puppeteer-pdf-generator",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    const api = new sst.aws.Function("Api", {
      handler: "src/index.handler",
      memory: "2 GB",
      timeout: "5 minutes",
      nodejs: {
        install: ["@sparticuz/chromium"],
      },
      link: [bucket],
      url: true,
    });

    return {
      url: api.url,
    };
  },
});
