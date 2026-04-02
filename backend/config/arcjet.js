import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";
import { ENV } from "./env.js";

// init arcjet
export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }), // shiled protects your app from common attacks e.g SQL injection, XSS, CSRf attacks
    detectBot({
      mode: "LIVE", // block all bots except search engines
      allow: [
        "CATEGORY:SEARCH_ENGINE", // see the full list at https://arcjet.com/bot-list
      ],
    }),
    // rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // after 10 seconds, 5 tokens gets refilled
      interval: 10, // 10 seconds interval
      capacity: 10, // 10 tokens capacity
    }),
  ],
});
