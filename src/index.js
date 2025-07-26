import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./db/index.js";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 7000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running OK on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(console.log(`Connection error ${err}`));
  });
// app.listen(PORT, () => {
//   console.log(`Server running OK on ${PORT}`);
// });
