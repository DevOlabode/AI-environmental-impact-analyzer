// const express = require('express');
// const router = express.Router();

// const { storeReturnTo } = require('../middleware');

// const feedbackController = require('../controllers/feedback');
// const { isLoggedIn } = require('../middleware');

// router.post('/', storeReturnTo ,isLoggedIn, feedbackController.sendFeedback);
 
// module.exports = router;


const express = require('express');
const router = express.Router();

const { storeReturnTo } = require('../middleware');

const feedbackController = require('../controllers/feedback');
const { isLoggedIn } = require('../middleware');

router.post('/', storeReturnTo, isLoggedIn, feedbackController.sendFeedback);
 
module.exports = router;