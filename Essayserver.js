const express = require('express');
const { Client } = require('@notionhq/client')
const cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const PORT = 4000;
const HOST = 'localhost';

const client = new Client({ auth: 'secret_qjeWg2EoAexevj8di8H23jwIUScrRY1lOjto6oEmqLw' })

const databaseId = '0bc51a6832b0468e8d9f734bc0a1503e'

// POST request
// POST name, phonenumber, extraInfo
// Functionality : Make a database entry in a Notion page with the databaseId above

app.post('/api/pages', jsonParser, async (req, res) => {
    const name = req.body.name;
    const date = req.body.date || new Date().toISOString().split('T')[0]; // '날짜' 값, 기본값은 오늘 날짜입니다.
    const division = req.body.division; // '구분√' 값
    const important = req.body.important; // '중요' 체크박스 값
    const urgent = req.body.urgent; // '긴급' 체크박스 값
    const mustDo = req.body.mustDo; // 'Must-DO' 체크박스 값
    const priority = req.body.priority; // '순위√' 값
    const inputCompleted = req.body.inputCompleted || true; // '입력완료' 체크박스 값, 기본값은 true입니다.

    try {
        const response = await client.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "항목√": {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                "구분√": {
                    select: {
                        name: division // 개인 또는 업무
                    }
                },
                "순위√": {
                    select: {
                        name: priority // 1, 2, 3, 4 중 하나
                    }
                },
                "날짜": {
                    date: {
                        start: date // 날짜
                    }
                },
                "중요": {
                    checkbox: important // true 또는 false
                },
                "긴급": {
                    checkbox: urgent // true 또는 false
                },
                "Must-DO": {
                    checkbox: mustDo // true 또는 false
                },
                "입력완료": {
                    checkbox: inputCompleted // true 또는 false, 기본값은 true
                }
            }
        })
        console.log(response)
        console.log('SUCCESS!')
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, HOST, () => {
    console.log(`Starting proxy at ${HOST}:${PORT}`);
})