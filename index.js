import express from 'express';
import prodRouter from "./helpers/routes/prodRoutes.js";
import cartRouter from "./helpers/routes/cartRoutes.js";
import {registrationUser} from "./shop/services.js";
import {errorHandler} from "./helpers/helpers.js";

const PORT = 5000;

const app = express();
app.use(express.json());

app.post('/api/register', registrationUser)

app.use('/api/products', prodRouter);

app.use('/api/cart', cartRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

