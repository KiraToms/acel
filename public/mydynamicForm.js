//accessthem structure like with code app
//use it to keep the elements but clear the forms after each close
//button update appear when list selected changes
var acelFile = {}
var acelArtifs = {}
var artifs = {}
var acelRels = {}
var acelEvents = []
var objectMappings = {}

function openForm() {
  document.getElementById("artifPopup").style.display = "block";
  initArtif();
}

function openRelForm() {
    document.getElementById("relPopupForm").style.display = "block";
    initRel();
  }

  function openEventForm() {
    document.getElementById("eventPopupForm").style.display = "block";
    initEvent();
  }
function closeForm() {
  document.getElementById("artifPopup").style.display = "none";
  document.getElementById("formArtif").reset();
}
function closeRelForm() {
    document.getElementById("relPopupForm").style.display = "none";
    document.getElementById("formRel").reset();
  }

  function closeEventForm() {
  document.getElementById("eventPopupForm").style.display = "none";
  document.getElementById("formEvent").reset();
  }



//create objects where you store artif classes and use them to populate the forms
//create sep forms one for sc event then button add mapping to add obj map and rel one


function newAttribute() {
  // document.getElementById("artifPopup").style.backgroundColor = "#999999;";
  document.getElementById("attribPopupForm").style.display = "block";

}

function closeAttribForm(){
document.getElementById("attribPopupForm").style.display = "none";
document.getElementById("formAttrib").reset();
}

function saveAttrib(){
//do i keep both alive or keep one alive then pass it to other
}

async function idChange(artif) {
  if (document.getElementById("objId").value == "Incremental") {
    console.log('the base')
    document.getElementById("divIdBase").style.display = "block";

  }
  if (document.getElementById("objId").value == "Extracted") {
    artif["id"] = "Extracted";
  }
}



async function initArtif(){
    var artif = {}
    artif["id"] = ""
    artif["attributes"] = {}




  const idField = document.getElementById("objId")
  await idField.addEventListener('change', () => {
    console.log("change")
     idChange(artif) 
  })
  const idBaseField = document.getElementById("idBase")
  await idBaseField.addEventListener('change', () => {
    artif["id"] = idBaseField.value
  })
    //maybeneedsawait
    const attribBtn = document.getElementById('newAttrib');
  await attribBtn.addEventListener('click', () => {
    newAttribute()

  

   const saveAttribBtn = document.getElementById('addAttrib')
   saveAttribBtn.addEventListener('click', () => {
   console.log('new artif init')
    let attribName = document.getElementById("attribName").value

    // let attribList = document.getElementById('attribs')
    // let option = document.createElement('option')
    // option.value = attribName
    // console.log("attrib name"+attribName)
    // attribList.appendChild(option)
    let attribType = document.getElementById("type").value
    let static = document.getElementById("static").value

    artif["attributes"][attribName] = {}
    artif["attributes"][attribName]["type"] = attribType
    if(static=="Static"){
    artif["attributes"][attribName]["static"] = true
    }
    else{
      artif["attributes"][attribName]["static"] = false
      }

    //addattrib to list displayed

    closeAttribForm()
    
   })
});

const artifBtn = document.getElementById('saveArtif')
await artifBtn.addEventListener('click', () => {
    objectType = document.getElementById("objectType").value
    //artif["id"]= document.getElementById("id").value
    let listArtifs = document.getElementById("artifacts")

    let option = document.createElement('option')
    //option.setAttribute("label",var)
    option.value = objectType
    listArtifs.appendChild(option)
    let artf = {}
    if(artif["id"]=="Extracted"){
      artf["id"] = {}
      artf["id"]["type"] = "String"
      artf["id"]["static"] = "true"
    }
    else{
      artf["id"] = {}
      artf["id"]["type"] = "String"
      artf["id"]["incrementalBase"] = artif["id"]
      artf["id"]["static"] = "true"
    }
    let atts = Object.keys(artif["attributes"])
    atts.forEach(att => {
      artf[att] = artif["attributes"][att]
    });

    acelArtifs[objectType] = artf
    console.log('the artifs are ')
    console.log(Object.keys(acelArtifs))
    closeForm()
    document.getElementById("formArtif").reset();
    document.getElementById("divIdBase").style.display = "none";
      
});



}


async function initRel(){
    let rel = {}
    
    //rel["id"] = ""

  
const artifBtn = document.getElementById('saveRel')
await artifBtn.addEventListener('click', () => {
    relationType = document.getElementById("relationType").value
    //artif["id"]= document.getElementById("id").value
    let listRels = document.getElementById("Relations")

    rel['source'] = document.getElementById('source')
    rel['target'] = document.getElementById('target')
    rel['cardinality'] = document.getElementById('cardinality')


    let option = document.createElement('option')
    //option.setAttribute("label",var)
    option.value = relationType
    listRels.appendChild(option)
    acelRels[relationType] = rel
    console.log('the rels are ')
    console.log(Object.keys(acelRels))
    closeRelForm()
    document.getElementById("formRel").reset();
      
});



}


async function initEvent(){
    let event = {}
  


    const paramBtn = document.getElementById('saveParam')
    await paramBtn.addEventListener('click', () => {
      
        let paramRaw = document.getElementById("param").value
        let params = paramRaw.split(';')
        event["parameters"] = params
        console.log("the parameters")
        console.log(params)
        document.getElementById("topic").style.display = "none";
        document.getElementById("mappingform").style.display = "block";
          
    });

    const objectToMapButton = document.getElementById('obj')

    

    await objectToMapButton.addEventListener('change', () => {
      let objectMapping = document.getElementById('objectMapping')




      let objectType = document.getElementById("obj").value
      console.log("object type")
      console.log(objectType)

      let artif = acelArtifs[objectType]
      let attributes = Object.keys(artif)
      
      let params = event["parameters"]
      let paramsList = document.createElement('datalist')
      paramsList.id = "params"
      params.forEach(p => {          
          let option = document.createElement('option')
          option.value = p
          paramsList.appendChild(option)
          
      });
    objectMapping.appendChild(paramsList)

      attributes.forEach(att => {
        console.log("increment base")
        console.log(artif[att]["incrementalBase"])
         if(! artif[att]["incrementalBase"] && att != ""){

         
          let label = document.createElement('label')
          label.setAttribute('for', att)
          label.innerHTML = att         
          let input = document.createElement('input')
          input.id = att
          input.type = 'text'
          input.setAttribute('list', 'params')

          objectMapping.appendChild(label)
          objectMapping.appendChild(input)

        }
       
          
      });

      
      let lifecycle = document.createElement('label')
          lifecycle.for = "lifecycle"
          lifecycle.innerHTML = "Lifecycle"       
          lifecycle.ariaPlaceholder = "The state of the object"       
      let inputlifecycle = document.createElement('input')
          inputlifecycle.id = "lifecycle"
          inputlifecycle.type = 'text'

          objectMapping.appendChild(lifecycle)
          objectMapping.appendChild(inputlifecycle)
      
      
      objectMapping.style.display = "block"
        
  });

    

  const mapBtn = document.getElementById('map')
  await mapBtn.addEventListener('click', () => { 
    console.log('event name after map click')
    console.log(document.getElementById("eventName").value)
    let scEvent = document.getElementById("scEventName").value
    let objectType = document.getElementById("obj").value
    let artif = acelArtifs[objectType]
    let attributes = Object.keys(artif)
    objectMappings[scEvent] = {}
    objectMappings[scEvent]["objects"] = []
    objectMappings[scEvent]["objects"]["objectType"] = objectType
    objectMappings[scEvent]["objects"]["attributes"] = {}
    
    if (artif["id"]["incrementalBase"]){
        objectMappings[scEvent]["objects"]["id"] = "base"
    }
    else{
      objectMappings[scEvent]["objects"]["id"] = document.getElementById("id").value
    }
    
  
    attributes.forEach(att => {
       if(att != "id" && att != ""){
       
        
      objectMappings[scEvent]["objects"]["attributes"][att] = document.getElementById(att).value
              
      }
     
        
    });
    objectMappings[scEvent]["objects"]["lifecycle"] = document.getElementById("lifecycle").value
//print the objects mapping
  
  })


const EventBtn = document.getElementById('saveEvent')
await EventBtn.addEventListener('click', () => {
    event['scEventName'] = document.getElementById("scEventName").value
    console.log()
    event["eventMappings"] = []
    const eventMapping = {}
    eventMapping['EventName'] = {}
    console.log('event name after saveevent click')
    console.log(document.getElementById("eventName").value)
    eventMapping['EventName']["value"] = document.getElementById("eventName").value
    eventMapping['EventName']["type"] = "String"
    eventMapping['EventName']["required"] = "true"
    eventMapping['id'] = {}
    eventMapping['id']["type"]="String",
    eventMapping['id']["incrementalBase"]="e"
    eventMapping['id']["required"]="true"
    eventMapping['timestamp']={}
    eventMapping['timestamp']["type"]="Timestamp"
    eventMapping['timestamp']["value"]="block.timestamp"
    eventMapping['timestamp']["required"]="true"
    eventMapping['attributes'] = {}

    console.log("object mappin of event")
    console.log(event['scEventName'])
    console.log(objectMappings[event['scEventName']])
    eventMapping['objects'] = objectMappings[event['scEventName']]
    

    
    event["eventMappings"].push(eventMapping)

    acelEvents.push(event)

    //acelRels[relationType] = rel
    console.log('the events are ')
    console.log(Object.keys(acelEvents))
    closeEventForm()
    document.getElementById("formEvent").reset();
      
});



}
//no form only js
//add rel id composite

async function send() {
  console.log("we are here")

  let sc = {}
  sc["address"] = document.getElementById("address").value
//   let address = sc["address"]
//  let url = "https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address="+address+"&apikey=ACKE2VTDEMAYR8V84RARCBCBCBWPQVJ44M"
//   const endpoint = new URL(url)
  
//   const response = await fetch(endpoint)
//   console.log(response)
//     // print the JSON response 
//   const json = await response.json()
//   let abi = json.result;
//   console.log(abi);
//   sc["abi"] = abi

  sc["abi"] = document.getElementById("abi").value
  sc["startBlock"] = document.getElementById("startBlock").value
  sc["endBlock"] = document.getElementById("endBlock").value

  sc["Artifacts"] = acelArtifs
  sc["Events"] = acelEvents
 
  acelFile["smartContracts"] = []
  acelFile["smartContracts"].push(sc)

  console.log(acelFile.toString())
       $.post("create",
             acelFile
          ,
          function (data, status) {
            if(status=='success'){
               $(location).attr('href', '');
            }
              else{
              console.log(status)
              }
          });      
}

//onchange of selected artif display attribs to be mapped and id if extracted