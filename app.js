require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//location api
const locationRoutes = require('./routes/locationRoutes');

//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//authentication middleware
const authenticateUser = require('./middleware/authentication')

const connectDB= require('./db/connect');

//Router
const authRouter = require('./routes/auth')
const travelRouter = require('./routes/travels')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())


// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/travels',authenticateUser,travelRouter)
app.use('/api/location', locationRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
