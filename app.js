const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const http = require('http');
const app = express();
const main = require('./main');

app.use(bodyParser.json());
app.use(cors());

http.createServer(app).listen(4000, function () { });
console.log("SERVER STARTED AT PORT 4000");

app.post('/create', async (req, res) => {
    var smsTemplate = {
        id: req.body.id,
        template: req.body.template
    }

    if (!smsTemplate.id || !smsTemplate.template) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    await main.createSMSTemplate(smsTemplate, () => {
        res.status(200).send({ message: "Template Added Successfully" });
    });
});

app.get('/getAllTemplates', async (req, res) => {
    await main.getTemplates((templates) => {
        res.send(templates);
    });
});

app.get('/getTemplateByID/:id', async (req, res) => {
    var id = req.params.id;

    await main.getTemplate(id, (template) => {
        res.send(template);
    });
});

app.delete('/deleteByID/:id', async (req, res) => {
    var id = req.params.id;

    await main.deleteTemplate(id, (response) => {
        res.send(response);
    });
});

app.put('/update/:id', async (req, res) => {
    var id = req.params.id;
    var template = req.body.template;

    await main.updateTemplate(id, template, (response) => {
        res.send(response);
    })
});

app.post('/createDynamicSMS/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const baseUrl = "http://" + req.headers.host;
    const urlCode = shortid.generate();
    const shortUrl = baseUrl + '/' + urlCode;
    const urlBody = {
        name,
        baseUrl,
        urlCode,
        shortUrl
    }

    main.createDynamicText(id, urlBody, (response) => {
        res.send(response);
    });
})


