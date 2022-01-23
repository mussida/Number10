const ulList = document.querySelector(".list-group");
var vendite = [];

class Beer {
    constructor(name, price){
        this.name = name;
        this.price = price;
        this.state = 0;     // Se in stato 0 -> verde se in stato 1 -> rosso
        this.vendite = 0;   // Vendite della sessione precedente
    }
}

var ichnusa = new Beer("Ichnusa", 5.00);
var waldensteiner = new Beer("Waldensteiner", 5.50);
var lagunitas = new Beer("Lagunitas", 6.00);
var beers = [ichnusa, waldensteiner, lagunitas];

setInterval(function(){
    
    var prevoiusSession = JSON.parse(JSON.stringify( beers ));
    
    // Lettura del file condiviso con l'applicazione che inserisce il numero di vendite
    readVendite();
    console.log(beers);
    // Ricalcolo dei prezzi
    getNewPrices();
    console.log(beers);

    // Verifica se il prezzo è salito o sceso rispetto alla sessione precedente
    for(let i = 0; i < beers.length; i++){

        if(prevoiusSession[i].price < beers[i].price) {
            beers[i].state = 1; // rosso
        } else {
            beers[i].state = 0; //verde
        }
    }

    // Display del risultato
    display();

}, 3000);


function display() {
    
    let newList = "";
    beers.sort((a,b) => (b.price - a.price));
    for(let i = 0; i < beers.length; i++){
        
        if(beers[i].state === 0) {
            //red
            newList+=`
            <li class="list-group-item d-flex justify-content-between align-items-center">
            ${beers[i].name}
            <span id="price" class="badge bg-primary rounded-pill">${beers[i].price}</span>
            <span id="tmp" class="badge bg-danger rounded-pill"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
            <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
            </svg></span>
            </li>
            `;
        } else {
            newList+=`
            <li class="list-group-item d-flex justify-content-between align-items-center">
            ${beers[i].name}
            <span id="price" class="badge bg-primary rounded-pill">${beers[i].price}</span>
            <span id="tmp" class="badge bg-success rounded-pill"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up" viewBox="0 0 16 16">
                <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>
            </svg></span>
            </li>
            `;
        }
    }

    ulList.innerHTML = newList;
}

function getNewPrices() {
    
    for(let i = 0; i < beers.length; i++) {
        let numVendite = beers[i].vendite; 
        for(let j = 0; j < numVendite; j++) {
           beers[i].price += 0.50;
           for(let z = 0; z < beers.length; z++) {
               if(z !== i) {
                   beers[z].price -= 0.25;
               }
           }
       }
    }
}

function readVendite() {
    fetch('data.txt')
    .then(response => response.text()) 
    .then(textString => {
        vendite = Array.from(String(textString));
        // Assegnamento delle vendite lette dal file
        for(let i = 0; i < beers.length; i++){
            beers[i].vendite = parseInt(vendite[i]);
        }
    });
}


