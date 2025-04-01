const {test, expect} = require('@playwright/test');

test("Web Client App login", async ({page})=>
{
    const email = "Arjun@gmail.com";
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator('.card-body');
    await page.goto("https://rahulshettyacademy.com/client");
    
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your passsword').fill("Arjun@1998@");
    await page.getByRole('button', {name: 'Login'}).click();
    // await page.waitForLoadState('networkidle'); // waitForLoadState('networkidle') => Wait until all network calls are completed.
    await page.locator('.card-body b').first().waitFor();

    await page.locator('.card-body').filter({hasText: productName}).getByRole('button', {name: 'Add To Cart'}).click();

    await page.getByRole('listitem').getByRole('button', {name: 'Cart'}).click();
    await page.locator('div li').last().waitFor();
    await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();

    await page.getByRole('button', {name: 'Checkout'}).click();
    await page.getByPlaceholder('Select Country').pressSequentially('Ind');

    await page.getByRole('button', {name: 'India'}).nth(1).click();
    await page.getByText('PLACE ORDER').click();
    await expect(page.getByText('Thankyou for the order.')).toBeVisible();

    let orderId = await page.locator('label.ng-star-inserted').textContent();
    orderId = orderId.split('|')[1].trim();

    await page.locator("[routerlink*='myorders']").first().click();
    await page.locator('tbody').waitFor();
    const rows = await page.locator('tbody tr');
    for(let i =0; i < await rows.count(); ++i){
        const actualOrderId = await rows.nth(i).locator('th').textContent();
        if(actualOrderId.includes(orderId)){
            await rows.nth(i).locator('.btn-primary').click();
            break;
        }
    }

    const orderIdDetails = await page.locator('.col-text').textContent();
    await expect(orderId.includes(orderIdDetails)).toBeTruthy();
});