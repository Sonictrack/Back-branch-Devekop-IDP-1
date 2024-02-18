const puppeteer = require('puppeteer')

/////////////////////////////////////////////////////////////////////
//Allow to use a browser singleton to access puppeteer features
/////////////////////////////////////////////////////////////////////
class BrowserProxy 
{
    initialized :boolean;
    BrowserInstance : any;

    constructor(){
        this.initialized = false;
    }    

    async getInstance() {
        if (this.initialized==false) {
            //initialize browser instance once             
            this.BrowserInstance = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
            this.initialized=true;
            console.log("Puppeteer successfully instancied")
        }
        return this.BrowserInstance;
    }
}

async function Init() : Promise<any>
{
    await MyBrowserProxy.getInstance();
}

const MyBrowserProxy = new BrowserProxy();
Init();

export default MyBrowserProxy;