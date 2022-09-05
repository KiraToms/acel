//accessthem structure like with code app
//use it to keep the elements but clear the forms after each close
//button update appear when list selected changes
let acelFile = {}
let acelArtifs = {}
let acelRels = {}
let acelEvents = {}
function openForm() {
  document.getElementById("popupForm").style.display = "block";
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
  document.getElementById("popupForm").style.display = "none";
}
function closeRelForm() {
    document.getElementById("relPopupForm").style.display = "none";
  }

  function closeEventForm() {
    document.getElementById("eventPopupForm").style.display = "none";
  }

function idChange(id) {
  if (document.getElementById("id").value == "Incremental") {
    document.getElementById("divIdBase").style.display = "block";
  }
}



function baseEntered(){
    document.getElementById("id").value=document.getElementById("idBase").value
 
}

function newAttribute() {
  document.getElementById("popupFormContainer").style.backgroundColor = "rgb(195, 185, 185)";
  document.getElementById("attribPopupForm").style.display = "block";

}

function closeAttribForm(){
document.getElementById("attribPopupForm").style.display = "none";
document.getElementById("popupFormContainer").style.backgroundColor = "#fff";
}

function saveAttrib(){
//do i keep both alive or keep one alive then pass it to other
}



async function initArtif(){
    let artif = {}
    artif["objectType"] = ""
    artif["id"] = ""

    //maybeneedsawait
    const attribBtn = document.getElementById('newAttrib');
await attribBtn.addEventListener('click', () => {
    newAttribute()
   const saveAttribBtn = document.getElementById('addAttrib')
   saveAttribBtn.addEventListener('click', () => {
   
    let attribName = document.getElementById("attribName").value

    let attribList = document.getElementById('attrib')
    let option = document.createElement('option')
    option.value = attribName
    attribList.appendChild(option)
    let attribType = document.getElementById("type").value

    artif[attribName] = attribType

    //addattrib to list displayed

    closeAttribForm()
    document.getElementById("formAttrib").reset();
   })
});

const artifBtn = document.getElementById('saveArtif')
await artifBtn.addEventListener('click', () => {
    objectType = document.getElementById("objectType").value
    artif["id"]= document.getElementById("id").value
    let listArtifs = document.getElementById("artifacts")

    let option = document.createElement('option')
    //option.setAttribute("label",var)
    option.value = objectType
    listArtifs.appendChild(option)
    acelArtifs[objectType] = artif
    console.log('the artifs are ')
    console.log(Object.keys(acelArtifs))
    closeForm()
    document.getElementById("formArtif").reset();
    document.getElementById("divIdBase").style.display = "none";
      
});



}


async function initRel(){
    let rel = {}
    rel["relationType"] = ""
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
        let paramList = getElementById('aram')
        params.forEach(p => {
            let option = document.createElement('option')
            option.value = p
            paramList.appendChild(option)
            
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