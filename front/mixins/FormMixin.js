import { forEach, random } from 'lodash'

export default {
  props: {
    hasForm: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    fakeForm () {
      return { personType: 'Mineur_Plus_15', documentType: 'Carte_Identite', documentNumber: random(123456789, 193456789), departement: '02', oldDocumentPossession: true, authority: '323232323', dateDeliverance: '2021-05-16', dateExpiration: '2021-05-16', idCardReason: 'Vol', passeportReason: 'Vol', email: `idprotect${random(0, 999)}@yopmail.com`, password: 'SensitiveFeeling12$', birthCityPlace: null, birthdate: '-05-16', birthCountryPlace: '32323', eyesColor: 'ALBINOS', heigth: 118, firstname: '3323', firstname2: null, firstname3: null, lastname: '32323', lastname2: null, lastnameOrigine: null, prefixeLastname: false, prefixeLastnameValue: null, sexe: 'Femme', father: 'Non', mother: 'Non', fatherLastname: '3232323', fatherFirstname: '32323', fatherFirstname2: null, fatherFirstname3: null, fatherBirthdate: '2021-05-16', fatherBirthCountryPlace: 'France', fatherBirthCityPlace: '32323', fatherNationality: '2323', motherLastname: '23', motherFirstname: 'ALBINOSALBINOS', motherFirstname2: null, motherFirstname3: null, motherBirthdate: '2021-05-16', motherBirthCountryPlace: 'Autre', motherBirthCityPlace: 'ALBINOS', motherNationality: null, nationality: ['PAR_DECLAR', 'NATUR_FR'], streetNumber: '1', streetExtension: 'TER', streetType: 'AVENUE', streetName: 'ALBINOS', streetComplement: 'ALBINOSALBINOS', zipCode: '1', city: 'ALBINOS', phoneNumber: '1', lockDocument: true, terms: true }
    },
    getAreaPlace () {
      return [
        { value: 'France', text: 'FRANCE' },
        { value: 'Autre', text: "A L'ÉTRANGER" }
      ]
    },
    getDepartments () {
      return [
        { value: '01', text: 'AIN' },
        { value: '02', text: 'AISNE' },
        { value: '03', text: 'ALLIER' },
        { value: '04', text: 'ALPES-DE-HAUTE-PROVENCE' },
        { value: '05', text: 'HAUTES-ALPES' },
        { value: '06', text: 'ALPES-MARITIMES' },
        { value: '07', text: 'ARDECHE' },
        { value: '08', text: 'ARDENNES' },
        { value: '09', text: 'ARIEGE' },
        { value: '10', text: 'AUBE' },
        { value: '11', text: 'AUDE' },
        { value: '12', text: 'AVEYRON' },
        { value: '13', text: 'BOUCHES-DU-RHONE' },
        { value: '14', text: 'CALVADOS' },
        { value: '15', text: 'CANTAL' },
        { value: '16', text: 'CHARENTE' },
        { value: '17', text: 'CHARENTE-MARITIME' },
        { value: '18', text: 'CHER' },
        { value: '19', text: 'CORREZE' },
        { value: '20', text: 'CORSE' },
        { value: '21', text: "COTE-D'OR" },
        { value: '22', text: "COTES-D'ARMOR" },
        { value: '23', text: 'CREUSE' },
        { value: '24', text: 'DORDOGNE' },
        { value: '25', text: 'DOUBS' },
        { value: '26', text: 'DROME' },
        { value: '27', text: 'EURE' },
        { value: '28', text: 'EURE-ET-LOIR' },
        { value: '29', text: 'FINISTERE' },
        { value: '2A', text: 'CORSE-DU-SUD' },
        { value: '2B', text: 'HAUTE-CORSE' },
        { value: '30', text: 'GARD' },
        { value: '31', text: 'HAUTE-GARONNE' },
        { value: '32', text: 'GERS' },
        { value: '33', text: 'GIRONDE' },
        { value: '34', text: 'HERAULT' },
        { value: '35', text: 'ILLE-ET-VILAINE' },
        { value: '36', text: 'INDRE' },
        { value: '37', text: 'INDRE-ET-LOIRE' },
        { value: '38', text: 'ISERE' },
        { value: '39', text: 'JURA' },
        { value: '40', text: 'LANDES' },
        { value: '41', text: 'LOIR-ET-CHER' },
        { value: '42', text: 'LOIRE' },
        { value: '43', text: 'HAUTE-LOIRE' },
        { value: '44', text: 'LOIRE-ATLANTIQUE' },
        { value: '45', text: 'LOIRET' },
        { value: '46', text: 'LOT' },
        { value: '47', text: 'LOT-ET-GARONNE' },
        { value: '48', text: 'LOZERE' },
        { value: '49', text: 'MAINE-ET-LOIRE' },
        { value: '50', text: 'MANCHE' },
        { value: '51', text: 'MARNE' },
        { value: '52', text: 'HAUTE-MARNE' },
        { value: '53', text: 'MAYENNE' },
        { value: '54', text: 'MEURTHE-ET-MOSELLE' },
        { value: '55', text: 'MEUSE' },
        { value: '56', text: 'MORBIHAN' },
        { value: '57', text: 'MOSELLE' },
        { value: '58', text: 'NIEVRE' },
        { value: '59', text: 'NORD' },
        { value: '60', text: 'OISE' },
        { value: '61', text: 'ORNE' },
        { value: '62', text: 'PAS-DE-CALAIS' },
        { value: '63', text: 'PUY-DE-DOME' },
        { value: '64', text: 'PYRENEES-ATLANTIQUES' },
        { value: '65', text: 'HAUTES-PYRENEES' },
        { value: '66', text: 'PYRENEES-ORIENTALES' },
        { value: '67', text: 'BAS-RHIN' },
        { value: '68', text: 'HAUT-RHIN' },
        { value: '69', text: 'RHONE' },
        { value: '70', text: 'HAUTE-SAONE' },
        { value: '71', text: 'SAONE-ET-LOIRE' },
        { value: '72', text: 'SARTHE' },
        { value: '73', text: 'SAVOIE' },
        { value: '74', text: 'HAUTE-SAVOIE' },
        { value: '75', text: 'PARIS' },
        { value: '76', text: 'SEINE-MARITIME' },
        { value: '77', text: 'SEINE-ET-MARNE' },
        { value: '78', text: 'YVELINES' },
        { value: '79', text: 'DEUX-SEVRES' },
        { value: '80', text: 'SOMME' },
        { value: '81', text: 'TARN' },
        { value: '82', text: 'TARN-ET-GARONNE' },
        { value: '83', text: 'VAR' },
        { value: '84', text: 'VAUCLUSE' },
        { value: '85', text: 'VENDEE' },
        { value: '86', text: 'VIENNE' },
        { value: '87', text: 'HAUTE-VIENNE' },
        { value: '88', text: 'VOSGES' },
        { value: '89', text: 'YONNE' },
        { value: '90', text: 'TERRITOIRE DE BELFORT' },
        { value: '91', text: 'ESSONNE' },
        { value: '92', text: 'HAUTS-DE-SEINE' },
        { value: '93', text: 'SEINE-SAINT-DENIS' },
        { value: '94', text: 'VAL-DE-MARNE' },
        { value: '95', text: "VAL-D'OISE" }
      ]
    },
    getDocumentTypes () {
      return [
        { value: 'Passeport', text: 'Passeport' },
        { value: 'Carte_Identite', text: "Carte d'identité" }
      ]
    },
    getCidReasons () {
      return [
        { value: 'Premiere_demande', text: 'Première demande' },
        { value: 'Vol', text: 'Renouvellement pour vol' },
        { value: 'Perte', text: 'Renouvellement pour perte' },
        {
          value: 'Expiration',
          text: "Renouvellement pour cause d'expiration du passeport"
        },
        {
          value: 'Rectification',
          text: 'Renouvellement pour rectification du passeport'
        },
        { value: 'Deterioration', text: 'Renouvellement pour détérioration' }
      ]
    },
    getEyesColor () {
      return [
        { value: 'AUTRE', text: 'AUTRE' },
        { value: 'ALBINOS', text: 'ALBINOS' },
        { value: 'BLEUE', text: 'BLEUE' },
        { value: 'BLEU_GRIS', text: 'BLEU-GRIS' },
        { value: 'BLEU_VERT', text: 'BLEU-VERT' },
        { value: 'GRISE', text: 'GRISE' },
        { value: 'GRIS_VERT', text: 'GRIS-VERT' },
        { value: 'MARRON', text: 'MARRON' },
        { value: 'MARRON_VERT', text: 'MARRON-VERT' },
        { value: 'NOIRE', text: 'NOIRE' },
        { value: 'NOISETTE', text: 'NOISETTE' },
        { value: 'VAIRON', text: 'VAIRON' },
        { value: 'VERTE', text: 'VERTE' }
      ]
    },
    getGenders () {
      return [
        { value: 'Femme', text: 'Femme' },
        { value: 'Homme', text: 'Homme' }
      ]
    },
    getLastNameOrigins () {
      return [
        { value: 'Pere', text: 'Du père' },
        { value: 'Mere', text: 'De la mère' },
        { value: 'Epouse', text: 'Epouse' },
        { value: 'Epoux', text: 'Epoux' }
      ]
    },
    getNationalityOptions () {
      return [
        {
          value: 'NE_EN_FR_ET_PARENT_NE_EN_FR',
          text:
            "Vous êtes né(e) en France et l'un au moins de vos parents est né en France"
        },
        {
          value: 'NE_EN_FR_ET_PARENT_NE_ANCIEN_DEP_TER_FR',
          text:
            "Vous êtes né(e) en France et l'un au moins de vos parents est né dans un ancien département ou territoire français"
        },
        {
          value: 'NE_EN_FR_ET_PARENT_FR',
          text:
            "Vous êtes né(e) en France et l'un au moins de vos parents est français"
        },
        {
          value: 'PAS_NE_EN_FR_ET_PARENT_FR',
          text:
            "Vous n'êtes pas né(e) en France et l'un au moins de vos parents est français"
        },
        {
          value: 'PARENT_FR_AVANT_MAJ',
          text:
            'Votre mère ou votre père est devenu(s) français(e) avant votre majorité'
        },
        {
          value: 'PAR_MARIAGE',
          text: 'Vous êtes de nationalité française par mariage'
        },
        {
          value: 'NE_EN_FR_ET_PARENT_PAS_FR',
          text: 'Vous êtes né(e) en France et vos parents ne sont pas français'
        },
        { value: 'NATUR_FR', text: 'Vous êtes naturalisé(e) français(e)' },
        {
          value: 'REINTEG_FR',
          text: 'Vous avez été réintégré(e) dans la nationalité française'
        },
        {
          value: 'PAR_DECLAR',
          text:
            'Vous êtes français(e) par déclaration (autrement que par mariage)'
        },
        { value: 'AUTRE', text: 'Autre motif' }
      ]
    },
    getPassportReasons () {
      return [
        { value: 'Premiere_demande', text: 'Première demande' },
        { value: 'Vol', text: 'Renouvellement pour vol' },
        { value: 'Perte', text: 'Renouvellement pour perte' },
        {
          value: 'Expiration',
          text: "Renouvellement pour cause d'expiration du passeport"
        },
        {
          value: 'Rectification',
          text: 'Renouvellement pour rectification du passeport'
        },
        {
          value: 'Epuisement',
          text: 'Renouvellement pour cause de pages épuisées sur le passeport'
        },
        {
          value: 'Passeport_Delphine',
          text:
            'Passeport Delphine délivré à compter du 25 octobre 2005 et déplacement ou transit prévu pour les Etats-Unis'
        },
        { value: 'Deterioration', text: 'Renouvellement pour détérioration' }
      ]
    },
    getPersonsOptions () {
      return [
        { value: 'Adulte', text: 'Adulte' },
        { value: 'Mineur_Moins_15', text: 'Mineur moins de 15 ans' },
        { value: 'Mineur_Plus_15', text: 'Mineur de 15 ans et plus' }
      ]
    },
    getPrefixesLastNames () {
      return [
        { value: 'Epouse', text: 'Epouse' },
        { value: 'Epoux', text: 'Epoux' },
        { value: 'Veuve', text: 'Veuve' },
        { value: 'Veuf', text: 'Veuf' }
      ]
    },
    getStreetExtensions () {
      return [
        { value: 'BIS', text: 'BIS' },
        { value: 'TER', text: 'TER' },
        { value: 'QUATER', text: 'QUATER' },
        { value: 'QUINQUIES', text: 'QUINQUIES' },
        { value: 'A', text: 'A' },
        { value: 'B', text: 'B' },
        { value: 'C', text: 'C' }
      ]
    },
    getStreetTypes () {
      return [
        { value: 'RUE', text: 'RUE' },
        { value: 'AVENUE', text: 'AVENUE' },
        { value: 'BOULEVARD', text: 'BOULEVARD' },
        { value: 'ALLEE', text: 'ALLÉE' },
        { value: 'PLACE', text: 'PLACE' },
        { value: 'ROUTE', text: 'ROUTE' },
        { value: 'COURS', text: 'COURS' },
        { value: 'CHEMIN', text: 'CHEMIN' },
        { value: 'PROMENADE', text: 'PROMENADE' },
        { value: 'SENTE', text: 'SENTE' },
        { value: 'LE_BOURG', text: 'LE BOURG' },
        { value: 'CENTRE', text: 'CENTRE' },
        { value: 'CTRE_CIAL', text: 'CTRE CIAL' },
        { value: 'IMMEUBLE', text: 'IMMEUBLE' },
        { value: 'IMPASSE', text: 'IMPASSE' },
        { value: 'LIEU_DIT', text: 'LIEU-DIT' },
        { value: 'LOTISSEMENT', text: 'LOTISSEMENT' },
        { value: 'PASSAGE', text: 'PASSAGE' },
        { value: 'RESIDENCE', text: 'RÉSIDENCE' },
        { value: 'ROND_POINT', text: 'ROND-POINT' },
        { value: 'SQUARE', text: 'SQUARE' },
        { value: 'VILLAGE', text: 'VILLAGE' },
        { value: 'ZA', text: 'ZA' },
        { value: 'ZAC', text: 'ZAC' },
        { value: 'ZAD', text: 'ZAD' },
        { value: 'VILLA', text: 'VILLA' },
        { value: 'CHAUSSEE', text: 'CHAUSSEE' },
        { value: 'QUAI', text: 'QUAI' },
        { value: 'FAUBOURG', text: 'FAUBOURG' },
        { value: 'HAMEAU', text: 'HAMEAU' }
      ]
    },
    getText () {
      return {
        motif: {
          title: 'Motif',
          list: {
            personType: 'La demande concerne un:',
            documentType: 'Type de document:',
            idCardReason: 'Raison',
            passportReason: 'Raison',
            documentNumber: 'N° de la pièce:',
            oldDocumentPossession: 'Je suis en possession du document:',
            authority: 'Autorité de délivrance:',
            dateDeliverance: 'Date de délivrance:',
            dateExpiration: 'Date d\'expiration:',
            departement: 'Département où se fera la demande:'
          }
        },
        civil: {
          title: 'Etat Civil',
          list: {
            sexe: 'Votre sexe',
            lastname: 'Votre nom de naissance',
            lastname2: 'Votre second nom:',
            lastnameOrigine: 'Il s\'agit du nom:',
            prefixeLastname: 'Voulez-vous faire apparaître un mot devant le deuxième nom:',
            prefixeLastnameValue: 'Si oui, lequel:',
            firstname: 'Prénom:',
            firstname2: 'Second prénom:',
            firstname3: 'Troisième prénom:',
            heigth: 'Votre taille:',
            eyesColor: 'Couleurs de vos yeux:',
            birthdate: 'Votre date de naissance:',
            birthCountryPlace: 'Pays de naissance:',
            birthDepartementPlace: 'Département de naissance:', // missing
            birthCityPlace: 'Ville de naissance'
          }
        },
        father: {
          title: 'Filiation Père',
          list: {
            father: 'Père inconnu?',
            fatherLastname: 'Son nom:',
            fatherFirstname: 'Son prénom:',
            fatherFirstname2: 'Son deuxième prénom',
            fatherFirstname3: 'Son troisième prénom',
            fatherBirthdate: 'Date de naissance:',
            fatherBirthdateCountryPlace: 'Pays de naissance',
            fatherNationality: 'Nationalité'
          }
        },
        mother: {
          title: 'Filiation Mère',
          list: {
            mother: 'Mère inconnue?',
            motherLastname: 'Son nom:',
            motherFirstname: 'Son prénom:',
            motherFirstname2: 'Son deuxième prénom',
            motherFirstname3: 'Son troisième prénom',
            motherBirthdate: 'Date de naissance:',
            motherBirthdateCountryPlace: 'Pays de naissance',
            motherNationality: 'Nationalité'
          }
        },
        nationality: {
          title: 'Nationalité',
          list: this.getNationalityOptions
        },
        address: {
          title: 'Votre adresse',
          list: {
            streetNumber: 'Numéro de la voie',
            streetExtension: 'Extension',
            streetType: 'Type de voie',
            streetName: 'Nom de la voie',
            streetComplement: 'Complément d\'adresse',
            zipCode: 'Code postal',
            city: 'Ville'
          }
        },
        info: {
          title: 'Votre téléphone',
          list: {
            phoneNumber: 'Téléphone mobile:'
          }
        }
      }
    },
    yesNo () {
      return [
        { value: 'Oui', text: 'Oui' },
        { value: 'Non', text: 'Non' }
      ]
    }
  },
  mounted () {
    if (this.hasForm && !this.isModule) {
      forEach(this.hasForm, (x, i) => {
        this.form[i] = x
      })
    }
  }
}
