// Dynamic import to avoid build issues
export async function generatePDF(html: string): Promise<Buffer> {
  // Skip during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return Buffer.from('');
  }

  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Add RTL styling
    await page.addStyleTag({
      content: `
        * {
          direction: rtl;
          text-align: right;
        }
        body {
          font-family: 'Cairo', 'Arial', sans-serif;
          margin: 40px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        h1, h2, h3 {
          color: #333;
        }
      `,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

