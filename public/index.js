function openConf(){

  closeDef()
  closeExt()
  closePmin()
  closeFiles()
  conf = document.getElementById('conf')
  conf.style.display = "block";
}

function openExt(){

  closeDef()
  closeConf()
  closePmin()
  closeFiles()
  ext = document.getElementById('ext')
  ext.style.display = "block";
}

function openFiles(){

  closeDef()
  closeConf()
  closePmin()
  closeExt()
  ext = document.getElementById('files')
  ext.style.display = "block";
}

function openPmin(){

  closeDef()
  closeConf()
  closeExt()
  closeFiles()
  pmin = document.getElementById('pmin')
  pmin.style.display = "block";
}

function closeConf(){
  conf = document.getElementById('conf')
  conf.style.display = "none";
}
function closeFiles(){

  closeDef()
  ext = document.getElementById('files')
  ext.style.display = "none";
}
function closeExt(){

  closeDef()
  ext = document.getElementById('ext')
  ext.style.display = "none";
}

function closePmin(){

  closeDef()
  pmin = document.getElementById('pmin')
  pmin.style.display = "none";
}

function openDef(){
  closeConf()
  closeExt()
  closePmin()
  def = document.getElementById('def')
  def.style.display = "block";
}

function closeDef(){

  def = document.getElementById('def')
  def.style.display = "none";
}