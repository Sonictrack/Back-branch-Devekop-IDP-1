declare function require(name:string): any;
import logger from '../../config/logger';
import fs from 'fs';
const StringBuffer = require("stringbuffer");
import colors from 'colors/safe';
//const puppeteer = require('puppeteer')
import path from 'path';
//Init pupeeter browser
import Browser from "./UtilBrowser";

//Todo use a log library
//const logger = require('loglevel');


//Path config
//TODO use env config to set output dir of report 
// const SCRIPT_PATH = __dirname;
const TEMPLATE_DIR_PATH = path.resolve(process.env.FILE_SYSTEME_DIR as string, '..', 'reports');
const REPORT_DIR_PATH = path.resolve( process.env.FILE_SYSTEME_DIR as string, '..', 'reports', 'OutputReports') //old: SCRIPT_PATH+'/Report';
const TEMPLATE_REPORT_FILENAME = 'Template_ProtectID-Report.html'
const templateFilePath = path.join(TEMPLATE_DIR_PATH, TEMPLATE_REPORT_FILENAME);

// function AnalyseJsonReportTest(inputFileName) 
// {
//     fs.readFile(inputFileName, (err, data) => {
//         if (err)
//             throw err;
//         generateProtectIDReportFromJsonContent(data, inputFileName+'-REPORT-ID');
//         // let report = JSON.parse(data);
//         // let dynamicReportPath = generateReport(report, inputFileName)
//         // printPDF( dynamicReportPath ) 

//     });
// }

async function  generateProtectIDReportFromJsonFile(ariadNextJsonFilePath :string, reportId:string, recto: string, verso: string) {
    fs.readFile(ariadNextJsonFilePath, (err :any , data:any ) => {
        if (err)
            throw err;
        return generateProtectIDReportFromJsonContent(data, reportId+'-IDProtectReport', recto, verso);
    });
}

//Used when json report loaded from a text file
async function generateProtectIDReportFromStringifyedJsonContent(ariadNextJsonReportContent:string, reportId:string, recto: string, verso: string) {
    let jsonReport = JSON.parse(ariadNextJsonReportContent);
    return generateProtectIDReportFromJsonContent(jsonReport, reportId, recto, verso)
}

//Used when service directly returns json element : Generate the IDProtect pdf file from ariadnext document analysis report 
async function generateProtectIDReportFromJsonContent(jsonReport:any, reportId:string, recto: string, verso: string) {
    let dynamicHtmlReportPath = await generateHtmlReport(jsonReport, reportId, recto, verso);
    console.info('dynamicHtmlReportPath=['+dynamicHtmlReportPath+']')
    let dynamicReportPdfFilePath = printPDF( dynamicHtmlReportPath ) 
    //TODO : Test1 open a pdf file 
    //app.use('/pdf', express.static(__dirname + '/pathToPDF'));
    return dynamicReportPdfFilePath;
}

async function printPDF( htmlReportProtectIDFilePath :string ) {    
    try {        
        //Init puppeteer instance
        //const browser = await puppeteer.launch({ headless: true });
        const browser = await Browser.getInstance();
        const page = await browser.newPage();
        //await page.goto(path.join( SCRIPT_PATH, htmlReportProtectIDFilePath), {waitUntil: 'networkidle0'});        

        await page.goto(`file://${htmlReportProtectIDFilePath}`, {waitUntil: 'networkidle0'});        

        //Set pdf report file path 
        let pdfFilepath =  htmlReportProtectIDFilePath+'.pdf'
        console.info('dynamicPdfReportPath=['+pdfFilepath+']')
        //Generate pdf document from html report 
        const pdf = await page.pdf({ path: pdfFilepath, format: 'A4' },);        
        
        //Closing puppeteer resource
        //await browser.close
        return pdfFilepath        
    } catch (error) {
        console.log(error)
    }finally
    {
    }
  }

async function generateHtmlReport(report : any, reportId:string, recto: string, verso: string) {
    //fs.readFile(inputFileName, (err, data) => {
    // if (err)
    //         throw err;
    //     let report = JSON.parse(data);

        //TODO BUILD CONTROL REPORT CONTAINING ERROR AND WARN ONLY     
        var controlReport = new StringBuffer();
        var validityKo = "<em Class=\"classEmError\">[ERROR]</em>";
        var validityOk = "<em Class=\"classEmOk\">[OK]</em>";
        // Validité du type document 	==> MODEL_VALIDITY
        var modelValidity = validityOk;
        // Validité du document 		==> DOC_VALIDITY
        var docValidity = validityOk;
        // Conformité MRZ				==> MRZ_CONFORMITY
        var mrzConformityValidity = validityOk;
        // Validité MRZ OCR			==> MRZ_OCR_CONSISTENCY
        var mrzOcrConsistencyValidity = validityOk;
        // Validité éléments de sécurités visuels ==> DL_CONFORMITY
        var dlConformityValidity = validityOk;
        console.log('--CONTROL REPORT-------------------------------------');
        for (var i = 0; i < report.controls.length; i++) {
            let control = report.controls[i];
            console.log('\t--CONTROL[' + i + ']');
            console.log('\t=>control.identifier:' + control.identifier);
            console.log('\t=>control.identifier:' + control.titleMsg);
            console.log('\t=>control.result:' + control.result);

            if (control.result == 'ERROR') {

                //Set error report content 
                var currentErrorReport = '<EM Class=\"classEmError\">';

                console.log(colors.red('\t\t=>control.result:' + control.result));
                controlReport.append('---------------------------------\n');
                controlReport.append(colors.red(control.titleMsg + '[ERROR]\n'));
                for (var i = 0; i < control.control.length; i++) {
                    let subControl = control.control[i];
                    console.log('\t\t--CONTROL[' + i + ']');
                    console.log('\t\t=>subControl.identifier:' + subControl.identifier);
                    console.log('\t\t=>subControl.identifier:' + subControl.titleMsg);

                    if (subControl.result == 'ERROR') {
                        //Set error report content 
                        currentErrorReport = currentErrorReport + '<BR>' + 'Cause: ' + control.titleMsg;

                        controlReport.append('Cause: ' + control.titleMsg + '[ERROR]\n');
                        console.log(colors.red('\t\t=>subControl.result:' + subControl.result));
                    }
                    else {
                        console.log(colors.green('\t\t=>subControl.result:' + subControl.result));
                    }
                }
                currentErrorReport = validityKo + currentErrorReport + '</EM>';
                switch (control.identifier) {
                    case 'MODEL_VALIDITY':
                        modelValidity = currentErrorReport;
                        break;
                    case 'DOC_VALIDITY':
                        docValidity = currentErrorReport;
                        break;
                    case 'MRZ_CONFORMITY':
                        mrzConformityValidity = currentErrorReport;
                        break;
                    case 'MRZ_OCR_CONSISTENCY':
                        mrzOcrConsistencyValidity = currentErrorReport;
                        break;
                    case 'DL_CONFORMITY':
                        dlConformityValidity = currentErrorReport;
                        break;
                }
            }

            else {
                console.log(colors.green('\t\t=>control.result:' + control.result));
            }
        }
        //Control report
        console.log('--CONTROL REPORT-------------------------------------');
        console.log(controlReport.toString());

        //Image document management
        console.log('--IMAGE REPORT-------------------------------------');
        let img_dl_face = '';
        let img_dl_face_visible = 'false';
        let img_dl_verso = '';
        let img_dl_verso_visible = 'false';
        if (recto) {
            console.log("Recto image found to be displayed");
            img_dl_face = recto;
            img_dl_face_visible = 'true';
        } 
        if (verso) {
            console.log("Verso image found to be displayed");
            img_dl_verso = verso;
            img_dl_verso_visible = 'true';
        }
        // if(report.image)
        // {
        //     for (var i = 0; i < report.image.length; i++) {
        //         let img = report.image[i];
        //         console.log('img.type:' + img.type);
        //         if (recto) {
        //             img_dl_face = recto;
        //             img_dl_face_visible = 'true';
        //         } else if (verso) {
        //             img_dl_verso = verso;
        //             img_dl_verso_visible = 'true';
        //         }
        //     }
        // }

        //Mrz
        console.log('---------------------------------------');
        console.log(report.uid);
        console.log('---------------------------------------');
        console.log(report.mrz.line1);
        console.log(report.mrz.line1);

        console.log('---------------------------------------');

        //constant iDType
        // ID : National identity card
        // P : passport
        // V : Visa
        // RP : Residence permit
        // DL : Driving Licence
        // HC : Health Card
        // UNKNOWN : unknown type
        var lang = 'fr';
        console.log('Document Type: ' + report.documentClassification.idType);
        console.log('Document Type Converted: ' + convertIdType(report.documentClassification.idType, lang));

        let docDetails = report.documentDetail;
        console.log(docDetails.documentNumber);
        console.log(docDetails.emitAuthority);
        console.log(docDetails.emitCountry);
        var expirationDate = docDetails.expirationDate.month + '/' + docDetails.expirationDate.year;
        console.log(expirationDate);

        console.log('---------------------------------------');
        console.log('--Holder detail');
        console.log('---------------------------------------');
        /*console.log('Jour:' +report.holderDetail.day);
    console.log('Mois:' +report.holderDetail.month);
    console.log('Année:' +report.holderDetail.year);*/
        console.log('Nom:' + report.holderDetail.lastName);
        console.log('Prenom:' + report.holderDetail.firstName);
        console.log('Nationalité:' + report.holderDetail.nationality);
        console.log('Genre:' + report.holderDetail.gender);
        let d = report.holderDetail.birthDate;
        console.log('Date de naissance:' + d.day + '/' + d.month + '/' + d.year);
        console.log('Lieu de naissance:' + report.holderDetail.birthPlace);

        ////TEMPLATE_EXPERTIZE_RESULT and Badge conforme/non conforme 
        var TEMPLATE_SHIELD_DOC_KO = 'visible';
        var TEMPLATE_SHIELD_DOC_OK = 'hidden';
        var expertizeResult = '[DOCUMENT NON CONFORME]';
        var expertizeStyle = ' style="color:red; font-weight: 900;" ';

        if (controlReport.toString() == '') {
            //Control ok
            TEMPLATE_SHIELD_DOC_KO = 'hidden';
            TEMPLATE_SHIELD_DOC_OK = 'visible';
            expertizeResult = '[DOCUMENT CONFORME]';
            expertizeStyle = ' style="color:green; font-weight: 900;" ';
        }
        else {
            //Control ko
            TEMPLATE_SHIELD_DOC_KO = 'visible';
            TEMPLATE_SHIELD_DOC_OK = 'hidden';
        }

        //DYNAMIC REPORT GENERATION                
        console.log(' templateFilePath : ['+templateFilePath+']');
        let templateReport = fs.readFileSync(templateFilePath);
        let result = templateReport.toString()

            .replace('TEMPLATE_EXPERTIZE_RESULT_STYLE', expertizeStyle)
            .replace('TEMPLATE_EXPERTIZE_RESULT', expertizeResult)

            //Badge conforme / non conforme
            .replace('TEMPLATE_SHIELD_DOC_KO', TEMPLATE_SHIELD_DOC_KO)
            .replace('TEMPLATE_SHIELD_DOC_OK', TEMPLATE_SHIELD_DOC_OK)

            //Document image
            .replace('TEMPLATE_IMAGE_RECTO_VISIBLE', img_dl_face_visible)
            .replace('TEMPLATE_IMAGE_RECTO', img_dl_face)
            .replace('TEMPLATE_IMAGE_VERSO_VISIBLE', img_dl_verso_visible)
            .replace('TEMPLATE_IMAGE_VERSO', img_dl_verso)


            //Analysis info 
            .replace('TEMPLATE_EXPERTISE_NUMBER', report.uid)


            //Document info 
            .replace('TEMPLATE_COUNTRY', docDetails.emitCountry)
            .replace('TEMPLATE_DOCUMENT_TYPE', convertIdType(report.documentClassification.idType, lang))
            .replace('TEMPLATE_DOCUMENT_NUMBER', docDetails.documentNumber)

            //MRZ Info 
            //Holder info 
            .replace('TEMPLATE_NAME', report.holderDetail.lastName)
            .replace('TEMPLATE_FIRST_NAME', report.holderDetail.firstName)
            .replace('TEMPLATE_EMIT_DATE', docDetails.emitCountry)
            .replace('TEMPLATE_EXPIRY_DATE', expirationDate)

            // Validité du type document 	==> MODEL_VALIDITY
            // Validité du document 		==> DOC_VALIDITY
            // Conformité MRZ				==> MRZ_CONFORMITY
            // Validité MRZ OCR			==> MRZ_OCR_CONSISTENCY
            // Validité éléments de sécurités visuels ==> DL_CONFORMITY
            .replace('TEMPLATE_MODEL_VALIDITY', modelValidity)
            .replace('TEMPLATE_DOC_VALIDITY', docValidity)
            .replace('TEMPLATE_MRZ_CONFORMITY', mrzConformityValidity)
            .replace('TEMPLATE_MRZ_OCR_CONSISTENCY', mrzOcrConsistencyValidity)
            .replace('TEMPLATE_DL_CONFORMITY', dlConformityValidity);


        //Control results 
        //console.log(result.toString());
        let dynamicReportFilepath = path.join(REPORT_DIR_PATH,'DynamicReport-'+reportId+'.html')
        // fs.writeFileSync(dynamicReportFilepath, result);
        await recreatefFile(dynamicReportFilepath, result);
        return dynamicReportFilepath
    }
    //);
//}

// Delete file if existe and create file
function recreatefFile(path: string, data: any){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                fs.writeFileSync(path, data);
                fs.stat(path+'.pdf', (_err, _stats) => {
                    if (!_err) {
                        fs.rmSync(path+'.pdf');
                    }
                    resolve('');
                })
            }else{
                fs.rmSync(path);
                fs.stat(path+'.pdf', (_err, _stats) => {
                    if (!_err) {
                        fs.rmSync(path+'.pdf');
                    }
                    fs.writeFileSync(path, data);
                    resolve('');
                })
            }
        })
    })
}

//var fs = require('fs');
// function to encode file data to base64 encoded string
function base64_encode(file: string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function convertIdType(idType : string, lang='fr') {

    // ID : National identity card
    // P : passport
    // V : Visa
    // RP : Residence permit
    // DL : Driving Licence
    // HC : Health Card
    // UNKNOWN : unknown type
    switch (idType) {
        case 'ID':
            if (lang == 'fr') {
                return 'CNI';
            }
            return 'NATIONAL IDENTITY CARD';
        case 'P':
            if (lang == 'fr') {
                return 'PASSEPORT';
            }
            return 'PASSPORT';
        case 'V':
            if (lang == 'fr') {
                return 'VISA';
            }
            return 'VISA';
        case 'RP':
            if (lang == 'fr') {
                return 'CARTE DE RESIDENCE';
            }
            return 'RESIDENT PERMIT';
        case 'DL':
            if (lang == 'fr') {
                return 'PERMIS DE CONDUIRE';
            }
            return 'DRIVING LICENSE';
        case 'HC':
            if (lang == 'fr') {
                return 'CARTE VITALE';
            }
            return 'HEALTH CARD';
        default:
            return 'UNKNOWN DOCUMENT TYPE [' + idType + ']';
    }
}


//Export module lib 
export {
    //function generateProtectIDReportFromJsonFile(ariadNextJsonFilePath, reportId) 
    generateProtectIDReportFromJsonFile,
    //function generateProtectIDReportFromJsonContent(ariadNextJsonReportContent, reportId) 
    generateProtectIDReportFromJsonContent
};
