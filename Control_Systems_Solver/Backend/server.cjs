const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const router = express.Router(port);
const controller = require('./controllers/controller.cjs');

// Middleware to parse JSON bodies
app.use(express.json());
// Use cors to avoid it's problems
app.use(cors());

// get routes
router.post('/solve', controller.solve); // Get status of a service

module.exports = router;

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});