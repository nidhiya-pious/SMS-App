const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const main = require('./main');
const validator = require('validator');

app.use(bodyParser.json());
app.use(cors());

http.createServer(app).listen(4000, function() {});
console.log("SERVER STARTED AT PORT 4000");

app.post('/create', async (req,res) => {
    var smsTemplate = {
         id: req.body.id,
         template: req.body.template
    }

    if (!smsTemplate.id || !smsTemplate.template) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
      }

    await main.createSMSTemplate(smsTemplate, () => {
        res.status(200).send({message: "Template Added Successfully"});
    });
});

app.get('/getAllTemplates', async (req, res) =>  {
    await main.getTemplates((templates)=>{
        res.send(templates);
});
});

app.get('/getTemplateByID/:id', async (req, res) => {
    var id = req.params.id;

     await main.getTemplate(id, (template) =>{
        res.send(template);
    });
});

app.delete('/deleteByID/:id', async (req, res) => {
     var id = req.params.id;

     await main.deleteTemplate(id, (response) =>{
        res.send(response);
    });
});

app.put('/update/:id', async (req,res) => {
    var id = req.params.id;
    var template = req.body.template;

    await main.updateTemplate(id, template, (response)=>{
        res.send(response);
    })
});

app.get('/createDynamicSMS/:id', async (req,res) => {
    var id = req.params.id;
    var name = req.query.name;
    var url = req.url;

    main.createDynamicText(id, name, (response) =>{
        res.send(response);
    });
})

