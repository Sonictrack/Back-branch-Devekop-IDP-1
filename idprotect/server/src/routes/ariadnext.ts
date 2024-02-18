import logger from '../config/logger';
import {Router} from 'express';
import {userLoggedIn} from '../middlewares/isLoggedIn';
import fetch from 'node-fetch';
import base64 from 'base-64';
import Admin from '../models/Admin';
import AriadNext from '../models/AriadNext';
import Client from '../models/Client';
import sequelize from '../init/database';
import Coffre from '../models/Coffre';
import Perte from '../models/Perte';
import { NormalModule } from 'webpack';
import { ARIAD_CHOICE } from '../utils/enums'

//ProtectID Report generation
import path from 'path';
// import pdf2base64 from 'pdf-to-base64';
import fs from 'fs';
import { readFile } from 'fs/promises';
import * as ariadNextJsonReportParser from "./IDProtectAnalyser/AriadNextJsonReportParser";
import { FollowedDocument } from '../models/FollowedDocument';

const ariadnext = Router();

const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Language' : 'fr',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Basic ' + base64.encode(`${process.env.ARIAD_NEXT_LOGIN}:${process.env.ARIAD_NEXT_PWD}`)
    }
};

ariadnext.post('/ariadnext/healthcheck', userLoggedIn, async (req, res) => {
    logger.info('Appel POST /ariadnext/healthcheck')
    try {
        const domain = req.body.domain
        const uri = getUri(domain) +'/v0/admin/health';
        logger.debug(uri);

        const admin = req.user as Admin
        logger.debug(`Vérification si AriadNext répond au healthcheck.`);

        fetch(uri, options)
            .then((response: any) => {
                return response.json()
            })
            .then((result: any) => {
                return res.json({result})
            })
            .catch((error: any) => {
                logger.error(error);
                return res.status(500).json({error: error.message});
            });
        
    } catch (e) {
        const messageTechnique = 'Anomalie technique survenue lors de la vérification du healcheck AriadNextHistorique'
        logger.error(`${messageTechnique} : ${e.message}.`)
        return res.status(500).json({error: messageTechnique})
    }
});

ariadnext.post('/ariadnext/user', userLoggedIn, async (req, res) => {
    logger.info('Appel POST /ariadnext/user')
    try {
        const domain = req.body.domain
        const uri = getUri(domain) +'/v0/admin/user';
        logger.debug(uri);

        const admin = req.user as Admin

        fetch(uri, options)
            .then((response: any) => {
                return response.json()
            })
            .then((result: any) => {
                return res.json({result})
            })
            .catch((error: any) => {
                logger.error(error);
                return res.status(500).json({error})
            });
    } catch (e) {
        const messageTechnique = 'Anomalie technique survenue lors de la vérification des info user AriadNextHistorique'
        logger.error(`${messageTechnique} : ${e.message}.`)
        return res.status(500).json({error: messageTechnique})
    }
});

ariadnext.post('/ariadnext/analysis', userLoggedIn, async (req, res) => {
    logger.info('Appel POST /ariadnext/analysis')
    const transaction = await sequelize.transaction();
    try {
        const admin = req.user as Client
        if (!req.body || !req.body.recto || !req.body.domain) {
            logger.error(`Le recto n'est pas renseigné!`)
            return res.status(400).json({ error: 'Le recto n\'est pas renseigné!.' })
        }

        if (admin.credits <= 0) {
            return res.status(400).json({ error: "Vous n'avez plus assez de crédits !" })
        }
        
        // const result: any = JSON.parse(fs.readFileSync(path.join(process.env.FILE_SYSTEME_DIR as string, '..', 'reports', 'Test', 'Test_023_analysis_Parsed.json'), { encoding: 'utf-8' }))

        const domain = req.body.domain
        const uri = getUri(domain) +'/v0/task/image?asyncMode=false';
        logger.debug(uri);

        const recto = req.body.recto.split(',')[1]    
        logger.debug(req.body.recto.split(',')[0])    
        const verso = !req.body.verso? undefined: req.body.verso.split(',')[1]

        // return res.status(200).json({result: 'ok'})
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Language' : 'fr',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Basic ' + base64.encode(`${process.env.ARIAD_NEXT_LOGIN}:${process.env.ARIAD_NEXT_PWD}`)
            },
            body: JSON.stringify({
                'frontImage': recto,
                'backImage': verso,
                'faceImageCropped': false,
                'rectoImageCropped' : false,
                'versoImageCropped' : false,
                'signatureImageCropped' : false
            })
        };

        const result = await analysis(uri, options)
    
        if(result.errorMessage)
            throw new Error(result.errorMessage)
    
        /////////////////////////////////////////////////////////////////////////////////
        //GENERATE PDF HERE and send it back to the browser
        /////////////////////////////////////////////////////////////////////////////////
        //Save json report for test needs
        // let dynamicReportFilepath = path.join(process.cwd(), 'tmp',result.documentDetail.documentNumber+'-ariadnext_json_report.json')
        let dynamicReportFilepath = path.join(process.env.FILE_SYSTEME_DIR as string, admin.clientNumber, result.documentDetail.documentNumber+'-ariadnext_json_report.json')
        fs.writeFileSync(dynamicReportFilepath, typeof result === 'string' ? result.toString() : JSON.stringify(result), { encoding: 'utf-8' });
            
        //Generate protect id pdf report 
        const protectIDReportPdf = await ariadNextJsonReportParser.generateProtectIDReportFromJsonContent(result, result.documentDetail.documentNumber, recto, verso);
        const data = success(admin, result, protectIDReportPdf!)
        console.info("protectIDReportPdf="+protectIDReportPdf);

        //Add analyse info to database
        const insert = await AriadNext.create({ ...data, ProtectIDPDFReport: fs.readFileSync(protectIDReportPdf!) }, { transaction })
        if (!insert)
             throw new Error("Anomalie lors de l'ajout des données d'analyse Ariad Next.")        
        await transaction.commit()

        const id = data.documentNumber
        logger.debug(`Recherche du numéro de document ${id} dans le coffre par l'utilisateur n° ${admin.id} ${admin.email}.`);
        const docCoffre = await Coffre.findOne({ where: { number: id } });
        
        let coffre = false
        if(docCoffre !== null){
            coffre = true
        }

        logger.debug(`Recherche du numéro de document ${data.documentNumber} dans les documents perdus.`);
        const docPerdu = await Perte.findOne({ where: { number: id } });
            
        let perte = false
        if(docPerdu !== null){
            perte = true
        }
        
        //////////////////////////////////////////////////////////////////
        //Send pdf report to client browser
        //////////////////////////////////////////////////////////////////
        //var d =fs.readFileSync(protectIDReportPdf);
        
        //Convert pdf report to base 64 buffer
        //Sample
        // pdf2base64("test/sample.pdf").then(
        //     (response) => {
        //     console.log(response); //cGF0aC90by9maWxlLmpwZw==
        // }).catch(
        //     (error) => {console.log(error); //Exepection error....
        // }
        // )
        // let pdfReport = await pdf2base64(protectIDReportPdf)
        
        //Test1
        //res.contentType("application/pdf");
        //res.send(d);
        
        //Test2
        //res.download(protectIDReportPdf, function (err) {

        //Test3
        /*res.sendFile(protectIDReportPdf, function (err) {
            if (err) {
                console.log("Error");
                console.log(err);
            } else {
                console.log("Success");
            }    
        });*/

        await Client.update({ credits: admin.credits - 1 }, { where: { id: admin.id } })

        const followedDocument = await FollowedDocument.findOne({ where: { number: data.documentNumber } })
        let clientNumber
        if(followedDocument && followedDocument.userId){
            const client = await Client.findOne({where: {id: followedDocument!.userId}})
            clientNumber = client!.clientNumber
        }

        res.json({
            numero: data.documentNumber, 
            uid: data.uid,
            validity: data.validity, 
            summary: JSON.parse(data.summary), 
            controls: JSON.parse(data.controls), 
            perte, 
            coffre, 
            protectIDReportPdf,
            clientNumber: clientNumber
        })

    } catch (e: any) {
        await transaction.rollback();
        const messageTechnique = 'Anomalie technique survenue lors de la vérification du document'
        logger.error(`${messageTechnique} : ${e.message}.`)
        return res.status(500).json({error: messageTechnique})
    }
});

async function analysis (uri: string, options: any):Promise<any> {
    return fetch(uri, options)
        .then((response: any) => {
            return response.json()
        })
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => {
            logger.error(error)
            throw new Error(error)
        })
};

function success (user: any, result: any, pdfReportPath:string): any {
    const ariadnext = {
        ownerId: user.id,
        email: user.email,
        credited: true,
        uid: result.uid,
        idType: result.documentClassification.idType,
        documentNumber: result.documentDetail.documentNumber,
        holderDetail: result.holderDetail.lastName + ' ' + result.holderDetail.firstName,
        country: result.documentDetail.emitCountry,
        emitDate: new Date(result.documentDetail.emitDate.year, result.documentDetail.emitDate.month, result.documentDetail.emitDate.day),
        expirationDate: new Date(result.documentDetail.expirationDate.year, result.documentDetail.expirationDate.month, result.documentDetail.expirationDate.day),
        validity: isValid(result.controls),
        summary: JSON.stringify(control(result.checkReportSummary.check)),
        controls: JSON.stringify(controls(result.controls)),
        otherDetails: pdfReportPath
    }

    return ariadnext;
}

function controls (controls: Array<any>): any {
    let result:Array<any> = []
    for (var i = 0; i < controls.length; i++) {
        if(controls[i].result === "ERROR" || controls[i].result === "WARNING"){
            result.push({identifier: controls[i].identifier , titleMsg: controls[i].titleMsg, resultMsg: controls[i].resultMsg, controls: control(controls[i].control)})
        }
     }
     return result
}

function control (data: Array<any>): any {
    let result = []
    for (var i = 0; i < data.length; i++) {
        if(data[i].result === "ERROR" || data[i].result === "WARNING"){
            result.push(data[i])
        }
     }
     return result
}

function isValid (controls: Array<any>): string {
    let result = "";
    for (var i = 0; i < controls.length; i++) {
        if(controls[i].identifier === "DOC_VALIDITY"){
            result = controls[i].result
            break
        } 
     }
     return result
}

function getUri (choice: string): string {
    const prefix = "https://";
    const suffixe = ".idcheck.io/rest";
    let result = 'sandbox'
    if(ARIAD_CHOICE.TEST === choice)
        result = 'api-test'
    else if (ARIAD_CHOICE.PRODUCTION === choice)
        result = 'api'

     return prefix + result + suffixe
}

ariadnext.post('/ariadnext/historiques', userLoggedIn, async (req, res) => {
    logger.info('Appel POST /ariadnext/historiques')
    try {
        const user = req.user instanceof Client ? req.user as Client : req.user as Admin
        const id = user instanceof Client ? user.clientNumber : user.id 
        logger.debug(`Récupération de l'historique par l'utilisateur n° ${id}.`);

        const historiques = await AriadNext.findAll({ where: { ownerId: id, email: user.email }});

        res.send({ historiques });
    } catch (e) {
        logger.error(`Anomalie survenue lors de la recherche de l'historique des vérifications des documents AriadNext : ${e.message}.`);
        res.status(500).send({error: `Anomalie survenue lors de l'historique des vérifications des documents AriadNext .`, });
    }
});

ariadnext.post('/ariadnext/historique', userLoggedIn, async (req, res) => {
    logger.info('Appel POST /ariadnext/historique')
    const transaction = await sequelize.transaction();
    try {
        if(!req.body.historique){
            logger.error('Le document est absent de la requête.');
            return res.status(400).send({ error: 'Le document est absent de la requête.' });
        }

        const user = req.user instanceof Client ? req.user as Client : req.user as Admin
        logger.debug(`Ajout de l'historique par l'utilisateur n° ${user.id}.`);

        const historique = JSON.parse(req.body.historique);
        const result = await AriadNext.create(historique, { transaction });

        if (!result)
            throw new Error("Anomalie lors de l'ajout dans l'historique AriadNext.")

        await transaction.commit();
        res.status(201).send({ success: 'success' });
    } catch (e) {
        await transaction.rollback();
        const messageTechnique = "Anomalie technique survenue lors de l'ajout dans l'historique AriadNext"
        logger.error(`${messageTechnique} : ${e.message}.`)
        res.status(500).json({ error: messageTechnique })
    }
});

ariadnext.post('/ariadnext/get_analysis_history', userLoggedIn, async (req, res) => {
    try {
        const client = req.user as Client

        const history = await AriadNext.findAll({ where: { email: client.email }, attributes: { exclude: [ "ProtectIDPDFReport" ] }, order: [["createdAt", 'DESC']] })

        return res.status(200).json({ history })
    } catch(e) {
        const messageTechnique = "Anomalie technique survenue lors de la récupération des analyses"
        logger.error(`${messageTechnique} : ${e.message}.`)
        res.status(500).json({ error: messageTechnique }) 
    }
})

ariadnext.post('/ariadnext/get_analysis', userLoggedIn, async (req, res) => {
    try {
        const history = await AriadNext.findOne({ where: { uid: req.body.uid } })

        return res.status(200).json({ history })
    } catch(e) {
        const messageTechnique = "Anomalie technique survenue lors de la récupération des analyses"
        logger.error(`${messageTechnique} : ${e.message}.`)
        res.status(500).json({ error: messageTechnique }) 
    }
})

export default ariadnext;
