const MongoClient = require('mongodb').MongoClient;
var TinyURL = require('tinyurl');
const validator = require('validator');
const url = 'mongodb://localhost:27017/mydb';

function createSMSTemplate(smsTemplate, callback) {
MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {

    if(err) {
        return new Error('failed to connect to Mongodb Server');
    }

    var db = client.db('mydb');

        db.collection('SMS').insertOne({
            ID: smsTemplate.id,
            Template: smsTemplate.template
        });
    
        callback();
        client.close();
});

}

function getTemplates(callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');

        db.collection('SMS').find().toArray().then((templates) => {
            callback(templates);
        }, (err) => {
            return new Error('Unable to fetch');
        });

        client.close();
    });

}

function getTemplate(id, callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');

        db.collection('SMS').find({ID: id}).toArray().then((template) => {
            callback(template);
        }, (err) => {
            return new Error('Unable to fetch');
        });

        client.close();
    });

}

function deleteTemplate(id, callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');

        db.collection('SMS').deleteOne({ID:id}, (err,obj) => {
            if(err) {
                return new Error('Unable to delete');
            } else {
                callback({"success": "Successfully deleted the template"});
            }
        });

        client.close();
    });

}

function updateTemplate(id, template, callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');
        var newTemplate = { $set: {Template: template } };

        db.collection('SMS').updateOne({ID:id}, newTemplate, (err,obj) => {
            if(err) {
                return new Error('Unable to update');
            } else {
                callback({"success": "Successfully updated the template"});
            }
        });

        client.close();
    });
}

function createDynamicText(id, name,  callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');

        if(validator.isURL(name)) {
        TinyURL.shorten(name, function(res, err) {
            if (err)
                throw err;
            callback(res);
            
        });
        }
        else {
        db.collection('SMS').findOne({ID: id},(err,result) => {
            console.log(result);
            if(err) {
                throw err;
            }
           
            callback(result.Template + " " + name);
        });
    }

        client.close();
    });

}

exports.createSMSTemplate = createSMSTemplate;
exports.getTemplates = getTemplates;
exports.getTemplate = getTemplate;
exports.deleteTemplate = deleteTemplate;
exports.updateTemplate = updateTemplate;
exports.createDynamicText = createDynamicText;