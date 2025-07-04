require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path= require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoute")
const taskRoutes=require("./routes/taskRoutes")
const reportRoutes=require("./routes/reportRoutes")
// Middleware
app.use(cors({
    origin:process.env.CLIENT_URL || "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json());

//Route
app.use("/api/auth",authRoutes)
app.use("/api/task",taskRoutes)
app.use("/api/report",reportRoutes)
app.use("/api/users",userRoutes)
//Connect database
connectDB();
// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});