//accessthem structure like with code app
//use it to keep the elements but clear the forms after each close
//button update appear when list selected changes
var acelFile = {}
var acelArtifs = {}
var artifs = {}
var acelRels = {}
var acelEvents = {}

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
  if (document.getElementById("id").value == "Incremental") {
    console.log('the base')
    document.getElementById("divIdBase").style.display = "block";

  }
  if (document.getElementById("id").value == "Extracted") {
    artif["id"] = "Extracted";
  }
}



async function initArtif(){
    var artif = {}
    artif["id"] = ""
    artif["attributes"] = {}




  const idField = document.getElementById("id")
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
        //get id if extracted
        var paramList = document.getElementById('params')
        params.forEach(p => {
          console.log("param is ")
          console.log(p)           
            let option = document.createElement('option')
            option.value = p
            paramList.appendChild(option)
            console.log(paramList.value)
            
        });
          
    });
    

const artifBtn = document.getElementById('saveEvent')
await artifBtn.addEventListener('click', () => {
    event['scEventName'] = document.getElementById("scEventName").value
    event['EventName'] = document.getElementById("eventtName").value

    event["eventMappings"] = []



    acelRels[relationType] = rel
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