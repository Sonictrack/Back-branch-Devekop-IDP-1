import  nodemailer from 'nodemailer'
import logger from '../config/logger'
import { EMAIL_ACTION } from '../utils/enums'

function buildTexteVerificationCompte(action: string, token: string){
    const actionString = (action === EMAIL_ACTION.PASSWORD) ? 'password' : 'confirmation' 
    const reason = (action === EMAIL_ACTION.PASSWORD) ? 'changer votre mot de passe' : 'confirmer votre compte' 
    const url = process.env.FRONT_URL + "/commons/" + actionString +"/?" + action + "=" + token
    return `<p>Bonjour,</p>
    <p>Cliquez sur le lien ci-dessous pour ${reason}.</p>
    <a href=${url} target='_blank' style='font-size:14px; line-height:20px; font-weight:bold; text-transform:uppercase; text-decoration:none; padding:10px 16px; color:#ffffff; background-color:#59A1EC; border-radius:4px'>Confirmer ma demande</a>
    <p>Vous pouvez également copier-coller ce lien dans votre navigateur :</p>
    ${url} 
    <p>Si vous rencontrez un problème sur votre compte alors écrivez-nous à cette adresse : ${process.env.OVH_SERVICE_CLIENT_EMAIL} .</p>
    <p>A bientôt, L'équipe ID Protect.</p>`
}

function buildTextPayment(amount: string){
    return `<p>Bonjour,</p>
    <p>Nous vous confirmons le paiement de la somme de ${amount} €.</p>
    <p>Si vous rencontrez un problème sur votre compte alors écrivez-nous à cette adresse : ${process.env.OVH_SERVICE_CLIENT_EMAIL} .</p>
    <p>A bientôt, L'équipe ID Protect.</p>`
}

function buildRecapRenewDocument(form: any){
    const prefixe = `
    <p>Bonjour,</p>
    <p>Vous trouverez ci-dessous le récapitulatif de votre demande:</p>
    <table style="text-align: left;" border = "1">
    <tbody>
    <tr><th colspan="2" style="text-align:center"><u>Motif</u></th></tr>
    <tr><th>La demande concerne un:</th><td>${nullToEmpty(form.personType)}</td></tr>
    <tr><th>Type de document:</th><td>${nullToEmpty(form.documentType)}</td></tr>
    <tr><th>Raison du renouvellement:</th><td>${nullToEmpty(form.passeportReason)} ${nullToEmpty(form.idCardReason)}</td></tr>
    <tr><th>N° du document:</th><td>${nullToEmpty(form.documentNumber)}</td></tr>
    <tr><th>Autorité de délivrance:</th><td>${nullToEmpty(form.authority)}</td></tr>
    <tr><th>Date de délivrance:</th><td>${nullToEmpty(form.dateDeliverance)}</td></tr>
    <tr><th>Date d'éxpiration:</th><td>${nullToEmpty(form.dateExpiration)}</td></tr>
    <tr><th>Département où se fera la demande:</th><td>${nullToEmpty(form.departement)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Etat civil</u></th></tr>
    <tr><th>Votre sexe:</th><td>${nullToEmpty(form.sexe)}</td></tr>
    <tr><th>Votre nom de naissance:</th><td>${nullToEmpty(form.lastname)}</td></tr>
    <tr><th>Votre second nom:</th><td>${nullToEmpty(form.lastname2)}</td></tr>
    <tr><th>Il s'agit du nom:</th><td>${nullToEmpty(form.lastnameOrigine)}</td></tr>
    <tr><th>Voulez-vous faire apparaître un mot devant le deuxième nom:</th><td>${nullToEmpty(form.prefixeLastname)}</td></tr>
    <tr><th>Si oui, lequel:</th><td>${nullToEmpty(form.prefixeLastnameValue)}</td></tr>
    <tr><th>Prénom:</th><td>${nullToEmpty(form.firstname)}</td></tr>
    <tr><th>Second prénom:</th><td>${nullToEmpty(form.firstname2)}</td></tr>
    <tr><th>Troisième prénom:</th><td>${nullToEmpty(form.firstname3)}</td></tr>
    <tr><th>Votre hauteur:</th><td>${nullToEmpty(form.heigth)} cm</td></tr>
    <tr><th>Couleurs de vos yeux:</th><td>${nullToEmpty(form.eyesColor)}</td></tr>
    <tr><th>Votre date de naissance:</th><td>${nullToEmpty(form.birthdate)}</td></tr>
    <tr><th>Pays de naissance:</th><td>${nullToEmpty(form.birthCountryPlace)}</td></tr>
    <tr><th>Département de naissance:</th><td>${nullToEmpty(form.birthDepartementPlace)}</td></tr>
    <tr><th>Ville de naissance:</th><td>${nullToEmpty(form.birthCityPlace)}</td></tr>	
    <tr><th colspan="2" style="text-align:center"><u>Filiation > Père</u></th></tr>
    <tr><th>Père inconnu?:</th><td>${nullToEmpty(form.father)}</td></tr>
    <tr><th>Son nom:</th><td>${nullToEmpty(form.fatherLastname)}</td></tr>
    <tr><th>Son prénom:</th><td>${nullToEmpty(form.fatherFirstname)}</td></tr>
    <tr><th>Son second prénom:</th><td>${nullToEmpty(form.fatherFirstname2)}</td></tr>
    <tr><th>Son troisième prénom:</th><td>${nullToEmpty(form.fatherFirstname3)}</td></tr>
    <tr><th>Sa date de naissance:</th><td>${nullToEmpty(form.fatherBirthdate)}</td></tr>
    <tr><th>Né en France ou à l'étranger?:</th><td>${nullToEmpty(form.fatherBirthdateAreaPlace)}</td></tr>
    <tr><th>Son pays de naissance:</th><td>${nullToEmpty(form.fatherBirthdateCountryPlace)}</td></tr>
    <tr><th>Sa nationalité:</th><td>${nullToEmpty(form.fatherNationality)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Filiation > Mère</u></th></tr>
    <tr><th>Mère inconnue?:</th><td>${nullToEmpty(form.mother)}</td></tr>
    <tr><th>Son nom:</th><td>${nullToEmpty(form.motherLastname)}</td></tr>
    <tr><th>Son prénom:</th><td>${nullToEmpty(form.motherFirstname)}</td></tr>
    <tr><th>Son second prénom:</th><td>${nullToEmpty(form.motherFirstname2)}</td></tr>
    <tr><th>Son troisième prénom:</th><td>${nullToEmpty(form.motherFirstname3)}</td></tr>
    <tr><th>Sa date de naissance:</th><td>${nullToEmpty(form.motherBirthdate)}</td></tr>
    <tr><th>Née en France ou à l'étranger?:</th><td>${nullToEmpty(form.motherBirthdateAreaPlace)}</td></tr>
    <tr><th>Son pays de naissance:</th><td>${nullToEmpty(form.motherBirthdateCountryPlace)}</td></tr>
    <tr><th>Sa nationalité:</th><td>${nullToEmpty(form.motherNationality)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Nationalité</u></th></tr>
    <tr><th>Vous êtes français(e) parce que:</th><td>${nullToEmpty(form.nationality)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Adresse</u></th></tr>
    <tr><th>N° de la voie:</th><td>${nullToEmpty(form.streetNumber)}</td></tr>
    <tr><th>Extension:</th><td>${nullToEmpty(form.streetExtension)}</td></tr>
    <tr><th>Type de la voie:</th><td>${nullToEmpty(form.streetType)}</td></tr>
    <tr><th>Nom de la voie:</th><td>${nullToEmpty(form.streetName)}</td></tr>
    <tr><th>Complément d'adresse:</th><td>${nullToEmpty(form.streetComplement)}</td></tr>
    <tr><th>Code postal:</th><td>${nullToEmpty(form.zipCode)}</td></tr>
    <tr><th>Ville:</th><td>${nullToEmpty(form.city)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Informations de contact</u></th></tr>
    <tr><th>Téléphone mobile:</th><td>${nullToEmpty(form.phoneNumber)}</td></tr>
    <tr><th>Email de contact:</th><td>${nullToEmpty(form.email)}</td></tr>
    <tr><th colspan="2" style="text-align:center"><u>Détail du paiement</u></th></tr>`

    let payment = ""
    for(let i = 0; i < form.paymentDetails.length; i++){
        payment += `<tr><th>${form.paymentDetails[i].detail}:</th><td>${form.paymentDetails[i].amount} €</td></tr>`
    }

    const suffixeMessage = `</tbody>
    </table>
    <p>A bientôt, L'équipe ID Protect.</p>
    `
    return prefixe + payment + suffixeMessage
}

function nullToEmpty(value: string){
    return (value===null)? '' : value
}

function buildSuspendedAccount(){
    return `<p>Bonjour,</p>
    <p>Votre compte a été suspendu après 3 echec de connexion.</p>
    <p>Veuillez vous rendre sur notre site pour réinitialiser votre mot de passe en choisissant "Verifier votre compte ou mot de passe oublié!".</p>
    <p>Si vous rencontrez un problème alors écrivez-nous à cette adresse : ${process.env.OVH_SERVICE_CLIENT_EMAIL} .</p>
    <p>A bientôt, L'équipe ID Protect.</p>`
}

function buildCancelAccount(){
    return `<p>Bonjour,</p>
    <p>Votre compte a été surpprimé à votre demande.</p>
    <p>Pour toutes questions, écrivez-nous à cette adresse : ${process.env.OVH_SERVICE_CLIENT_EMAIL} .</p>
    <p>A bientôt, L'équipe ID Protect.</p>`
}

function buildDocumentRequest({ requestId }: any) {
    return `<p>Bonjour,</p>
    <p>Un professionel demande l'accès aux informations de conformité de votre document</p>
    <div>
        <a href="${process.env.FRONT_URL}/particuliers/request?requestId=${requestId}&status=confirm">Accepter</a>
        <a href="${process.env.FRONT_URL}/particuliers/request?requestId=${requestId}&status=reject">Refuser</a>
    </div>`
}

function buildDocumentRequestNewStatus({ requestId }: any) {
    return `<p>Bonjour,</p>
    <p>Le particulier vous a donné(e) accès à son document</p>
    <p>
        <a href="${process.env.FRONT_URL}/professionnels/document?requestId=${requestId}">Voir le document</a>
    </p>`
}

function buildDocumentRequestRejected() {
    return `<p>Bonjour,</p>
    <p>Le particulier à rejeté votre demande</p>
    `
}

const transporter = nodemailer.createTransport({
    host: process.env.OVH_EMAIL_SRV,
    secure: true,
    port: 465,
    auth: {
      user:  process.env.OVH_TECH_EMAIL,
      pass: process.env.OVH_TECH_PASSWORD
    },
    tls:{
       // secureProtocol: "TLSv1_method"
    }
  })

function sendEmail(email: string, token: string, action: string) {
    return new Promise((resolve,reject)=>{
    const msg: any = options(email, 'Votre compte ID Protect', buildTexteVerificationCompte(action, token))
    send(msg, resolve)
    })
}

async function sendEmailPayment(email: string, amount: string) {   
    return new Promise((resolve,reject)=>{
        const msg: any = options(email, 'Confirmation de paiement ID Protect', buildTextPayment(amount))
        send(msg, resolve)
    })
}

async function sendCancelationEmail(email: string) {
    return new Promise((resolve,reject)=>{
        const msg: any = options(email, 'Suppression de votre compte ID Protect', buildCancelAccount())
        send(msg, resolve)
    })
}

function sendEmailRecapRenewDocument(form: any, email: string) {
    return new Promise((resolve,reject)=>{
    const msg: any = optionsWithCC(email, 'Récapitulatif de la demande de pièce d\'identité', buildRecapRenewDocument(form))
    send(msg, resolve)
    })
}

function sendEmailSuspendedAccount(email: string) {
    return new Promise((resolve,reject)=>{
    const msg: any = options(email, 'Compte ID Protect suspendu', buildSuspendedAccount()) 
    send(msg, resolve)
    })
}

function sendEmailDocumentRequest(email: string, data: any) {
    return new Promise((resolve, reject) => {
        const message = options(email, 'Un professionel veut accéder à votre document', buildDocumentRequest(data))
        send(message, resolve)
    })
}

function sendEmailDocumentRequestNewStatus(email: string, data: any) {
    return new Promise((resolve, reject) => {
        if (data.status === 'rejected') {
            const message = options(email, 'Le particulier ne vous a pas autorisé(e) à accéder à ce document', buildDocumentRequestRejected())
            send(message, resolve)
            return;
        }

        const message = options(email, 'Vous avez maintenant accès au document', buildDocumentRequestNewStatus(data))
        send(message, resolve)
    })
}

function options(email: string, subject: string, callback: any){
    return { 
        from: process.env.OVH_TECH_EMAIL, 
        to: email, 
        subject: subject, 
        html: callback
    }
}

function optionsWithCC(email: string, subject: string, callback: any){
    return { 
        from: process.env.OVH_TECH_EMAIL, 
        to: email, 
        subject: subject, 
        html: callback,
        cc: process.env.OVH_RENOUVELLEMENT_EMAIL as string
    }
}

function send(msg: any, callback: any) {
    transporter.sendMail(msg, (err) => {
        if (err){
            return callback(err)
        }
        return callback(null)
    })
}

export { sendEmail, sendEmailPayment, sendCancelationEmail, sendEmailRecapRenewDocument, sendEmailSuspendedAccount, sendEmailDocumentRequest, sendEmailDocumentRequestNewStatus }