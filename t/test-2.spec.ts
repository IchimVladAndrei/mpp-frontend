import {expect, test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.locator('button:nth-child(3)').click();
    await page.getByRole('button', {name: 'Add'}).click();
    await page.getByPlaceholder('enter brand...').click();
    await page.getByPlaceholder('enter brand...').fill('kkk');
    await page.getByPlaceholder('enter price...').click();
    await page.getByPlaceholder('enter price...').fill('22');
    await page.getByPlaceholder('enter year bought...').dblclick();
    await page.getByPlaceholder('enter year bought...').fill('2003');

    await expect(page.textContent('kkk 22K 2003DeleteEdit')).toHaveLength(12);
});
