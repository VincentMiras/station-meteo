var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:start/:end/:list_capteur?', function(req, res, next) {
    const url = 'influxdb://localhost:8086'
    const startDate = req.params.start;
    const endDate = req.params.end;
    const listCapteur = req.params.list_capteur;

    if (!startDate) {
        return res.send('Le paramètre startDate est manquant !');
    }
    if (!endDate) {
        return res.send('Le paramètre endDate est manquant !');
    }
    res.send(`Le paramètre startDate est : ${startDate}.
        Le paramètre endDate est : ${endDate}.
        Le paramètre listCapteur est : ${listCapteur}.`)

});

module.exports = router;
