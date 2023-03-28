module.exports = function getAttribs(elementArray, elements, elementType, elementInitial, event, sc, sce, cpts, artifs){
    const ei = elementInitial
    let type = ""
    var id = ""
    let cptsc = cpts
elements.forEach(function(o){
    //here should check if ob id is increm or in scev to be added in concep
    
    if(ei=="o"){
         type = "objectType"
    }
    else{
         type = "relationType"
    }

    

    if (ei=='r'){
        var chng = true
        let k = Object.keys(elementArray)
                k.forEach(function(ak){
                    if(elementArray[ak]["acel:type"]==o[type]){
                        
                        // console.log("the id matching "+ak)
                        // console.log("the id type "+elementArray[ak]["acel:type"])
                        // console.log("the treated obj type "+o[type])
                        if(elementArray[ak]["acel:rvmap"]["source"]==sce.returnValues[o.source] ) {
                            
                            id = ak
                            chng = false
                            // console.log("rel id fetched ------------------------------    "+id)
                        }
                    }
                })
                
                
        if(chng){
            // console.log(" rel id is "+id)
            // console.log('before updating the cpts of rel is '+cptsc["rels"])
             id=sc[elementType][o[type]].id.incrementalBase + cptsc["rels"]
            // console.log("new rel created id "+id)
            cptsc["rels"] = cptsc["rels"] + 1
            // console.log('after updating the cpts of rel is '+cptsc["rels"])

        }
       
    }
    else{


        if(o.id=="base"){
            if(cptsc[o[type]]==undefined){
                //console.log("the cpts keys are now "+Object.keys(cpts))
                cptsc[o[type]]=1
            }
            
            // console.log("cpt of "+o[type]+" has val "+cpts[o[type]])
            id= sc[elementType][o[type]].id.incrementalBase+cptsc[o[type]]
            cptsc[o[type]]= cptsc[o[type]]+1
            
            // console.log("cpt of "+o[type]+" has now val "+cpts[o[type]])
            
        }
        

        else{
           // console.log("the id "+o.id)
            if(o.id=="composed"){
                //console.log("its type "+o[type])
                let k = Object.keys(elementArray)
                k.forEach(function(ak){
                    if(elementArray[ak]["acel:type"]==o[type]){
                        
                        // console.log("the id matching "+ak)
                        // console.log("the id type "+elementArray[ak]["acel:type"])
                        // console.log("the treated obj type "+o[type])
                        if(elementArray[ak]["acel:ovmap"][sc[elementType][o[type]].composedId[0]]==sce.returnValues[o.composedId[0]] && 
                            elementArray[ak]["acel:ovmap"][sc[elementType][o[type]].composedId[1]]==sce.returnValues[o.composedId[1]]) {
                                // console.log("sucess-------------------------------------------------------------------------------------------------")
                                id = ak
                                console.log("fetched obj id is ////////////////// "+id)
                            }
                    }
                })

                // console.log("last id is******** "+id)
               
            }

            else{  
             id = sce.returnValues[o.id] 
            //  console.log('the sce return vals are '+ Object.keys(sce.returnValues))
            //  console.log('obj '+o.id+' sce returns '+sce.returnValues[o.id] +' id is '+id)
            }
        }
      
        //id= parseFloat(this.cptR).toFixed(1)
        // id= "O"+cpt
        // cpt++
    }
    

    // console.log('pushing elem type '+o[type]+ 'with id ' + id)
    event["acel:"+ei+"map"].push(id)

  

    if (o.attributes !== undefined){
        let k = Object.keys(o.attributes)
        k.forEach(function(ak){
       
            
            if(sc[elementType][o[type]][ak].static ){
            
                if(elementArray[id]==undefined){
                    elementArray[id]={}
                    elementArray[id]["acel:type"]=o[type]
                    elementArray[id]["acel:"+ei+"vmap"] = {}
                }

                var av = ""

                if(o.attributes[ak].composedId !=undefined){

                let k = Object.keys(elementArray)
                k.forEach(function(vk){
                    if(elementArray[vk]["acel:type"]==o.attributes[ak].artifact){
                        if(elementArray[vk][sc[elementType][o.attributes[ak].artifact].composedId[0]]==sce.returnValues[o.attributes[ak].composedId[0]] && 
                            elementArray[vk][sc[elementType][o.attributes[ak].artifact].composedId[1]]==sce.returnValues[o.attributes[ak].composedId[1]]) {
                                av = vk
                            }
                    }
                })

                }

                else{
                    av = sce.returnValues[o.attributes[ak]]
                }

                elementArray[id]["acel:"+ei+"vmap"][ak]= av
            }

            else{
                             
                if( event["acel:"+ei+"cmap"]== undefined){
                    event["acel:"+ei+"cmap"] = {}
                }
                if(event["acel:"+ei+"cmap"][id]==undefined){
                    
                    event["acel:"+ei+"cmap"][id] = {}
                }
                event["acel:"+ei+"cmap"][id][ak]=sce.returnValues[o.attributes[ak]]

            }


        })
        }

        if(elementArray[id]==undefined){
            elementArray[id]={}
            elementArray[id]["acel:type"]=o[type]
            elementArray[id]["acel:"+ei+"vmap"] = {}
        }

        if( event["acel:"+ei+"cmap"]== undefined){
            event["acel:"+ei+"cmap"] = {}
        }
        if(event["acel:"+ei+"cmap"][id]==undefined){
            event["acel:"+ei+"cmap"][id] = {}
        }
      
        if(ei=="o"){
           
            event["acel:"+ei+"cmap"][id]["lifecycle"] = o.lifecycle
        }
        if(ei=="r"){
          
            
            if(elementArray[id]["acel:"+ei+"vmap"]==undefined){
           
                elementArray[id]["acel:type"]=o[type]
                elementArray[id]["acel:"+ei+"vmap"] = {}
            }


            elementArray[id]["acel:"+ei+"vmap"]["source"] = sce.returnValues[o.source]
      
            var t = ""
            
            if(o.targets[0]["target"]["artifact"] !== undefined){
                console.log('need to fetch target')
                
                
                if(o.targets[0]["target"]["composedId"][0]=="latest"){
                    let arr = artifs
                    Object.keys(arr).reverse().every(function(x) {
                        
                        if(artifs[x]["acel:type"]==o.targets[0]["target"]["artifact"]){
                            console.log('potential target id '+x+ " kitty "+sc["Artifacts"][o.targets[0]["target"]["artifact"]]["composedId"][1])
        
                            if(artifs[x]["acel:ovmap"][sc["Artifacts"][o.targets[0]["target"]["artifact"]]["composedId"][1]]==sce.returnValues[o.targets[0]["target"]["composedId"][1]]) {
                                    t = x
                                    console.log('le target cest !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! '+t)
                                    return false;
                                }
                        }
                        return true;
                     } )
                }
                else{
                let k = Object.keys(artifs)
                k.forEach(function(ak){
                    if(artifs[ak]["acel:type"]==o.targets[0]["target"]["artifact"]){
                        console.log('potential target id '+ak)
    
                        if(artifs[ak]["acel:ovmap"][sc["Artifacts"][o.targets[0]["target"]["artifact"]]["composedId"][0]]==sce.returnValues[o.targets[0]["target"]["composedId"][0]] && 
                            artifs[ak]["acel:ovmap"][sc["Artifacts"][o.targets[0]["target"]["artifact"]]["composedId"][1]]==sce.returnValues[o.targets[0]["target"]["composedId"][1]]) {
                                t = ak
                                console.log('le target cest **************** '+t)
                            }
                    }
                })

                }
                if(t==""){
                    t="notMatchCreatedobjUshould"
                    console.log("we got target "+ o.targets[0]["target"]["artifact"]+" equal "+t)
                }
            }
            else{
                t = sce.returnValues[o.targets[0].target]
                // console.log("we had main id "+ o.targets[0]["target"]+" so t is "+ sce.returnValues[o.targets[0]["target"]])

            }
            event["acel:"+ei+"cmap"][id]= {

                
                "target": t,
                "changeStatus": o.targets[0].changeStatus

            }
            elementArray[id]["acel:"+ei+"vmap"]["cardinality"] = sc[elementType][o[type]].cardinality
        }

})

return cptsc
};


//function findByComposeId