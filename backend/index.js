import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { initDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use("/api/users", postsRoutes);
app.use("/api/users", notificationRoutes);
app.use("/api/users", commentRoutes);
initDB();

app.listen(ENV.PORT, () => {
  console.log(`Server is listening on port ${ENV.PORT}`);
});
