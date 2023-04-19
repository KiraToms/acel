const Web3 = require("web3")
const fs = require('fs');
const moment = require('moment');
const express = require('express')
const path = require('path')
const app = express()
const port = 8080
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/fa265574ec874eee8c4b53bb8b1cb345"))
// const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/2a22fabac031406db73f3db540dc954a"))

const getAttribs = require('./Attributesa.js')
const generateEvent = require('./Eventa.js');
const { Console } = require("console");

module.exports = async function extract(configFile, fileName, res){
    const scevs = []
   var configFile = configFile;
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
        chunks = 100; 
        events = [];
        for (let i= parseInt(sc.startBlock); i < parseInt(sc.endBlock); i=i+chunks) {
        //getting all events the smart contract address from start block to end block
        await myContract.getPastEvents('allEvents', {
            fromBlock:i,
            toBlock: i+chunks-1,
        }).then(r => { events = events.concat(r); console.log("success for sc :",sc.address," from block ", i, " to block ",i+chunks-1," with ",r.length, " evts") }, err => { console.error('sc '+sc.address+" for blockc "+i , err) }).catch(console.log);
        }
   
        for (const sce of events) {
          
                console.log("treating event "+sce.event)
            
            
            for (e of sc.Events) {
                
                let paramEqual = true
                let topic = Object.keys(sce.returnValues)
                let j = 0
                if (e.scEventName == sce.event) {
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

                    console.log('there is a match')
                    for (const em of e.eventMappings) {
                        let id = cptE
                        cptE++
                           console.log("the em ref is ")
                           console.log(em.toString())

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




                    }
                }
            }
      
            
        }


        
        test++

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
        

        let v = await callfor(myContract, sc)

    

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

     
       for (sc of configFile.smartContracts) {
            await callee(sc)
      }
   
        acels["acel:events"] = acelEvents
        acels["acel:objects"] = acelArtifs
        acels["acel:relations"] = acelRelations

        var jsonContent = JSON.stringify(acels);
       
        const AcelFileName = fileName.split('.', 1)[0]+".jsonacel"
        fs.writeFile(AcelFileName, jsonContent, 'utf8', function (err) {
           if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved. THe end");
            

        });


       

      
       
       


       
    }
    await prog()




}