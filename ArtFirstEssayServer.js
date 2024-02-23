const express = require('express');
const { Client } = require('@notionhq/client')
const cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const app = express();

// CORS 설정을 먼저 추가
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const admin = require('firebase-admin');
const multer = require('multer');
const fs = require('fs')
const upload = multer({ dest: 'uploads/' }); // 파일을 저장할 디렉토리 설정
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// const storage = new Storage();

// Firebase Admin SDK 초기화
// const serviceAccount = require('./serviceAccountKey.json');
const serviceAccountPath = path.join(__dirname, './serviceAccountKey.json');
const storage = new Storage({ keyFilename: serviceAccountPath });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    storageBucket: "gs://essay-notion-database-api.appspot.com" // 여기에 본인의 버킷 이름을 입력하세요.
});
const bucket = admin.storage().bucket();

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    // Cloud Storage에 파일 업로드
    const blob = bucket.file(encodeURIComponent(file.originalname));
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        console.error(err);
        res.status(500).send(err);
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
        console.log("Encoded URL: ", publicUrl); // 이 부분 추가
        res.status(200).send({
            message: 'File uploaded.',
            title: file.originalname,
            link: publicUrl
        });
    });

    const fileBuffer = fs.readFileSync(file.path);
    blobStream.end(fileBuffer);
    console.log('fileBuffer : ', fileBuffer)
});

app.use(express.json());

const PORT = 4000;
const HOST = 'localhost';

const client = new Client({ auth: 'secret_kSkPeZvFqdikW27V7E6v1dw0ZTsRi3IMHSNvRoloNbU' })

const databaseId = '39e91b15f773441c9d8982ed2c1d7311'

// POST request
// POST name, phonenumber, extraInfo
// Functionality : Make a database entry in a Notion page with the databaseId above

// app.post('/api/pages', upload.single('pdf'), async (req, res) => { // 'multer' 미들웨어 사용
app.post('/api/pages', jsonParser, async (req, res) => { // 'multer' 미들웨어 사용
    const { title, author, meeting, week, date = new Date().toISOString().split('T')[0], inputCompleted = true, category, participants, files } = req.body;
    // const pdf = req.file; // multer가 처리한 파일 객체

    // if (!pdf) {
    //     return res.status(400).json({ error: 'No file uploaded.' });
    // }

    // const pdfData = fs.readFileSync(pdf.path); // 파일 읽기

    try {
        const response = await client.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "제목": {
                    title: [{
                        text: {
                            content: title
                        }
                    }]
                },
                "작가님": {
                    select: {
                        name: author
                    }
                },
                "n모임 선택": {
                    select: {
                        name: meeting
                    }
                },
                "n주차 선택": {
                    select: {
                        name: week
                    }
                },
                "날짜": {
                    date: {
                        start: date
                    }
                },
                "URL": { // URL 속성에 파일 URL 설정
                    url: files
                },
                "입력 완료": {
                    checkbox: inputCompleted
                },
                "카테고리": {
                    select: {
                        name: category
                    }
                },
                "참여": {
                    multi_select: participants.map(name => ({ name }))
                },
                "pdf": {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: title,
                                link: {
                                    url: files,
                                },
                            },
                        },
                    ],
                }
            }
            // children: [
            //     {
            //         object: "block",
            //         type: "paragraph",
            //         paragraph: {
            //             rich_text: [
            //                 {
            //                     type: "text",
            //                     text: {
            //                         content: `${title}_`,
            //                     },
            //                 },
            //                 {
            //                     type: "text",
            //                     text: {
            //                         content: author,
            //                         link: {
            //                             url: files,
            //                         },
            //                     },
            //                 },
            //             ],
            //         },
            //     },
            // ],
        })
        console.log(response)
        console.log('SUCCESS!')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the page.' });
    }
})

app.listen(PORT, HOST, () => {
    console.log(`Starting proxy at ${HOST}:${PORT}`);
})


const bucketName = "gs://essay-notion-database-api.appspot.com"; // 여기에 실제 버킷 이름을 입력하세요.
const fileName = 'greedy.pdf'; // 여기에 실제 파일 이름을 입력하세요.

async function downloadFile() {
    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: './greedy.pdf',
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);

    console.log(
        `${bucketName}/${fileName} downloaded to ${options.destination}.`
    );
}

downloadFile().catch(console.error);