const express = require('express');
const { Client } = require('@notionhq/client')
const cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const PORT = 4000;
const HOST = 'localhost';

const client = new Client({ auth: 'secret_Hjxd1UawB1mOVKTvoFQKxmeFfesE8SxaM916BXujLE3' })

const databaseId = '2d89b14c3a484087a86ba3f9c79ada1d'

// POST request
// POST name, phonenumber, extraInfo
// Functionality : Make a database entry in a Notion page with the databaseId above

app.post('/api/pages', jsonParser, async (req, res) => {
    // req.body
    /* {
        name: "Cooper Codes"
        phoneNumber: "Cooper Codes"
        extraInfo: "Cooper Codes"
    } */
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const extraInfo = req.body.extraInfo;

    try {
        const response = await client.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "Name": {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                "Phone Number": {
                    rich_text: [
                        {
                            text: {
                                content: phoneNumber
                            }
                        }
                    ]
                },
                "Extra Information": {
                    rich_text: [
                        {
                            text: {
                                content: extraInfo
                            }
                        }
                    ]
                },
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