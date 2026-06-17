import { BasePage } from "../pages/BasePage";
import { DashboardPage } from "../pages/DashboardPage";
import { test } from "@playwright/test"


    let basePage : BasePage; 
    let dashboardPage : DashboardPage;
    

test.describe('Open Dashboard Screen @Dashboard', ()=>{

    test.beforeEach (async({page})=>{
    
        basePage : new BasePage(page);
        dashboardPage : new DashboardPage(page);

    })
    //  test('search for purchase order @purchaseorder', async ({page})=>{
    
    //    await basePage.clickElement("");
    
    //    })

})