const express = require('express');
const router = express.Router();

const goalsController = require('../controllers/goals');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, goalsController.allGoals);

router.get('/set-goals', isLoggedIn, goalsController.setGoal);

router.post('/save-goal', isLoggedIn, goalsController.saveGoal);

router.get('/edit-goal/:id', isLoggedIn, goalsController.editGoalForm);

module.exports = router;