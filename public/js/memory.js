
/**************************************************
 * ProgressBar
 * Show elapsed time to the user
 **************************************************/

class ProgressBar {

    constructor(){
        this._timerId = null;
        this._startTime = null;    
        this._duration = 0;
    }

    getDuration() {
        return this._duration;
    }

    move() {
        let elem = $("#myBar");
        let width = 0;
        this._startTime = new Date();
        this._timerId = setInterval( () => {
            if (width >= 100) {                
                clearInterval(this._timerId);
                alert("Vous avez perduuuu !!!!!");
                window.location.reload();
            } else {
                width++;
                elem.css("width", width + '%');
            }
        }, 1000);        
    }

    stop() {
        if (this._timerId){
            clearInterval(this._timerId);
            this._timerId = null;
            let endTime = new Date();
            this._duration = (endTime.getTime() - this._startTime.getTime());
        }
    }
}

/***************************************************
 * RandomHelper
 * Helps to generate random value and 
 * to choose a memory card randomly
 ***************************************************/

class RandomHelper {

    constructor() {
        this._spriteImagesCount = 18;
        this._alreadyUsedCards = [];
    }

    /**
     * Choose a memory card randomly
     */
    chooseRandomCard() {
        let randomCard = this.chooseRandomValue(this._spriteImagesCount);
        while ($.inArray(randomCard, this._alreadyUsedCards) !== -1) {
            randomCard = this.chooseRandomValue(this._spriteImagesCount);
        }
        this._alreadyUsedCards.push(randomCard);
        return randomCard;
    }

    /**
     * Choose a random value between 1 and the given parameter
     * @param {Number} max: the random value must be less or equal than max 
     */
    chooseRandomValue(max) {
        return Math.floor((Math.random() * max) + 1);
    }

}

/***************************************************
 * PersistHelper helps to persit data on server side
 * (Ajax request)
 ***************************************************/
class PersistHelper {

    /**
     * Display persisted best results
     */
    getBestResults() {
        $.getJSON("memory/all")       
        .done( (data) => {
            let results = "";
            $.each( data.memories, ( i, item ) => { 
              results  = results + "\n" + item.gamer + " : " + this.getSeconds(item.duration) + ' sec';
            });
            alert(results);
          })
        .fail( (err) => {
            console.log(err);
        });        
    }

    getSeconds(time) {
        let date = new Date(time);
        return date.getMinutes() +":"+date.getSeconds();
    }

    /**
     * Persist results on server side
     * @param {String} name: the gamer name
     * @param {Number} time: the game duration 
     */
    saveCurrentResult(name, time) {        
        $.getJSON("memory/new/" + name + "/" + time)
        .done( (data) => {
            console.log(data.responseText);
        }
        )
        .fail( (err) => {
            console.log(err);
        });
    }

}

/***************************************************
 * Memory Card
 ***************************************************/
class Card {
    /**
     * Construct Card with id and number.
     * Off means that the card can't be no more selected.
     * @param {Number} id: unique id to link this instance with a div in the HTML page) 
     * @param {Number} number: index of the choosen image in sprite
     */
    constructor(id, number) {
        this._id = id;
        this._idDiv = "#d" + id;
        this._number = number;
        this._off = false;
    }

    /**
     * Getters
     */
    getNumber() {
        return this._number;
    }

    getIdDiv() {
        return this._idDiv;
    }

    /**
     * Setters
     */
    setNumber(number) {
        this._number = number;
    }

    /**
     * The user has selected this card.
     * Show him its corresponding image.
     */
    show() {        
        let url = 'url("images/cards.png") 0px -' + (100 * this._number) + 'px';
        $(this._idDiv).css("background", url);
    }

    /**
     * The image of this card has to be hidden (start case)
     */
    hide() {        
        $(this._idDiv).css("background", "black");
    }

    /**
     * The image of this card has to be hidden (wrong whoice case).
     * Let the gamer the time to see the image, before hiding it.
     */
    hideLater() {
        let on = true;
        let intervalId = setInterval(() => {
            if (on) {
                on = false;
            } else {
                this.hide();
                clearInterval(intervalId);
            }
        }, 500);
    }

    /**
     * The action associted to the click event on this card
     */
    actionOnClick() {
        this.show();        
    }

    /**
     * The image can't be no more selected
     */
    disable() {         
        this._off = true;
        $(this._idDiv).off();
    }
}

/***************************************************
 * Memory Grid (contains Memory Cards)
 ***************************************************/
class Grid {

    /**
     * Construct a grid containing 14 twins of memory cards
     */
    constructor() {
        this._twinCardCount = 14;
        this._twinCardFoundCount = 0;
        this._cards = [];
        this._first = -1;
        this._second = -1;
        this._gameover = false;
        this._gamer = null;
        this._progressBar = new ProgressBar();
        this._randomHelper = new RandomHelper();
        this._persistHelper = new PersistHelper();
    }

    /**
     * Create cards in an ordered way
     */ 
    initialize() {

        let nbCards = this._twinCardCount * 2;
        let randomCard;
        for (let i = 0; i < nbCards; i++) {
            randomCard = this._randomHelper.chooseRandomCard();

            // Push first twin
            this.addCard(i, randomCard);

            // Push second twin (following id, same number)
            this.addCard(++i, randomCard);
        }

    }

    addCard(id, number) {
        let card = new Card(id, number);
        this._cards.push(card);
    }

    /**
     * Shuffle created cards 
     *  @param {Number} timesCount: exchange two cards with one another, timesCount times
     */ 
    shuffle(timesCount) {
        let max = this._twinCardCount * 2 - 1;
        let firstRandomIndex, secondRandomIndex;
        for (let i = 0; i < timesCount; i++) {
            firstRandomIndex = this._randomHelper.chooseRandomValue(max);
            secondRandomIndex = this._randomHelper.chooseRandomValue(max);
            this.exchangeCards(firstRandomIndex, secondRandomIndex);
        }
    }

    exchangeCards(first, second) {
        let temp = this._cards[first].getNumber();
        this._cards[first].setNumber(this._cards[second].getNumber());
        this._cards[second].setNumber(temp);
    }
    
    /**
     * Display hidden cards.
     * Associate action on click event.
     */
    display() {
        $.each(this._cards, function (i, card) {
            card.hide();
            $(card.getIdDiv()).click(() => {
                card.actionOnClick();
            });
        });
    }

    /**
     * The action associted to the click event on the grid
     * @param {*} e: the bubbling event to get the targeted image
     */
    actionOnClick(e) {
        let idDiv = $(e.target).attr("id");
        let indexCard = Number(idDiv.substring(1));

        if(this._cards[indexCard].off) {
            return;
        }

        if (this._first == -1) {
            // First twin card has been choosen
            this._first = indexCard;
        }
        else if (this._second == -1) {
            // Second twin card has been choosen
            this._second = indexCard;
            // Two cards have been selected, check if same number
            if (this._cards[this._first].getNumber() == this._cards[this._second].getNumber()) {
                this._cards[this._first].disable();
                this._cards[this._second].disable();                
                this._twinCardFoundCount++;                
                if (this._twinCardFoundCount == this._twinCardCount) {
                    this._gameover = true;
                    alert("Vous avez gagnééééé !!!!");                    
                    this._progressBar.stop();
                    this._persistHelper.saveCurrentResult(this._gamer, this._progressBar.getDuration());
                }
            }
            else {                
                this._cards[this._second].hideLater();
                this._cards[this._first].hideLater();
            }
            // Prepare next try
            if (!this._gameover) {
                this._first = -1;
                this._second = -1;
            }
        }
    }

    run() {
        this.initialize();
        this.shuffle(50);
        this.display();
        this._persistHelper.getBestResults();
        this._gamer = prompt("Your name?");
        this._progressBar.move();
    }
    
}

/***************************************************
 * Main: run the Game
 ***************************************************/

let grid = new Grid();

$("#grid").click((e) => {
    grid.actionOnClick(e);
});

grid.run();


