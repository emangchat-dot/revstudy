import express from "express";
import tutorRouter from "./routes/tutor";

const app = express();

app.use(express.json());
app.use("/", tutorRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
