import { Locator, Page } from "@playwright/test";
import { Console } from "console";
import { url } from "inspector";
import path from "path";
import { stringify } from "querystring";


export class BasePage {


   protected driver : Page

    constructor(driver:Page){

        this.driver=driver;

    } 

    
    async navigateToUrl(url:string): Promise<void>{
     console.log(`Navigating to URL: ${url}`);
     try{
        await this.driver.goto(url);
     }
     catch(error){
       throw new Error(`Failed to load:${url}`);
     }
    }
    

    async clickElement(selector:Locator): Promise<void>{
      try{
        await selector.click();
        console.log(`Clicked Element :${selector}`);
      }
      catch(error){
        throw new Error(`Failed to click:${selector}`);
      }
    }

    async fillText(selector:Locator , value:string):Promise<void>{

        await selector.fill(value);
         console.log(`Text Entered :${value}`);
      
    }

  
    async sleep(timeInMs:number):Promise<void>{

      await this.driver.waitForTimeout(timeInMs);

    }
    












































    // protected page : Page;

    // constructor(page: Page) {
    //     this.page = page;
    // }

    // async clickElement(selector:string){

    //   await this.page.click(selector);
    //   await this.navigateToUrl("Hello");
        
    // }

    //  async navigateToUrl(url: string){

    //     await this.page.goto(url);

    // }
    

    
}