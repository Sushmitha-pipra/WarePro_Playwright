import { Locator, Page } from "playwright-core";
import { BasePage } from "./BasePage";


export class DashboardPage extends BasePage{

    private searchField : Locator ; 
    private purchaseOrder: Locator;
    private salesOrder : Locator;
    private wareHouse : Locator;
    private product : Locator;
    private materialReceipt :  Locator;

    constructor(driver:Page){

        super(driver);
        this.searchField = driver.locator('//span[@class="global-search-box z-bandbox"]/input');
        this.purchaseOrder = driver.locator('//div[text()=" Purchase Order"]');
        this.salesOrder = driver.locator('//div[text()= " Sales Order"]');
        this.wareHouse = driver.locator('//div[text()=" Warehouse & Locators"]');
        this.product = driver.locator('//div[text()=" Product"]');
        this.materialReceipt = driver.locator("")
    }

    async globalSearch(searchWindow:string):Promise<void>{

       await this.clickElement(this.searchField);
       console.log(`Searchfield`);
       await this.driver.waitForTimeout(2000);
           console.log(`Searchpurchaseorder`);
       const searchWindowElement = `//div[text()=" ${searchWindow}"]`;
       const element = await this.driver.locator(searchWindowElement); //converting string to locator
       await this.clickElement(element);
        console.log(`Search data`);

    }
}


    