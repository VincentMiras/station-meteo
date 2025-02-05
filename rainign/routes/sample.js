var express = require('express');
var router = express.Router();


function isValidUTC(string) {
    const timestamp = Date.parse(string);
    return !isNaN(timestamp) && string.endsWith('Z');
  }


/* GET home page. */
router.get('/:start/:end/:list_capteur?', function(req, res, next) {
    const url = 'influxdb://localhost:8086'
    const startDate = req.params.start;
    const endDate = req.params.end;
    const capteurs = req.params.list_capteur;
    const valid_Capteur=['date','temperature','pressure','humidity','lux','wind_heading','wind_speed_avg','rain','lat','long']

    if (!startDate) {
        return res.send('Le paramètre startDate est manquant !');
    }
    if (!endDate) {
        return res.send('Le paramètre endDate est manquant !');
    }

    if (!isValidUTC(startDate)){
        res.send(`Date de début invalide`)
    }

    if (!isValidUTC(endDate)){
        res.send(`Date de fin invalide`)
    }

    if (capteurs){
        const listC=capteurs.split('-');
        const listCapteur = Array.from(new Set(listC));
        for (let element of listCapteur){
            if (!valid_Capteur.includes(element)){
                res.send(`Paramètres non valide`)
            }
        }
        res.send(`Le paramètre startDate est : ${startDate}.
            Le paramètre endDate est : ${endDate}.
            Le paramètre listCapteur est : ${listCapteur}.`)
    }

    res.send(`Le paramètre startDate est : ${startDate}.
        Le paramètre endDate est : ${endDate}.`)

});

module.exports = router;
