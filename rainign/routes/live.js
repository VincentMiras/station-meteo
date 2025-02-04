var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:list_capteur?', function(req, res, next) {
    const url = 'influxdb://localhost:8086'
    const listCapteur = req.params.list_capteur;

    if (!listCapteur) {
        return res.send('Le paramètre list_capteur est manquant, mais la route fonctionne !');
    }
    res.send(`Le paramètre list_capteur est : ${listCapteur}`);
});

module.exports = router;
