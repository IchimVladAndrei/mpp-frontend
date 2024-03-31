import {expect, test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', {name: 'Delete'}).nth(2).click();
    await page.getByRole('button', {name: 'Delete'}).nth(1).click();
    await page.getByRole('button', {name: 'Delete'}).click();
    const newCarBrand = await page.textContent('li:has-text("New Brand")');
    expect(newCarBrand).toContain('NewPlayer');
});
