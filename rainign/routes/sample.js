var express = require('express');
var router = express.Router();


function isValidUTC(string) {
    const timestamp = Date.parse(string);
    return !isNaN(timestamp) && string.endsWith('Z');
  }

function sendError(res) {
    return res.status(400).json({
    message: "A query argument is invalid"
    });
}


/* GET home page. */
router.get('/:start/:end/:list_capteur?', function(req, res, next) {
    const url = 'influxdb://localhost:8086'
    const startDate = req.params.start;
    const endDate = req.params.end;
    const capteurs = req.params.list_capteur;
    const valid_Capteur=['date','temperature','pressure','humidity','lux','wind_heading','wind_speed_avg','rain','lat','long']

    if (!startDate) {
        console.log("Date de début absente")
        return sendError(res);
    }
    if (!endDate) {
        console.log("Date de fin absente")
        return sendError(res);
    }

    if (!isValidUTC(startDate)){
        console.log("Date de début invalide")
        return sendError(res)
    }

    if (!isValidUTC(endDate)){
        console.log("Date de fin invalide")
        return sendError(res)
    }

    if (capteurs){
        const listC=capteurs.split('-');
        const listCapteur = Array.from(new Set(listC));
        for (let element of listCapteur){
            if (!valid_Capteur.includes(element)){
                console.log("Capteur(s) inconnu")
                return sendError(res)
            }
        }
        return res.send(`Le paramètre startDate est : ${startDate}.
            Le paramètre endDate est : ${endDate}.
            Le paramètre listCapteur est : ${listCapteur}.`)
    }

    return res.send(`Le paramètre startDate est : ${startDate}.
        Le paramètre endDate est : ${endDate}.`)

});

module.exports = router;
