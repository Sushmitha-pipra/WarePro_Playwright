// import { equal } from "assert";
import { BasePage } from "./BasePage";
import { Locator, Page } from "playwright-core";

export class LoginPage extends BasePage{ 

   private userNameField : Locator;
   private passwordField : Locator;
   private loginButton : Locator;
   private invalidData : Locator;
   private selectRoleField : Locator;
   private continueButton : Locator;

   constructor(driver : Page){
 
    super(driver);
    this.userNameField = driver.locator('//input[@autocomplete="username"]');
    this.passwordField = driver.locator('//input[@autocomplete="current-password"]');
    this.loginButton = driver.locator('//button[text()="Login"]');
    this.selectRoleField = driver.locator('//input[@value="Labour"]');
    this.continueButton = driver.locator('//button[text()= " Continue"]');
    this.invalidData = driver.locator('//span[text()="Invalid User ID or Password"]');

   }
    
    async loginToWarepro( userName: string , password : string , selectRole: string ){

      await this.fillText(this.userNameField, userName);
      await this.fillText(this.passwordField, password);
      await this.clickElement(this.loginButton);
      const invalidPopupStatus = await this.invalidData.isVisible();
      if(invalidPopupStatus){
          throw new Error(`Invalid Username : ${userName} and Password : ${password} `) ;
      }
      const roleStatus = await this.selectRoleField.isVisible();
      if(roleStatus){
        await this.fillText(this.selectRoleField, selectRole );
        await this.clickElement(this.continueButton);
      }

      const expectedTitle = "WarePro";
      const actualTitle = await this.driver.title();
      if(expectedTitle !== actualTitle){

        throw new Error(`Application title is invalid..Expected title : ${expectedTitle} but Actual title :${actualTitle}`)

      }
      else{
        console.log(`Successfully logged into Application...`);
      }


    }
  

}