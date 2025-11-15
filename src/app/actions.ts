
'use server';
import * as cheerio from 'cheerio';

export async function fetchFundaResults(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const properties: any[] = [];
    $('.search-result-main').each((i, el) => {
      const title = $(el).find('[data-test-id="street-name-house-number"]').text().trim();
      const address = $(el).find('[data-test-id="postal-code-city"]').text().trim();
      const price = $(el).find('[data-test-id="price-wrapper"]').text().trim().replace(/\s/g, '');
      const imageUrl = $(el).find('.search-result-image img').attr('src');
      
      const features: string[] = [];
       $(el).find('[data-test-id="property-features"] li').each((i, featureEl) => {
            features.push($(featureEl).text().trim());
       });


      if (title && address && price) {
        properties.push({
          id: i,
          title,
          address,
          price,
          imageUrl,
          features
        });
      }
    });

    return properties;
  } catch (error) {
    console.error('Error scraping Funda:', error);
    throw new Error('Could not fetch results from Funda.');
  }
}
