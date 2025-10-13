const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('goals/setGoals');
});

module.exports = router;