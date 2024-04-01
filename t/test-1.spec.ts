import {test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', {name: 'Add'}).click();
    await page.getByPlaceholder('enter brand...').click();
    await page.getByPlaceholder('enter brand...').fill('abcd');
    await page.getByPlaceholder('enter price...').click();
    await page.getByPlaceholder('enter price...').fill('2');
    await page.getByPlaceholder('enter year bought...').click();
    await page.getByPlaceholder('enter year bought...').fill('2002');
    await page.getByRole('button', {name: 'Submit'}).click();
});
