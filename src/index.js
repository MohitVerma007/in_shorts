const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const axios = require("axios")

//import passport middleware
require("./middlewares/passport-middleware");

//initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

//import routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const mailRoutes = require("./routes/userRoute");

//initialize routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/mail", mailRoutes);


app.get('/image/:param1/:param2', async (req, res) => {
  const param1 = req.params.param1;
  const param2 = req.params.param2;

  // Log the parameters or perform some logic
  console.log(`Received parameters: ${param1}, ${param2}`);

  // External image URL
  const imageUrl = 'https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/Hyundai-Grand-i10-Nios-200120231541.jpg';

  try {
    // Fetch the image from the external URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Set the appropriate headers
    res.set('Content-Type', response.headers['content-type']);

    // Send the image as a response
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching the image:', error);
    res.status(500).send('Error fetching the image');
  }
});

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();
