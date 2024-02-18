import logger from "../config/logger";
import { Router } from "express";
import { userLoggedIn } from "../middlewares/isLoggedIn";

const security = Router();

security.post("/check_user_allowed", userLoggedIn, async (req, res) => {
    logger.info("Appel POST /check_user_allowed")
    res.send({ success: "success" });
});

export default security;