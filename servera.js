const Web3 = require("web3")
const fs = require('fs');
const moment = require('moment');
const express = require('express')
const app = express()
const port = 8080
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/fa265574ec874eee8c4b53bb8b1cb345"))
// const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/2a22fabac031406db73f3db540dc954a"))

const getAttribs = require('./Attributesa.js')
const generateEvent = require('./Eventa.js');
const { Console } = require("console");
// app.get('/', (req, res) => {

module.exports = async function generateEvent(configFile, AcelFileName){
    const scevs = []
    //var rawdata = fs.readFileSync('configFileAugurAcelFull.json');
    //var rawdata = fs.readFileSync('configFileKittyAcelFull.json');
    var configFile = JSON.parse(configFile);
    var cptE = 1
    var cpts = {"rels":1}
    var acelEvents = {}
    var acelArtifs = {}
    var acelRelations = {}
    var acels = {}
    var test = 0
    var times = {}

    async function callfor(myContract, sc) {
        let events, chunks;
        chunks = 100; // Even 10,000 chunks have a few segments that error out
        events = [];
        for (let i= parseInt(sc.startBlock); i < parseInt(sc.endBlock); i=i+chunks) {
        //getting all events the smart contract address from start block to end block
        await myContract.getPastEvents('allEvents', {
            fromBlock:i,
            toBlock: i+chunks-1,
        }).then(r => { events = events.concat(r); console.log("success for sc :",sc.address," from block ", i, " to block ",i+chunks-1," with ",r.length, " evts") }, err => { console.error('sc '+sc.address+" for blockc "+i , err) }).catch(console.log);
        }
        // console.log({events}); 
        for (const sce of events) {
          
                console.log("treating event "+sce.event)
            
            
            for (e of sc.Events) {
                
                let paramEqual = true
                let topic = Object.keys(sce.returnValues)
                let j = 0
                if (e.scEventName == sce.event) {
                    // console.log('there is a match')
                    //checking if signatures (name for event and parameters and their order) of both events match
                    for (let i = topic.length / 2; i < topic.length; i++) {
                        if (e.parameters[j] != topic[i]) {
                            paramEqual = false
                            break;
                        }
                        else {
                            j++
                        }
                    }
                }

                if (e.scEventName == sce.event && paramEqual) {


                    for (const em of e.eventMappings) {
                        let id = cptE
                        cptE++
                        let event = await generateEvent(web3, moment, em, sce, times)

                        event["acel:omap"] = []
                        cpts = await getAttribs(acelArtifs, em.objects, "Artifacts", "o", event, sc, sce,  cpts)

                        event["acel:rmap"] = []

                        if(em.relations.length !== 0){
                           cpts = await getAttribs(acelRelations, em.relations, "Relations", "r", event, sc, sce, cpts, acelArtifs)
                         
                        }
                        var cont = {}
                        var ind = 0
                        let ts = Object.keys(acelEvents).every((i ) => {
                            if (event["acel:timestamp"]< acelEvents[i]["acel:timestamp"]){
                                // acelEvents.splice(i, 0, event)
                                cont = acelEvents[i]
                                ind = i+1
                                acelEvents[i] = event
                                return false
                            }
                            return true
                        })

                        
                        if (ts){
                            acelEvents[id] = event
                        }
                        else{
                            let ks = Object.keys(acelEvents).slice(ind).reverse()
                            ks.forEach((k)=>{
                                let v = k+1
                                acelEvents[v] = acelEvents[k]
                                delete acelEvents[k]
                            })
                            acelEvents[ind]= cont

                        }



                        

                        // console.log("the num of generated events is "+Object.keys(acels["acel:events"]).length)
                        // console.log("the num of generated objects is "+Object.keys(acels["acel:objects"]).length)
                        // console.log("the num of generated relations is "+Object.keys(acels["acel:relations"]).length)


                        // var jsonContent = JSON.stringify(acels);
                        //var jsonContent = acels;
                
                        
                        // fs.writeFile("AugurAacel_test.jsonacel", jsonContent, 'utf8', function (err) {
                        //     fs.writeFile("KittyAacel_22.jsonacel", jsonContent, 'utf8', function (err) {
                        //     if (err) {
                        //         console.log("An error occured while writing JSON Object to File.");
                        //         return console.log(err);
                        //     }
                
                        //     console.log("JSON file has been saved.");
                
                        // });

                    }
                }
            }
            // let scev = {
            //     "blocknum": sce.blockNumber,
            //     "tx_hash": sce.transactionHash,
            //     "contract_address": sce.address,
            //     "event": sce.event,
            //     "parameters": sce.returnValues
            // }
            // scevs.push(scev)
            
        }


        
        test++
        //console.log("sc events -----------------------------------\n"+ scevs.length)

        return test
    }

   


    async function callee(sc) {
        let myContract = new web3.eth.Contract(sc.abi, sc.address)

        let types = Object.keys(sc.Artifacts)
       
        types.forEach(function (at) {
            
            if (!acels["acel:global-log"]["acel:object-types"].includes(at)) {
                acels["acel:global-log"]["acel:object-types"].push(at)
            }
            let as = Object.keys(sc.Artifacts[at])
            as.forEach(function (a) {
                if (a !== "id" && a !== "Time") {
                    if (!acels["acel:global-log"]["acel:attribute-names"].includes(a)) {
                        acels["acel:global-log"]["acel:attribute-names"].push(a)
                    }
                }
            })
        })

       
          
        
        
        let rtypes = Object.keys(sc.Relations)
        
        rtypes.forEach(function (ar) {
            if (!acels["acel:global-log"]["acel:relation-types"].includes(ar)) {
            acels["acel:global-log"]["acel:relation-types"].push(ar)
            }
        })
        

        
        
        // console.log("we are here")
        // console.log("test has " + test)
        let v = await callfor(myContract, sc)

        
        // console.log("test has now " + test)
        // console.log("called for " + sc.address)



    }

 async function prog() {

        //header
        acels["acel:global-event"] = { "acel:activity": "__INVALID__" }
        acels["acel:global-object"] = { "acel:type": "__INVALID__" }

        acels["acel:global-log"] = {}
        acels["acel:global-log"]["acel:attribute-names"] = []
        acels["acel:global-log"]["acel:object-types"] = []
        acels["acel:global-log"]["acel:relation-types"] = []
        acels["acel:global-log"]["acel:version"] = "1.0"
        acels["acel:global-log"]["acel:ordering"] = "timestamp"

        //needs to wait for this
        for (sc of configFile.smartContracts) {
            await callee(sc)
            // console.log("ocl obj -----------------------------------\n" + Object.keys(acelArtifs))
            // console.log("ocl ev -----------------------------------\n" + Object.keys(acelEvents))
        }
        // configFile.smartContracts.forEach(function(sc){
        //     callee(sc)
        // })

        // acels["acel:events"] = acelEvents
        // acels["acel:objects"] = acelArtifs
        // console.log("the final num of generated events is "+Object.keys(acels["acel:events"]).length)
        // console.log("the final num of generated objects is "+Object.keys(acels["acel:objects"]).length)

        acels["acel:events"] = acelEvents
        acels["acel:objects"] = acelArtifs
        acels["acel:relations"] = acelRelations

        var jsonContent = JSON.stringify(acels);
        //var jsonContent = acels;
        // console.log("the size of acels so far ")
        // console.log(jsonContent)
        
        fs.writeFile(AcelFileName, jsonContent, 'utf8', function (err) {
            // fs.writeFile("KittyAacel_22.jsonacel", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved. THe end");

        });

        // var rdata = fs.readFileSync('A.jsonacel');
        // var evd = JSON.parse(rdata);
        //  console.log("the saved file contains ")
        // console.log(evd)


        // res.send(acels)
        // process.exit();
    }
    prog()



// })

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

}