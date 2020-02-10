const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const uni = require('unirest');


const dbURL = process.env.MONGOURL || 'mongodb://127.0.0.1:27017/lexicon_words';

//okay you can do more of this later today. figure out this entire router and maybe switch to a different one 

router.get('/:word', (req, res) => {

    mongo.connect(dbURL, (err, client) => {
        if (err) res.send(err)

        const db = client.db("lexicon_words");

        if (!db) res.send(err)
        //now you decalre the db of the clent that you'v received. You want to go to the lexicon local library. 
        const collection = db.collection('words');
        //you want to go to the collection that you have called words. 

        if (!collection) res.send(err)

        const word = req.params.word;
        //now you create a constant for the word you sarched for. 

        //below you're looking through the collection that you've pulled 
        collection.find( { "_id" : word }).toArray((err, docs) => {
            //now you're going to try to look the mongo db database for the word that you've got. 
            if (err) throw err

            //docs pulls you back what you got back. 
            if (docs.length === 0) { 
                var unirest = uni("GET", `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`);

                unirest.headers({
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": "595475aff0mshfcbcdacf88b81bbp1b6c66jsnff4b868c999a"
                });

                unirest.end((resp) => {
                    
                    const obj = resp;

                    if (obj.statusCode != 200) { 
                        res.send("Word not found.");
                    
                    }else{

                        const wordObject = {
                            "_id" : obj.body.word, 
                            "definitions" : obj.body.definitions
                        }

                        collection.insertOne(wordObject, (err, dictionaryResponse) => {

                            if (err) throw err
                            
                            res.send(dictionaryResponse.ops);
                        });
                    }
                });
                
            }else{
                res.send(docs);
            }
        });
    });
});

module.exports = router;