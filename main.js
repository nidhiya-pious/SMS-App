const MongoClient = require('mongodb').MongoClient;
const validUrl = require('valid-url');
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

function createDynamicText(id, urlBody,  callback) {
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
        var db = client.db('mydb');
       

        if (validUrl.isUri(urlBody.name)) {
            try {
                db.collection('URL').insertOne({urlBody});
                callback(urlBody);
                
            } catch (err) {
                res.send("Server error");
            }
        }
        else {
        db.collection('SMS').findOne({ID: id},(err,result) => {
            console.log(result);
            if(err) {
                throw err;
            }
           
            callback(result.Template + " " + urlBody.name);
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