const {test, expect} = require('@playwright/test');

test("Web Client App login", async ({page})=>
{
    const email = "Arjun@gmail.com";
    const productName = 'ADIDAS ORIGINAL';
    const products = page.locator('.card-body');
    await page.goto("https://rahulshettyacademy.com/client");
    
    await page.locator('#userEmail').fill(email);
    await page.locator("[type='password']").fill("Arjun@1998@");
    await page.locator("[name='login']").click();
    // await page.waitForLoadState('networkidle'); // waitForLoadState('networkidle') => Wait until all network calls are completed.
    await page.locator('.card-body b').first().waitFor();

    // console.log(await page.locator('.card-body b').first().textContent());

    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    const count = await products.count();
    for(let i =0; i< count; ++i){
        if(await products.nth(i).locator('b').textContent() === productName){
            await products.nth(i).locator('text=  Add To Cart').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator('div li').last().waitFor();
    const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator('text=Checkout').click();
    await page.locator("[placeholder*='Country']").pressSequentially('Ind');
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();
    const options = await dropdown.locator("button").allTextContents();

    for(let i =0;i<options.length;++i){
        if(options[i].trim()==='India'){
            await page.locator("[type='button']").nth(i).click();
            break;
        }
    }
    await expect(page.locator('.user__name label')).toHaveText(email);

    await page.locator('.action__submit').click();
    await expect(page.locator('.hero-primary')).toHaveText('Thankyou for the order.');

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