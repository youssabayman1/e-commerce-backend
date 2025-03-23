const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/ApiError");
const globelError = require("./middlewares/errorMiddlware");
const dbconnect = require("./config/database");

const categoryroute = require("./routes/categoryRoutes");
const subcategoryroute = require("./routes/subCategoryRoutes");
const brandsroute = require("./routes/BrandRoutes");
const productsroute = require("./routes/productRoutes");
const usersroute = require("./routes/userRoutes");
const authsroute = require("./routes/authRoutes");
const ordersroute = require("./routes/orderRoutes");
//connnect with db

dbconnect();

//express app
const app = express();

//middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
//mount route

app.use(`/api/${process.env.API_V}/categories`, categoryroute);
app.use(`/api/${process.env.API_V}/subcategories`, subcategoryroute);
app.use(`/api/${process.env.API_V}/brands`, brandsroute);
app.use(`/api/${process.env.API_V}/products`, productsroute);
app.use(`/api/${process.env.API_V}/users`, usersroute);
app.use(`/api/${process.env.API_V}/auth`, authsroute);
app.use(`/api/${process.env.API_V}/order`, ordersroute);

app.all("*", (req, res, next) => {
  next(new ApiError(`cant find this Route : ${req.originalUrl}`, 400));
});

//globel error handleing middleware for express
app.use(globelError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Run app on port ${PORT}`);
});

//hundleing rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutdown....`);
    process.exit(1);
  });
});
