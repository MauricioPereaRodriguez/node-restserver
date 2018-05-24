// ========================================================
//  PUERTO
// ========================================================
process.env.PORT = process.env.PORT || 3000;

// ========================================================
//  ENTORNO
// ========================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================================
//  VENCIMIENTO DEL TOKEN
// ========================================================
//  60 segundos
//  60 minutos
//  24 horas
//  30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================================
//  SEED DE AUTENTICACIÓN
// ========================================================
process.env.SEED = process.env.SEED || 'secret';

// ========================================================
//  BASE DE DATOS
// ========================================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
// ========================================================
//  GOOGLE CLIENTE ID
// ========================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '498891394393-5f6hs8u9ductlksn71rcds6pocmo4vbb.apps.googleusercontent.com';