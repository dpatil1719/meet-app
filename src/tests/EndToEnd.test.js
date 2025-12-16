import puppeteer from 'puppeteer';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173/';

describe('show/hide event details (E2E)', () => {
  let browser;
  let page;

  // Give Jest & Puppeteer more time
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    // Wait for the dev server & network to go idle
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.event');
  });

  afterAll(async () => {
    try { await page?.close(); } catch {}
    try { await browser?.close(); } catch {}
  });

  test('An event element is collapsed by default', async () => {
    const details = await page.$('.event .details');
    expect(details).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const details = await page.$('.event .details');
    expect(details).toBeTruthy();
  });

  test('User can collapse an event to hide details', async () => {
    await page.click('.event .details-btn');
    const details = await page.$('.event .details');
    expect(details).toBeNull();
  });
});
