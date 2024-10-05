import express from 'express';
import prodRouter from "./routes/prodRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import {PORT} from "./constants.js";
import {signUp} from "./controllers/user.controllers.js";
import {errorHandler} from "./middleware/errorHandler.js";


const app = express();
app.use(express.json());

app.post('/api/register', signUp)

app.use('/api/products', prodRouter);

app.use('/api/cart', cartRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

