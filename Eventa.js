module.exports = async function generateEvent(web3, moment, em, sce, times){
        let event = {}

        event["acel:activity"] = em.eventName.value

       
        
        //get a tab of timestamps and query from it for every ev
        if(times[sce.blockNumber]==undefined){
            const blockData = await web3.eth.getBlock(sce.blockNumber) 
            // let tim = moment.unix(blockData.timestamp).format("YYYY-MM-DD|HH:mm:ss")
            // times[sce.blockNumber] = tim.toString()
            times[sce.blockNumber] = blockData.timestamp
        }
        // console.log("we stopped at the block "+sce.blockNumber)
        event["acel:timestamp"] = times[sce.blockNumber]
        // event["acel:blocknum"] = sce.blockNumber
       
        
        if (em.attributes !== undefined){
            event["acel:vmap"]={}
            let k = Object.keys(em.attributes)
            k.forEach(function(ak){

                event["acel:vmap"][ak] =sce.returnValues[em.attributes[ak].value]
            })
        }

        return event



};
