import Axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import verify from "jsonwebtoken/verify.js";
import { createLogger } from "../../utils/logger.mjs";

const logger = createLogger("auth");

const jwksUrl =
    "https://dev-j04lx6n51f7vqgf5.us.auth0.com/.well-known/jwks.json";

export async function handler(event) {
    try {
        logger.info("Authorizing a user", event.authorizationToken);
        const jwtToken = await verifyToken(event.authorizationToken);
        logger.info("User was authorized", jwtToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: "2012-10-17",
                Statement: [{
                    Action: "execute-api:Invoke",
                    Effect: "Allow",
                    Resource: "*",
                }, ],
            },
        };
    } catch (e) {
        logger.error("User not authorized", { error: e.message });

        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [{
                    Action: "execute-api:Invoke",
                    Effect: "Deny",
                    Resource: "*",
                }, ],
            },
        };
    }
}

async function verifyToken(authHeader) {
    const token = getToken(authHeader);
    const jwt = jsonwebtoken.decode(token, { complete: true });

    // TODO: Implement token verification
    try {
        const response = await Axios.get(jwksUrl);
        const keys = response.data.keys;
        const signingKeys = keys.find((key) => key.kid === jwt.header.kid);

        if (!signingKeys)
            throw new Error("The Jwks endpoint do not contain any keys!");

        const pemData = signingKeys.x5c[0];
        const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;

        return verify(token, cert, { algorithms: ["RS256"] });
    } catch (err) {
        logger.info("verify token failse:", err);
    }
}

function getToken(authHeader) {
    if (!authHeader) throw new Error("No authentication header");

    if (!authHeader.toLowerCase().startsWith("bearer "))
        throw new Error("Invalid authentication header");

    const split = authHeader.split(" ");
    const token = split[1];

    return token;
}