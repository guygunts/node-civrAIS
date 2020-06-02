const sql = require('mssql')
 const pathdev = require('dotenv').config({ path: './config/dev.env' });
const config = {
    user: pathdev.parsed.user,
    password: pathdev.parsed.password,
    server: pathdev.parsed.server,
    database: pathdev.parsed.database,
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    encrypt: false,
    options:{ enableArithAbort :true,
        trustedConnection:true,
        useUTC:true,
    },
    requestTimeout: 300000
}
const pool1 = new sql.ConnectionPool(config);
const pool1Connect = pool1.connect();

module.exports = pool1Connect