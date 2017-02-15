var mysql = require('mysql');
var conn = mysql.createConnection({
    host: '192.168.1.88',
    user: 'root',
    password: '123123',
    database: 'chat',
    port: 3306
});

//连接错误，2秒重试
conn.connect(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
        setTimeout(handle , 1000);
    }
});

conn.on('error', function (err) {
    console.log('db error', err);
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handle();
    } else {
        throw err;
    }
});

function handle () {
    conn = mysql.createConnection({
        host: '192.168.1.88',
        user: 'root',
        password: '123123',
        database: 'chat',
        port: 3306
    });

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handle , 2000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handle();
        } else {
            throw err;
        }
    });
}
module.exports = conn;
