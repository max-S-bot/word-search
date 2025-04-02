// python -m http.server
const target = "to be or not to be";
const popSize = 200;
const mutationRate = .01;
const l = target.length;
const chars = ["a","b","c","d","e",
"f","g","h","i","j","k","l",
"m","n","o","p","q","r","s","t",
"u","v","w","x","y","z"," "];
const elemDelay = .005;
let bool = false;

window.addEventListener("load", run);

async function run() {
    let params = "";
    params += "Target: "+target+"<br>";
    params += "Population Size: "+popSize+"<br>";
    let mRate = Math.trunc(mutationRate*100*100000)/100000;
    params += "Mutation Rate: "+mRate+"%<br>";
    document.getElementById("parameters").innerHTML=params;
    
    let gens = 1;
    let population = originalPopulation();
    let popStr = "";
    document.getElementById("numGens").innerHTML=gens+" generation";
    window.scrollTo(0, document.body.scrollHeight);
    let curGen = document.createElement("p");
    curGen.id = "cur"+gens;
    document.getElementById("elems").appendChild(curGen);
    for (elem of population) {
        popStr+=elem+"<br>";
        document.getElementById("cur"+gens).innerHTML=popStr
        window.scrollTo(0, document.body.scrollHeight);
        await delay(elemDelay);
    }

    while (true) {
        if (bool) {break;}
        population = crossOver(matingPool(population));
        popStr = "";
        gens++;
        document.getElementById("numGens").innerHTML=gens+" generations";
        window.scrollTo(0, document.body.scrollHeight);
        let curGen = document.createElement("p");
        curGen.id = "cur"+gens;
        document.getElementById("elems").appendChild(curGen);
        for (elem of population) {
            popStr+=elem+"<br>";
            document.getElementById("cur"+gens).innerHTML=popStr
            window.scrollTo(0, document.body.scrollHeight);
            await delay(elemDelay);
        }
    }

    let str = '"'+target+'"'+" appeared in generation "+gens;
    document.getElementById("solution").innerHTML = str;
    window.scrollTo(0, document.body.scrollHeight);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function originalPopulation() {
    let population=[];
    for (let i=0; i<popSize; i++) {
        let newElem="";
        for (let j=0; j<l; j++) {
            let char = Math.floor(chars.length*Math.random());
            newElem+=chars[char];
        }
        population.push(newElem);
    }
    return population;
}

function fitness(popElem) {
    let f = 0;
    for (let i=0; i<l; i++) {
        if(popElem[i]==target[i]){f++;}
    }
    return f;
}

function matingPool(population) {
    let matesFitness = [];
    for (let i=0; i<popSize; i++) {
        matesFitness.push(fitness(population[i]));
    }
    return getWeights([population,matesFitness]);
}

function getWeights(matesArr) {
    let weightedPool = [];
    for (let i=0; i<popSize; i++) {
        for (let j=0; j<matesArr[1][i]; j++) {
            weightedPool.push(matesArr[0][i]);
        }
    }
    return weightedPool;
}

function select(weightedPool) {
    let p1 = Math.floor(Math.random()*weightedPool.length);
    let p2 = Math.floor(Math.random()*weightedPool.length);
    return [weightedPool[p1],weightedPool[p2]];
}

function crossOver(weightedPool) {
    let nextGen=[];
    for (let i=0; i<popSize; i++) {
        let parents = select(weightedPool);
        let child = "";
        for (let j=0; j<l; j++) {
            let parent = Math.floor(Math.random()*2);
            child += parents[parent][j];
        }
        nextGen.push(child);
    }
    return mutate(nextGen);
}

function mutate(gen) { 
    return gen.map((elem)=>{
        let r = Math.random();
        if(r<mutationRate) {
            let mutationLoc = Math.floor(Math.random()*l);
            let newChar = Math.floor(Math.random()*chars.length);
            let tArr = elem.split("");
            tArr[mutationLoc] = chars[newChar];
            let elemNew = tArr.join("");
            if (fitness(elemNew)==l) {bool=true;}
            return elemNew;
        } else {
            if (fitness(elem)==l) {bool=true;}
            return elem;
        }
    }
    );
}

