const { test, expect } = require('@playwright/test'); // import playwright test module

// test('First Playwright test', async function()
// {
//     //playwright code
//     //step1 - open browser
//     //step2 - enter u/p 2 secs
//     // await;
//     //step3 - click

// });

// Javascript code is async mean it will not wait to complete step in a sequesnce.
// To make it sync use await before each step and declacre function async.
// {fixture} are global variable available across the project

test('Browser Context Playwright test', async ({browser})=>
{
    const context = await browser.newContext(); // newContext() - To open a new incognito browser tab
    const page = await context.newPage(); // newPage() - To open a new page
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    // css, xpath selector
    await userName.fill("rahulshetty"); // locator() -> to find a element
    await page.locator("[type='password']").fill("learning"); // fill() -> to enter value in textbox
    await signIn.click(); // click() -> to click on a link or button
    const errorText = await page.locator("[style*='block']").innerText(); // innerText() -> to get inner text
    // console.log(errorText);
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toHaveText('Incorrect username/password.'); // Assertion on inner text
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    // console.log(await cardTitles.nth(1).textContent());
    // console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.last().textContent());
    // console.log(await cardTitles.nth(2).textContent());

    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});

test('Page Playwright test', async ({page})=>
{
    await page.goto("https://google.com"); // navigate to a page
    //get title - assertion
    console.log(await page.title()); // to get the current page title
    await expect(page).toHaveTitle("Google"); // Assertion on page title
});

test("UI Controls", async ({page})=> 
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult'); // selectOption('value') -> Select option by its value
    await page.locator('#usertype').last().click();
    await page.locator('#okayBtn').click();
    expect(page.locator('#usertype').last()).toBeChecked(); // assertion
    console.log(await page.locator('#usertype').last().isChecked()); // isChecked() - > return true if selected
    await page.locator('#terms').click();
    expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck(); // uncheck() -> To uncheck a checkbox
    expect(await page.locator('#terms').isChecked()).toBeFalsy(); // custumize assertion
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');

    await page.pause(); // pause() -> to pause the script and open a debug called playwright inspector
});

test("Child Windows Handling", async ({browser})=> 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const documentLink = page.locator("[href*='documents-request']");
    // Promise is simply a operation(step). Each Promise has three status - pending: Step is in the process of execution, rejected: Step failed due to some reason, fulfilled: Step succesfully executed
    
    // Use Promise.all to run two steps sync
    const [newPage, newPage2] = await Promise.all(
    [
        context.waitForEvent('page'), //listen for any new page
        documentLink.click(), //new page is opened
    ]);
    
    const text = await newPage.locator('.red').textContent();
    console.log(text);
    const arrayText = text.split("@");
    const domain = arrayText[1].split(' ')[0];
    console.log(domain);

    await userName.fill(domain);
    // await page.pause();
    console.log(await userName.inputValue());
});