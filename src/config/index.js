const path = require('path');
const dotenv = require('dotenv');

const envFilePath = path.resolve(__dirname, '.env');
const config = dotenv.config({ path: envFilePath });

if (config.error) {
    console.error('could not find configurations from local file. Please make sure to passed them as env vars');
} else {
    console.log(`loaded configs from .env file => ${JSON.stringify(config.parsed)}`);
}
if(!process.env.PORT){
    throw new Error("PORT is required");
}
if(!process.env.AUTHPORT){
    throw new Error("AUTHPORT is required");
}
if(!process.env.MONGODB){
    throw new Error("MONGODB is required");
}
if(!process.env.ACCESS_TOKEN_SECRET){
    throw new Error("ACCESS_TOKEN_SECRET is required");
}
if(!process.env.REFRESH_TOKEN_SECRET){
    throw new Error("REFRESH_TOKEN_SECRET is required");
}
if(!process.env.ACCESS_TOKEN_EXPIRE){
    throw new Error("ACCESS_TOKEN_EXPIRE is required");
}
if (!/^\d+[smhd]$/.test(process.env.ACCESS_TOKEN_EXPIRE)) {
    throw new Error("ACCESS_TOKEN_EXPIRE is required and must be in valid JWT time format (e.g., 30s, 10m, 24h, 7d)");
}
if(!process.env.REFRESH_TOKEN_EXPIRE){
    throw new Error("REFRESH_TOKEN_EXPIRE is required");
}
if (!/^\d+[smhd]$/.test(process.env.REFRESH_TOKEN_EXPIRE)) {
    throw new Error("REFRESH_TOKEN_EXPIRE is required and must be in valid JWT time format (e.g., 30s, 10m, 24h, 7d)");
}

