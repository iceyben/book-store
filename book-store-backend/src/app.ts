import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());



import booksRoutes from "./routes/book.route";
import bookCategory from "./routes/book.category.route";
import usersRoute from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import borrowBook from "./routes/borrow.route";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import wishlistRoutes from "./routes/wishlist.route";
import orderRoutes from "./routes/order.route";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";


app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/categories", bookCategory);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/borrows", borrowBook);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send("Book store backend is running");
});

export default app;
