import { test } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';



let basePage : BasePage; 
let loginPage : LoginPage;
let dashboardPage: DashboardPage;



test.describe('Create Purchase Order ' , ()=>{
   

   test.beforeEach(async ({page})=>{
       basePage = new BasePage(page);
       loginPage = new LoginPage(page);
       dashboardPage = new DashboardPage(page);
   })

   test('Purchase Order creation through Admin @purchaseorder', async ({page})=>{

        await basePage.navigateToUrl("https://dev.warepro.in/webui/");
        await loginPage.loginToWarepro('Santosh','santosh','Pipra Admin');
        await dashboardPage.globalSearch("Purchase Order");
        await page.waitForTimeout(3000);

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
