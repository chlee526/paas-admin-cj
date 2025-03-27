require('dotenv').config({ path: '.env.local' });

const path = require('path');

const Client = require('ssh2-sftp-client');

const sftp = new Client();

const config = {
    host: '58.180.33.57',
    port: 22,
    username: process.env.DEPLOY_FTP_ID,
    password: process.env.DEPLOY_FTP_PW,
};

/**
 * dev : 개발
 * prod : 운영
 */
const deployEnv = process.argv[2];

const localDir = deployEnv === 'dev' ? path.join(__dirname, '@dist/dev') : path.join(__dirname, '@dist/prod');
const remoteDir = deployEnv === 'dev' ? '/usr/local/apache/htdocs/cjprdev/WebContent' : '/usr/local/apache/htdocs/cjpr/WebContent';

console.log(`FTP 배포 : ${deployEnv}`);

sftp.connect(config)
    .then(() => {
        console.log('FTP 접속 - 업로드 시작');
        return sftp.uploadDir(localDir, remoteDir);
    })
    .then(() => {
        console.log(`배포 완료 : ${deployEnv}`);
        return sftp.end();
    })
    .catch((err) => {
        console.error('Error:', err.message);
        sftp.end();
    });
