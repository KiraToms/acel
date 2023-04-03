
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



function newAttribute() {
 
  document.getElementById("attribPopupForm").style.display = "block";

}

function closeAttribForm(){
document.getElementById("attribPopupForm").style.display = "none";
document.getElementById("formAttrib").reset();
}



async function idChange(artif) {
  if (document.getElementById("objId").value == "Incremental") {
  
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
   
     idChange(artif) 
  })
  const idBaseField = document.getElementById("idBase")
  await idBaseField.addEventListener('change', () => {
    artif["id"] = idBaseField.value
  })
 
    const attribBtn = document.getElementById('newAttrib');
  await attribBtn.addEventListener('click', () => {
    newAttribute()

  

   const saveAttribBtn = document.getElementById('addAttrib')
   saveAttribBtn.addEventListener('click', () => {
  
    let attribName = document.getElementById("attribName").value

   
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

  

    closeAttribForm()
    
   })
});

const artifBtn = document.getElementById('saveArtif')
await artifBtn.addEventListener('click', () => {
    objectType = document.getElementById("objectType").value
   
    let listArtifs = document.getElementById("artifacts")

    let option = document.createElement('option')
   
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
    
    closeForm()
    document.getElementById("formArtif").reset();
    document.getElementById("divIdBase").style.display = "none";
      
});



}


async function initRel(){
    let rel = {}
    

  
const artifBtn = document.getElementById('saveRel')
await artifBtn.addEventListener('click', () => {
    relationType = document.getElementById("relationType").value
   
    let listRels = document.getElementById("Relations")

    rel['source'] = document.getElementById('source')
    rel['target'] = document.getElementById('target')
    rel['cardinality'] = document.getElementById('cardinality')


    let option = document.createElement('option')

    option.value = relationType
    listRels.appendChild(option)
    acelRels[relationType] = rel
   
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
       
        document.getElementById("topic").style.display = "none";
        document.getElementById("mappingform").style.display = "block";
          
    });

    const objectToMapButton = document.getElementById('obj')

    

    await objectToMapButton.addEventListener('change', () => {
      let objectMapping = document.getElementById('objectMapping')




      let objectType = document.getElementById("obj").value
     

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

  })


const EventBtn = document.getElementById('saveEvent')
await EventBtn.addEventListener('click', () => {
    event['scEventName'] = document.getElementById("scEventName").value
  
    event["eventMappings"] = []
    const eventMapping = {}
    eventMapping['EventName'] = {}
   
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

    
    eventMapping['objects'] = objectMappings[event['scEventName']]
    

    
    event["eventMappings"].push(eventMapping)

    acelEvents.push(event)

   
    
    closeEventForm()
    document.getElementById("formEvent").reset();
      
});



}


async function send() {
 

  let sc = {}
  sc["address"] = document.getElementById("address").value


  sc["abi"] = document.getElementById("abi").value
  sc["startBlock"] = document.getElementById("startBlock").value
  sc["endBlock"] = document.getElementById("endBlock").value

  sc["Artifacts"] = acelArtifs
  sc["Events"] = acelEvents
 
  acelFile["smartContracts"] = []
  acelFile["smartContracts"].push(sc)

 
       $.post("create",
             acelFile
          ,
          function (data, status) {
            if(status=='success'){
            
              const obj = JSON.stringify(data)
              var blob = new Blob([obj]);
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = "ConfigFile.json";
              link.click();
              
           
            }
              else{
              alert(status)
              }
          });      
}

async function getFile(filename) {
 

      let fileName = {"filename": filename}
       $.post("files",
             fileName
          ,
          function (data, status) {
            if(status=='success'){
            
              const obj = JSON.stringify(data)
              var blob = new Blob([obj]);
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = filename;
              link.click();
              
           
            }
              else{
              alert(status)
              }
          });      
}

async function sendFileData(myFile){

  console.log("trying to get file name acel extract")
  var file = myFile.files[0];  
  var filename = file.name;
  
  let acelFile= {"filename": filename, "file": file}
       $.ajax({
        url:this.extract, 
        type:"POST",
        processData: false,
        contentType: false,
        data:acelFile
             
          ,
          success:function (data, status) {
            
            
              const obj = JSON.stringify(data)
              var blob = new Blob([obj]);
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = filename;
              link.click();
          },
           
          
              error:function(){
                console.log("Error Uploading.", arguments)
              }
          
        })
        ; 
}

/*const form = document.getElementById('upload-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('extractConfigFile');
  const file = fileInput.files[0];
  var formData = new FormData();
  formData.append("file", file);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/upload/extract', true);
  xhr.setRequestHeader('Content-Disposition', `Attachment; filename="${file.name}"`);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const downloadUrl = window.URL.createObjectURL(xhr.response);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        alert('Error uploading file.');
      }
      document.querySelector('.loading').style.display = 'none';
    }
  };
  xhr.onprogress = function(e) {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      document.querySelector('.loading-text').textContent = `Please wait while your file is being processed... (${percent.toFixed(2)}%)`;
    }
  };
  document.querySelector('.loading').style.display = 'block';
  xhr.send(formData);
});*/



const form = document.getElementById('upload-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("extractConfigFile");
  const file = fileInput.files[0];
  var formData = new FormData();
  formData.append("file", file);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/upload/extract', true);
  xhr.setRequestHeader('Content-Disposition', `attachment; filename="${file.name}"`);
  xhr.responseType = 'blob';
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        //const downloadUrl = window.URL.createObjectURL(xhr.response);
        /*const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);*/
        //window.URL.revokeObjectURL(downloadUrl);
        const saveAs = prompt("File download complete. Enter filename to save as: ");
        if (saveAs !== null && saveAs !== "") {
          const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = saveAs+".jsonacel";
          downloadLink.click();
        }
      } else {
        alert('Error uploading file.');
      }
      document.querySelector('.loading').style.display = 'none';
    }
  };
  xhr.onprogress = function(e) {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      document.querySelector('.loading-text').textContent = `Please wait while your log is being generated... (${percent.toFixed(2)}%)`;
    }
  };
  document.querySelector('.loading').style.display = 'block';
  xhr.send(formData);
});


/*const uploadForm = document.getElementById('upload-form');
    const messageDiv = document.getElementById('message');
    const loadingDiv = document.getElementById('loading');

    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById("extractionConfigFile");
      const file = fileInput.files[0];
      const formData = new FormData();
      
      formData.append('file', file);
      
      loadingDiv.style.display = 'block';
    
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload/extract');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          loadingDiv.style.display = 'none';
          if (xhr.status === 200) {
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(xhr.response);
            downloadLink.download = xhr.getResponseHeader('Content-Disposition').split('filename=')[1];
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } else {
            messageDiv.innerText = `Error uploading file: ${xhr.statusText}`;
          }
        }
      };
    
      xhr.responseType = 'blob';
      xhr.send(formData);
    });*/
    
//const form = document.getElementById("extractionForm")


const handleSubmit = (event) => {
  event.preventDefault();
  const inputFile = document.getElementById("configFile")

const file = inputFile.files[0];  
const filename = file.name;

const payload = {
  "file" : file,
  "name" : filename
}
const data = new FormData();
data.append( "dataFrame", JSON.stringify( payload ) );
const customHeaders = {
  "Content-Type": "application/json",
}

  fetch("http://localhost:3000/upload/extract", {
        method: "POST",
        headers: customHeaders,
        body: data,
    }).then(response => {
      console.log("done")
    })
    .catch((error) => ("Something went wrong!", error));
}

//form.addEventListener("submit", handleSubmit);
/*$.post("extract", acelFile
           const data = response.json()
      const obj = JSON.stringify(data)
              var blob = new Blob([obj]);
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = filename.split('.', 1)[0]+".jsonacel";
              link.click();  
          ,
          function (data, status) {
            if(status=='success'){
            
              const obj = JSON.stringify(data)
              var blob = new Blob([obj]);
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = filename;
              link.click();
              
           
            }
              else{
              alert(status) 
              }
          }); 
}*/