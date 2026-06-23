import { test } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';



let basePage : BasePage; 
let loginPage : LoginPage;



test.describe('Login functionality' , ()=>{
   // hooks = beforeEach, beforeAll, afterEach , afterAll

   test.beforeEach(async ({page})=>{
       basePage = new BasePage(page);
       loginPage = new LoginPage(page);
   })

   test('Login into Warepro web application @login', async ({page})=>{

   await basePage.navigateToUrl('https://dev.warepro.in/webui/index.zul');
   await loginPage.loginToWarepro('Santosh','santosh','Pipra Admin');
   

   })

   test('Login with invalid credentials @invalidlogin', async ({page})=>{

   await basePage.navigateToUrl('https://dev.warepro.in/webui/index.zul');
   await loginPage.loginToWarepro('Santosh','pipra','Pipra Admin');

   })

})










































































//  await page.goto("https://dev.warepro.in/webui/index.zul");
//  await page.fill('//input[@autocomplete="username"]','santosh');
//  await page.fill('//input[@autocomplete="current-password"]','Pipra');
//  await page.click('//button[text()="Login"]');
//  const tle = await page.title();
//  const expTle = "WarePro";
//  console.log(tle);
//  if(tle === expTle){
//     console.log(`The page Title is:${tle}`)
//  }
//  else{
//     throw new Error(`The name should be similar The title is wrong actual title is ${tle} , But the provided title is ${expTle}`);
     
//     }
// await page.waitForTimeout(10000);

// })
