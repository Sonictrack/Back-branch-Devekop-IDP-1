const ariadNextJsonReportParser = require("../AriadNextJsonReportParser");
const logger = require('loglevel');
const fs = require('fs');

//Delay startup to allow Initialization of singleton 
setTimeout(TestGenerateReport, 2000);

async function TestGenerateReport()
{
    let jsonReport;
    let data;
    
    //Test1
    jsonReport = '009_analysis.json';
    data  = fs.readFileSync(jsonReport);
    var pdfReport = await ariadNextJsonReportParser.generateProtectIDReportFromJsonContent(data, jsonReport+'-IDProtectReport');
    console.info(pdfReport);

    jsonReport = '011_analysis.json';
    data  = fs.readFileSync(jsonReport);
    var pdfReport = await ariadNextJsonReportParser.generateProtectIDReportFromJsonContent(data, jsonReport+'-IDProtectReport');
    console.info(pdfReport);
    
    jsonReport = '023_analysis.json';
    data  = fs.readFileSync(jsonReport);
    var pdfReport = await ariadNextJsonReportParser.generateProtectIDReportFromJsonContent(data, jsonReport+'-IDProtectReport');
    console.info(pdfReport);

    //TODO : Test1 open a pdf file !!!
    //app.use('/pdf', express.static(__dirname + '/pathToPDF'));
    /*var r1 = await JsonParser.generateProtectIDReportFromJsonFile('009_analysis.json','009_analysis');    
    logger.info(r1);

    var r2 = await JsonParser.generateProtectIDReportFromJsonFile('011_analysis.json','011_analysis');
    logger.info(r2);

    var r3 = await JsonParser.generateProtectIDReportFromJsonFile('023_analysis.json','023_analysis');
    logger.info(r3);*/
}

