# ACEL TOOLKIT
ACEL toolkit is a tool assisting users in the extraction of artifact-centric data from blockchain and the discovery of process models from this data using existing process mining techniques. It provides a assitance in the creation of configuration files. Given a configuration file it generates the corresponding ACEL log file. Examples of configuration files (kittyConf.json and augurConf.json) and their corresponding ACEL log files (kittyACEL.jsonacel and augurACEL.jsonacel) are available in the root of this repository.

For running the ACEL toolkit locally, download the source code from this repository and follow the next steps to install the required dependencies and set up the application. 

## Installing dependencies
For installing the dependencies, run the command

```
npm install
```

## Running the app
For running the application, place yourself at the root and use one of the following commands
```
npm start
or
node serv.js
```
By default the application runs on http://localhost:3000/upload
You can navigate the tool using the menu on the left side of the dashbord.

# How to use ACEL Toolkit
For testing the fonctionalities of the tool follow the next instructions

## Configuration File

To test the configuration file assitant click on the **Configuration Template** option from the left menu and then proceed to fill the form. 
First provide the smart contract address, the ABI of the smart contract and the start and end blocks.

Second, click on **New Artifact** button to create a new artifact by providing its name and the type of its identifier *Incremental* or *Extracted*. Incremental identifiers require a base string (example for the artifact Kitty the base can be cat and the instances will be identified as cat1 cat2 cat3...etc), while extracted identifiers will be collected from the smart contract events. If the artifact has attributes you can add them by clicking on the 'Add Attribute' button to specify its name, type and nature (*static* or *dynamic*). Once you save the artifact, its name will appear in the Artifacts list right above the **New Artifact** button. 

Once all your artifacts are saved, you can create a new relation by clicking the **New Relation** button

Once all your relations are saved, you may create a new event and the corresponding mapping rules by click on **New Event**. 

## Extraction
To test the extraction module click on the **Extraction** option from the left menu. Then browse to select the configuration file (use your previously created configuration file or one of the examples files provided with the tool), click on the **Generate ACEL Log** button and wait as it may take a little while (you can follow the progress in the console).
