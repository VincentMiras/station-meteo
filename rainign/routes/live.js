var express = require('express');
var router = express.Router();

function sendError(res) {
    return res.status(400).json({
    message: "A query argument is invalid"
    });
}

/* GET home page. */
router.get('/:list_capteur?', function(req, res, next) {
    const url = 'influxdb://localhost:8086'
    const capteurs = req.params.list_capteur;
    const valid_Capteur=['date','temperature','pressure','humidity','lux','wind_heading','wind_speed_avg','rain','lat','long']

    if (capteurs){
        const listC=capteurs.split('-');
        const listCapteur = Array.from(new Set(listC));
        for (let element of listCapteur){
            if (!valid_Capteur.includes(element)){
                console.log("Capteur(s) inconnu")
                return sendError(res);
            }
        }
        return res.send(`Le paramètre listCapteur est : ${listCapteur}.`)
    }

    if (!capteurs) {
        return res.send('Le paramètre list_capteur est manquant, mais la route fonctionne !');
    }
});

module.exports = router;
