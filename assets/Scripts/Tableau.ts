import { _decorator, Component, Node, Prefab, instantiate, tween, Vec3, Animation, Label, director, assetManager, SpriteFrame, Texture2D, ImageAsset, Sprite } from 'cc';
import { ArrayUtil } from './ArrayUtil';
import { Card } from './Card';
import { Location } from './Location';
import { Suit } from './Suit';
import { Rank } from './Rank';
import { AssetLoader } from './AssetLoader';
import { Stock } from './Stock';
import { Deck } from './Deck';
import { Direction } from './Direction';
const { ccclass, property } = _decorator;

@ccclass('Tableau')
export class Tableau extends Component {
    static instance: Tableau;
    
    firstTableau: Card[] = [];
    secondTableau: Card[] = [];
    thirdTableau: Card[] = [];
    fourthTableau: Card[] = [];
    fifthTableau: Card[] = [];
    sixthTableau: Card[] = [];
    seventhTableau: Card[] = [];

    firstFoundation: Card[] = [];
    secondFoundation: Card[] = [];
    thirdFoundation: Card[] = [];
    fourthFoundation: Card[] = [];

    stockPile: Card[] = [];
    wastePile: Card[] = [];

    tableauxArray = [this.firstTableau, this.secondTableau, this.thirdTableau, this.fourthTableau, this.fifthTableau, this.sixthTableau, this.seventhTableau];
    tableauxLocationsArray = [Location.TableauOne, Location.TableauTwo, Location.TableauThree, Location.TableauFour, Location.TableauFive, Location.TableauSix, Location.TableauSeven];

    @property({ type: Node }) firstTableauNode: Node;
    @property({ type: Node }) secondTableauNode: Node;
    @property({ type: Node }) thirdTableauNode: Node;
    @property({ type: Node }) fourthTableaNode: Node;
    @property({ type: Node }) fifthTableauNode: Node;
    @property({ type: Node }) sixthTableauNode: Node;
    @property({ type: Node }) seventhTableauNode: Node;

    @property({ type: Node }) firstFoundationNode: Node;
    @property({ type: Node }) secondFoundationNode: Node;
    @property({ type: Node }) thirdFoundationNode: Node;
    @property({ type: Node }) fourthFoundationNode: Node;

    @property({ type: Node }) fetchAssetsButton: Node;

    @property({ type: Label }) resetLabel: Label;
    @property({ type: Label }) fetchLabel: Label;

    _cards: Card[] = [];
    _location: Location;
    private readonly _offsetY = 45;
    private readonly _offsetZ = 15;

    private secondDeck: Card[];

    
    onLoad(){
        Tableau.instance = this;
        (window as any).stackingScore = 0;
        (window as any).isStackedOnEmptyTableaux;
    }

    start() {
        (window as any).isStackedOnEmptyTableaux = false;

        this.initTableaux();
        
        this.listenToEmptyTableauClick();


        if((window as any).gameLanguage === "Japanese") {
            this.resetLabel.string = "リセット";
            this.fetchLabel.string = "アセットを取得する";
        } else {
            this.resetLabel.string = "RESET";
            this.fetchLabel.string = "Fetch Assets";
        }
        
        

        this.fetchAssetsButton.on(Node.EventType.TOUCH_START, function() {
            if((window as any).assets === "Local") {
                (window as any).assets = "Remote";
                console.log("[Assets] Changed Assets type from: Local, to: Remote");
            } else if((window as any).assets === "Remote") {
                (window as any).assets = "Local";
                console.log("[Assets] Changed Assets type from: Remote, to: Local");
            }

            for(let i = 0; i < this.secondDeck.length; i++) {
                if(this.secondDeck[i]._direction === Direction.Up) {
                    this.secondDeck[i].flip();
                }
            }
        }, this);
    }



    /**
     * Stacks Cards on Empty Tableaux or Foundations.
     * @param cardBeingMoved The Card that's being stacked on empty an Tableau or Foundation pile.
     * @param nodeToStackOn Tableau or Foundation Node that the Card's being stacked on.
     * @param firstArray The Card array that the Card being moved is currently in.
     * @param secondArray The Card array that the Card being moved will be in after being stacked.
     * @param location New location Card will be in.
     */
    stackOnEmptyPile(cardBeingMoved: Card, nodeToStackOn: Node, firstArray: Card[], secondArray: Card[], location: Location) {
        (window as any).isStackedOnEmptyTableaux = true;
        const movedCardIndex: number = firstArray.indexOf(cardBeingMoved);

        for(let i = movedCardIndex; i < firstArray.length; i++) {
            firstArray[i].changeCardLocation(location);
            secondArray.push(firstArray[i]);
        }
        firstArray.splice(movedCardIndex, firstArray.length - 1);
        Tableau.moveCard(cardBeingMoved.node, nodeToStackOn);
        firstArray[firstArray.length - 1].flip();
    }

    /**
     * Stacks Cards on Empty Foundations.
     * @param cardBeingMoved The Card that's being stacked on empty an Tableau or Foundation pile.
     * @param nodeToStackOn Tableau or Foundation Node that the Card's being stacked on.
     * @param firstArray The Card array that the Card being moved is currently in.
     * @param secondArray The Card array that the Card being moved will be in after being stacked.
     * @param location New location Card will be in.
     */
     stackOnEmptyFoundation(cardBeingMoved: Card, nodeToStackOn: Node, firstArray: Card[], secondArray: Card[], location: Location) {
        const movedCardIndex: number = firstArray.indexOf(cardBeingMoved);
        firstArray[movedCardIndex].changeCardLocation(location);
        secondArray.push(firstArray[movedCardIndex]);
        firstArray.splice(movedCardIndex);
        Tableau.moveCardToFoundation(cardBeingMoved.node, nodeToStackOn);
        if(firstArray.length > 0) {
            firstArray[firstArray.length - 1].flip();
        }
        console.log(firstArray.length);
        console.log(`Location is: ${(window as any).firstCardData.location}`);

        if(this.firstFoundation.length === 13 && this.secondFoundation.length === 13 && this.thirdFoundation.length === 13 && this.fourthFoundation.length === 13) {
            director.loadScene("Klondike-winning");
            console.log("[Scene] Win scene is loaded.")
        }

        console.log(`Foundation length is: ${secondArray.length}`)
        if(secondArray.length > 0) {
            secondArray[secondArray.length - 1].node.active = true;
            if(secondArray.length > 1) {
                secondArray[secondArray.length - 2].node.active = false;
                secondArray[0].node.active = false;
            }
        }
        this.listenToEmptyTableauClick();
    }


    /**
     * Listens for clicks on empty Tableaux.
     */
    listenToEmptyTableauClick() {
        
        if(this.firstTableau.length === 0) {
            this.firstTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.firstTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    console.log((window as any).clickCount);
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";

                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.firstTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.firstTableau,
                                        Location.TableauOne);
                    
                    event.propagationStopped = true;
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.firstTableauNode.off(Node.EventType.TOUCH_START);
            console.log("First tableau Inout event off");
        }
        

        if(this.secondTableau.length === 0) {
            this.secondTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.secondTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";

                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.secondTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.secondTableau,
                                        Location.TableauTwo);
                    
                    event.propagationStopped = true;
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.secondTableauNode.off(Node.EventType.TOUCH_START);
            console.log("Second tableau Inpout event off");
        }
        
        if(this.thirdTableau.length === 0) {
            this.thirdTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.thirdTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";
    
                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.thirdTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.thirdTableau,
                                        Location.TableauThree);
                    
                    event.propagationStopped = true;
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.thirdTableauNode.off(Node.EventType.TOUCH_START);
            console.log("Third tableau Input Event off");
        }
        
        
        if(this.fourthTableau.length === 0) {
            this.fourthTableaNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.fourthTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";
    
                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.fourthTableaNode,
                                        (window as any).firstCardData.cardArray,
                                        this.fourthTableau,
                                        Location.TableauFour);
                    
                    event.propagationStopped = true;
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.fourthTableaNode.off(Node.EventType.TOUCH_START);
        }
        

        if(this.fifthTableau.length === 0) {
            this.fifthTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.fifthTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";
    
                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.fifthTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.fifthTableau,
                                        Location.TableauFive);
                    
                    event.propagationStopped = true;
                    this.fifthTableauNode.off(Node.EventType.TOUCH_START);
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.fifthTableauNode.off(Node.EventType.TOUCH_START);
        }
        

        if(this.sixthTableau.length === 0) {
            this.sixthTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.sixthTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";
    
                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.sixthTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.sixthTableau,
                                        Location.TableauSix);
                    
                    event.propagationStopped = true;
                    this.sixthTableauNode.off(Node.EventType.TOUCH_START);
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.sixthTableauNode.off(Node.EventType.TOUCH_START);
        }


        if(this.seventhTableau.length === 0) {
            this.seventhTableauNode.on(Node.EventType.TOUCH_START, function(event) {
                if(this.seventhTableau.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "KING") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Tableau";
    
                    this.stackOnEmptyPile((window as any).firstSlot,
                                        this.seventhTableauNode,
                                        (window as any).firstCardData.cardArray,
                                        this.seventhTableau,
                                        Location.TableauSeven);
                    
                    event.propagationStopped = true;
                    this.seventhTableauNode.off(Node.EventType.TOUCH_START);
                    event.propagationImmediateStopped = true
                }
            }, this);
        } else {
            this.seventhTableauNode.off(Node.EventType.TOUCH_START);
        }
        


        if(this.firstFoundation.length === 0) {
            this.firstFoundationNode.on(Node.EventType.TOUCH_START, function(event) {
                console.log("[Foundation] CLicked on Foundation: 1");
                console.log(`Foundation 1 length: ${this.firstFoundation.length}`)
                if(this.firstFoundation.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "ACE") {
                    (window as any).clickCount++;
                    
                    (window as any).clickLocation = "Foundation";
    
                    this.stackOnEmptyFoundation((window as any).firstSlot,
                                        this.firstFoundationNode,
                                        (window as any).firstCardData.cardArray,
                                        this.firstFoundation,
                                        Location.FoundationOne);
                    console.log(`Card's location is: ${(window as any).firstSlot.location}`);
                    console.log(`Card's array is: ${(window as any).firstCardData.cardArray}`)
                    
                    event.propagationStopped = true;
                }
            }, this);
        } else {
            this.firstFoundationNode.off(Node.EventType.TOUCH_START);
        }       
        
        
        
        if(this.secondFoundation.length === 0) {
            this.secondFoundationNode.on(Node.EventType.TOUCH_START, function(event) {
                console.log("[Foundation] Clicked on Foundation: 2");
                console.log(`Foundation 2 length: ${this.secondFoundation.length}`)
                if(this.secondFoundation.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "ACE") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Foundation";
    
    
                    this.stackOnEmptyFoundation((window as any).firstSlot,
                                        this.secondFoundationNode,
                                        (window as any).firstCardData.cardArray,
                                        this.secondFoundation,
                                        Location.FoundationTwo);
                    
                    event.propagationStopped = true;
                    
                }
            }, this);
        } else {
            this.secondFoundationNode.off(Node.EventType.TOUCH_START);
        }
        
        if(this.thirdFoundation.length === 0) {
            this.thirdFoundationNode.on(Node.EventType.TOUCH_START, function(event) {
                console.log("[Foundation] Clicked on Foundation: 3");
                console.log(`Foundation 3 length: ${this.thirdFoundation.length}`)
                if(this.thirdFoundation.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "ACE") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Foundation";
    
                    
                    this.stackOnEmptyFoundation((window as any).firstSlot,
                                        this.thirdFoundationNode,
                                        (window as any).firstCardData.cardArray,
                                        this.thirdFoundation,
                                        Location.FoundationThree);
                    
                    event.propagationStopped = true;
                    
                }
            }, this);
        } else {
            this.thirdFoundationNode.off(Node.EventType.TOUCH_START);
        }
        
        if(this.fourthFoundation.length === 0) {
            this.fourthFoundationNode.on(Node.EventType.TOUCH_START, function(event) {
                console.log("[Foundation] Clicked on Foundation: 4");
                console.log(`Foundation 4 length: ${this.fourthFoundation.length}`)
                if(this.fourthFoundation.length === 0 && (window as any).clickCount === 1 && (window as any).firstCardData.rank === "ACE") {
                    (window as any).clickCount++;
                    (window as any).clickLocation = "Foundation";
    
    
                    this.stackOnEmptyFoundation((window as any).firstSlot,
                                        this.fourthFoundationNode,
                                        (window as any).firstCardData.cardArray,
                                        this.fourthFoundation,
                                        Location.FoundationFour);
                    
                    event.propagationStopped = true;
                    
                }
            }, this);
        } else {
            this.fourthFoundationNode.off(Node.EventType.TOUCH_START);
        }
        
    }


    /**
     * Flips Last Card from tableaux
     * @param location Tableau array that the card being moved is in
     */
    flipLastCard(firstCardArray: Card[], movedCardIndex: number) {
        firstCardArray[movedCardIndex - 1].flip();
    }


    /**
     * Builds the unshuffled deck of Cards.
     */
    build(): Card[] {
        const deck = [];
        const suits = Object.keys(Suit).filter((v) => isNaN(Number(v)));
        const ranks = Object.keys(Rank).filter((v) => isNaN(Number(v)));

        console.log("[Deck] Starting deck build.");
        for(let i = 0; i < suits.length; i++) {
            for(let j = 1; j < ranks.length + 1; j++) {
                let prefab;
                try {
                    prefab = instantiate(AssetLoader.instance.cardPrefab);
                }
                catch (e) {
                    console.error("[Deck] Failed to instantiate card prefab. " + e);
                }

                let card = prefab.getComponent(Card);
                card.init(Suit[i] as any as Suit, Rank[j] as any as Rank);

                // This is the only place outside of Game that we should be altering any card arrays.
                deck.push(card);
            }
        }
        
        console.log("[Deck] Finished build.");
        return deck;
    }

    buildDeck() {
        const deck = this.build();
        this.secondDeck = [...deck];
        ArrayUtil.shuffle(deck);
        return deck
    }


    /**
   * Initializes the tableau at the beginning of the round.
   * @param cards Pile of hidden cards that this tableau will begin the game with.
   */
    init(cards: Card[]): void {
        // for(let i = 0; i < 7; i++) {
        //     for(let j = 0; j < this.tableauxArray[i].length; j++) {
        //         cards[0].changeCardLocation(this.tableauxLocationsArray[i]);
        //         this.tableauxArray[i].push(cards[0]);
        //         cards.splice(0, 1);
        //     }
        //     console.log(`[Tableau] Tableau ${i + 1} length is: ${this.tableauxArray[i].length}`);
        //     this.tableauxArray[i][this.tableauxArray[i].length - 1].flip();
        // }

        for(let i = 0; i < 1; i++) {
            cards[0].changeCardLocation(Location.TableauOne);
            this.firstTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] First Tableau length: ${this.firstTableau.length}`);
        this.firstTableau[this.firstTableau.length - 1].flip();

        for(let i = 0; i < 2; i++) {
            cards[0].changeCardLocation(Location.TableauTwo);
            this.secondTableau.push(cards[0]);
            cards.splice(0, 1); 
        }
        console.log(`[Tableau] Second Tableau length: ${this.secondTableau.length}`);
        this.secondTableau[this.secondTableau.length - 1].flip();

        for(let i = 0; i < 3; i++) {
            cards[0].changeCardLocation(Location.TableauThree);
            this.thirdTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] third Tableau length: ${this.thirdTableau.length}`);
        this.thirdTableau[this.thirdTableau.length - 1].flip();

        for(let i = 0; i < 4; i++) {
            cards[0].changeCardLocation(Location.TableauFour);
            this.fourthTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] Fourth Tableau length: ${this.fourthTableau.length}`);
        this.fourthTableau[this.fourthTableau.length - 1].flip();

        for(let i = 0; i < 5; i++) {
            cards[0].changeCardLocation(Location.TableauFive);
            this.fifthTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] Fifth Tableau length: ${this.fifthTableau.length}`);
        this.fifthTableau[this.fifthTableau.length - 1].flip();

        for(let i = 0; i < 6; i++) {
            cards[0].changeCardLocation(Location.TableauSix);
            this.sixthTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] sixth Tableau length: ${this.sixthTableau.length}`);
        this.sixthTableau[this.sixthTableau.length - 1].flip();

        for(let i = 0; i < 7; i++) {
            cards[0].changeCardLocation(Location.TableauSeven);
            this.seventhTableau.push(cards[0]);
            cards.splice(0, 1);
        }
        console.log(`[Tableau] seventh Tableau length: ${this.seventhTableau.length}`);
        this.seventhTableau[this.seventhTableau.length - 1].flip();

        Tableau.instance.stockPile = [...cards];
        for(let i = 0; i < Tableau.instance.stockPile.length; i++) {
            Tableau.instance.stockPile[i].flip();
            Tableau.instance.stockPile[i].changeCardLocation(Location.Stock);
        }
        cards.splice(0, cards.length);

        if(cards.length !== 0) {
            console.error(`[Tableau] Initial card array should be empty`);
        }

        this.stackPileOnDeal();
    }

    

    /**
     * Changes the array that the card being moved is in.
     * @param currentlocation Location the card being moved was initially in.
     * @param destination Location the card being moved will be in.
     * @param movedCard Card that's being moved.
     * @param stackedOnCard Card that the moved card will be stacked on.
     */
    changeCardArray(currentlocation: string, destination: string, movedCard: Card, stackedOnCard: Card, _offsetY): void {
        let firstArray: Card[];
        let secondArray: Card[];

        let firstLocation: Location;
        let secondLocation: Location;

        switch(currentlocation) {
            case "Stock":
                firstArray = Tableau.instance.wastePile;
                firstLocation = Location.Stock;
                break;
            case "TableauOne":
                firstArray = this.firstTableau;
                firstLocation = Location.TableauOne;
                break;
            case "TableauTwo":
                firstArray = this.secondTableau;
                firstLocation = Location.TableauTwo;
                break;
            case "TableauThree":
                firstArray = this.thirdTableau;
                firstLocation = Location.TableauThree;
                break;
            case "TableauFour":
                firstArray = this.fourthTableau;
                firstLocation = Location.TableauFour;
                break;
            case "TableauFive":
                firstArray = this.fifthTableau;
                firstLocation = Location.TableauFive;
                break;
            case "TableauSix":
                firstArray = this.sixthTableau;
                firstLocation = Location.TableauSix;
                break;
            case "TableauSeven":
                firstArray = this.seventhTableau;
                firstLocation = Location.TableauSeven;
                break;
            case "FoundationOne":
                firstArray =  this.firstFoundation;
                firstLocation = Location.FoundationOne;
                break;
            case "FoundationTwo":
                firstArray = this.secondFoundation;
                firstLocation = Location.FoundationTwo;
                break;
            case "FoundationThree":
                firstArray = this.thirdFoundation;
                firstLocation = Location.FoundationThree;
                break;
            case "FoundationFour":
                firstArray = this.fourthFoundation;
                firstLocation = Location.FoundationFour;
                break;
        }

        switch(destination) {
            case "Stock":
                secondArray = Tableau.instance.wastePile;
                secondLocation = Location.Stock;
                break;
            case "TableauOne":
                secondArray= this.firstTableau;
                secondLocation = Location.TableauOne;
                break;
            case "TableauTwo":
                secondArray= this.secondTableau;
                secondLocation = Location.TableauTwo;
                break;
            case "TableauThree":
                secondArray= this.thirdTableau;
                secondLocation = Location.TableauThree;
                break;
            case "TableauFour":
                secondArray= this.fourthTableau;
                secondLocation = Location.TableauFour;
                break;
            case "TableauFive":
                secondArray = this.fifthTableau;
                secondLocation = Location.TableauFive;
                break;
            case "TableauSix":
                secondArray= this.sixthTableau;
                secondLocation = Location.TableauSix;
                break;
            case "TableauSeven":
                secondArray= this.seventhTableau;
                secondLocation = Location.TableauSeven;
                break;
            case "FoundationOne":
                secondArray =  this.firstFoundation;
                secondLocation = Location.FoundationOne;
                break;
            case "FoundationTwo":
                secondArray = this.secondFoundation;
                secondLocation = Location.FoundationTwo;
                break;
            case "FoundationThree":
                secondArray = this.thirdFoundation;
                secondLocation = Location.FoundationThree;
                break;
            case "FoundationFour":
                secondArray = this.fourthFoundation;
                secondLocation = Location.FoundationFour;
                break;
        }

        
        const movedCardIndex: number = firstArray.indexOf(movedCard);
        const stackedOnCardIndex: number = secondArray.indexOf(stackedOnCard);

        //Incase both cards are in the same tableau, shouldn't happen but just in case
        if(firstLocation === secondLocation) {
            console.error(`[Tableau] Cards are in the same tableau`);
        } else if(destination === "Stock") {
            console.error("[Stock] Can't stack on top of cards in the Waste Pile.")
        } else if(stackedOnCardIndex === secondArray.length - 1){ // Only stack if the second selected card is the last one in the array
            (window as any).stackingScore++;
            console.log(`This is the stacking score:: ${(window as any).stackingScore}`);
            if(currentlocation === "Stock") {
                const selectedStockCardIndex: number = Tableau.instance.wastePile.indexOf((window as any).firstSlot);
                console.log(`[Stock] Selected Stock card index is: ${selectedStockCardIndex}`);
                Tableau.instance.wastePile[selectedStockCardIndex].changeCardLocation(secondLocation);
                secondArray.push(Tableau.instance.wastePile[selectedStockCardIndex]);
                Tableau.instance.wastePile.splice(selectedStockCardIndex);
                Tableau.moveCard((window as any).firstSlot.node, (window as any).secondSlot.node, _offsetY);
                if(destination === "FoundationOne" || destination === "FoundationTwo" || destination === "FoundationThree" || destination === "FoundationFour") {
                    if((window as any).secondCardData.cardArray.length > 1) {
                        // (window as any).firstSlot.node.setParent((window as any).secondCardData.cardNode);
                        (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 1].node.active = true;
                        console.log(`${(window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 1].rankSuitToString()} is active.`);
                        setTimeout(() => {
                            (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 2].node.active = false;
                            console.log(`${(window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 2].rankSuitToString()} is inactive.`);  
                        }, 3000);  
                    }
                }
                console.log("[Stock] Card moved from Stock to destination array");
            } else {
                let j = 1;
                for(let i = movedCardIndex; i < firstArray.length; i++) {
                    firstArray[i].changeCardLocation(secondLocation);
                    secondArray.push(firstArray[i]);
                    Tableau.moveCard(firstArray[i].node, (window as any).secondSlot.node, _offsetY * j);
                    console.log(`[MoveCard] Card moved: ${firstArray[movedCardIndex].rankSuitToString()}`);
                    j++;
                }
                firstArray.splice(movedCardIndex, firstArray.length);
                console.log("[Tableau] Card array changed to destinion array");
                console.log(`first array length is: ${firstArray.length}`);
                console.log(`Second array length: ${secondArray.length}`);
                this.listenToEmptyTableauClick();
                if(currentlocation === "FoundationOne" || currentlocation === "FoundationTwo" || currentlocation === "FoundationThree" || currentlocation === "FoundationFour") {
                    if((window as any).firstCardData.cardArray.length > 1) {
                        (window as any).firstCardData.cardArray[(window as any).firstCardData.cardArray.length - 1].node.active = true;
                        console.log(`${(window as any).firstCardData.cardArray[(window as any).firstCardData.cardArray.length - 1].rankSuitToString()} is active.`);
                        setTimeout(() => {
                            (window as any).firstCardData.cardArray[(window as any).firstCardData.cardArray.length - 2].node.active = false;
                            console.log(`${(window as any).firstCardData.cardArray[(window as any).firstCardData.cardArray.length - 2].rankSuitToString()} is inactive.`);  
                        }, 3000);
                          
                    }
                    
                } else if(destination === "FoundationOne" || destination === "FoundationTwo" || destination === "FoundationThree" || destination === "FoundationFour") {
                    if((window as any).secondCardData.cardArray.length > 1) {
                        // (window as any).firstSlot.node.setParent((window as any).secondCardData.cardNode);
                        (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 1].node.active = true;
                        console.log(`${(window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 1].rankSuitToString()} is active.`);
                        setTimeout(() => {
                            
                            (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 2].node.active = false;
                            console.log(`${(window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 2].rankSuitToString()} is inactive.`);  
                        }, 3000);
                    }
                }
                if(movedCardIndex > 0) {
                    this.flipLastCard(firstArray, movedCardIndex);
                }
            }
        }
        console.log("[Tableau] Cards are stacked")
        
    }


    /**
     * Stacks the cards in the seven Tableaux when the Game begins.
     */
    stackPileOnDeal(): void {
        let offsetCounter = 0;
        for(let i = 0; i < this.firstTableau.length; i++) {
            let card = this.firstTableau[i].node;
            card.parent = this.firstTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.secondTableau.length; i++) {
            let card = this.secondTableau[i].node;
            card.parent = this.secondTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.thirdTableau.length; i++) {
            let card = this.thirdTableau[i].node;
            card.parent = this.thirdTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.fourthTableau.length; i++) {
            let card = this.fourthTableau[i].node;
            card.parent = this.fourthTableaNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.fifthTableau.length; i++) {
            let card = this.fifthTableau[i].node;
            card.parent = this.fifthTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.sixthTableau.length; i++) {
            let card = this.sixthTableau[i].node;
            card.parent = this.sixthTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }

        offsetCounter = 0;
        for(let i = 0; i < this.seventhTableau.length; i++) {
            let card = this.seventhTableau[i].node;
            card.parent = this.seventhTableauNode;
            card.setPosition(
                card.position.x,
                card.position.y - (this._offsetY * offsetCounter),
                card.position.z - (this._offsetZ * offsetCounter)
            );
            offsetCounter++
        }
    }

    initTableaux() {
        this.init(this.buildDeck());
    }

    
    getRank(card: Card) {
        let rank: number;

        switch(`${card.rank}`) {
            case "ACE":
                rank = 1;
                break;
            case "TWO":
                rank = 2;
                break;
            case "THREE":
                rank = 3;
                break;
            case "FOUR":
                rank = 4;
                break;
            case "FIVE":
                rank = 5;
                break;
            case "SIX":
                rank = 6;
                break;
            case "SEVEN":
                rank = 7;
                break;
            case "EIGHT":
                rank = 8;
                break;
            case "NINE":
                rank = 9;
                break;
            case "TEN":
                rank = 10;
                break;
            case "JACK":
                rank = 11;
                break;
            case "QUEEN":
                rank = 12;
                break;
            case "KING":
                rank = 13;
                break;
        }

        return rank;
    }


    isStackable(cardToStack: Card, cardToBeStackedOn: Card): boolean {
        let cardtoStackRank: number = this.getRank(cardToStack);
        let cardToBeStackedOnRank: number = this.getRank(cardToBeStackedOn);

        // console.log(`Card to stack rank ${cardtoStackRank}`);
        // console.log(`Card to be stacked on rank ${cardToBeStackedOnRank}`);
        // Cards can only be stacked with alternating colors.
        if (cardToBeStackedOn.color === cardToStack.color) {
          console.log("[Tableau] Cannot stack: " + cardToStack.toString() + " on " + cardToBeStackedOn.toString() + ", need to alternate colors.");
          return false;
        }
        
    
        // Cards can only be stacked in descending order of rank.
        if (cardToBeStackedOnRank - 1 !== cardtoStackRank) {
          console.log("[Tableau] Cannot stack: " + cardToStack.toString() + " on " + cardToBeStackedOn.toString() + ", need to be in descending order of rank.");
          return false;
        }
    
        // All conditions are met, we can stack the card.
        console.log("[Tableau] Stacking Cards..");
        return true;
    }

    isStackableInFoundations(cardToStack: Card, cardToBeStackedOn: Card): boolean {
        let cardtoStackRank: number = this.getRank(cardToStack);
        let cardToBeStackedOnRank: number = this.getRank(cardToBeStackedOn);

        // console.log(`Card to stack rank ${cardtoStackRank}`);
        // console.log(`Card to be stacked on rank ${cardToBeStackedOnRank}`);
        // Cards can only be stacked with alternating colors.
        if ((window as any).firstCardData.suit !== (window as any).secondCardData.suit) {
          console.log("[Tableau] Cannot stack: " + cardToStack.toString() + " on " + cardToBeStackedOn.toString() + ", need to alternate colors.");
          return false;
        }
        
    
        // Cards can only be stacked in descending order of rank.
        if (cardToBeStackedOnRank + 1 !== cardtoStackRank) {
          console.log("[Tableau] Cannot stack: " + cardToStack.toString() + " on " + cardToBeStackedOn.toString() + ", need to be in descending order of rank.");
          return false;
        }
    
        // All conditions are met, we can stack the card.
        console.log("[Tableau] Stacking Cards..");
        return true;
    }



    /**
     * Moves Card Node to Foundation Node.
     * @param cardOne Card Node that's being stacked on an empty Foundation.
     * @param destinationNode Foundation Node that the card is being stacked on.
     */
    static moveCardToFoundation(cardOne: Node, destinationNode: Node) {
        let tweenDuration: number = 0.15;

        tween(cardOne)
        .to(tweenDuration, { worldPosition: new Vec3(destinationNode.worldPosition.x, destinationNode.worldPosition.y, destinationNode.worldPosition.z) })
        .call(() => {
            cardOne.setParent(destinationNode, true);
        })
        .start()
        console.log(`[Tableau] Cards were stacked`);
    }

    static moveCard(cardOne: Node, destinationNode: Node, _offsetY = 60): void {
        let tweenDuration: number = 0.15;
        let yOffset: number = -_offsetY;

        switch((window as any).clickLocation) {
            case "Tableau" || "Foundation":
                yOffset = 0;
                break;
        }

        tween(cardOne)
        .to(tweenDuration, { worldPosition: new Vec3(destinationNode.worldPosition.x, destinationNode.worldPosition.y + yOffset, destinationNode.worldPosition.z) })
        .call(() => {
            if((window as any).isStackedOnEmptyTableaux) {
                cardOne.setParent(destinationNode, true);
            } else if(!(window as any).isStackedOnEmptyTableaux) {
                cardOne.setParent((window as any).secondCardData.cardNode, true);
            }
        })
        .start()
        console.log(`[Tableau] Cards were stacked`);
        Tableau.instance.listenToEmptyTableauClick();
        (window as any).isStackedOnEmptyTableaux = false;
    }

    static handleInput(): void {
        // Player has no card selected, they can either turn over an eligible hidden card or select one from the tableau.
        switch((window as any).clickCount) {
            case 1:
            console.log(`[Tableau] First Card selected: ${(window as any).firstCardData.name}`);
            if((window as any).firstCardData.location === "Stock") {
                if((window as any).firstSlot !== Tableau.instance.wastePile[Tableau.instance.wastePile.length - 1]) {
                    console.error("You can only select the last card in stock to play");
                    console.log(`Index in waste pile is: ${Tableau.instance.wastePile.indexOf((window as any).firstSlot.node)}
                    Index of last card node in waste pile: ${Tableau.instance.wastePile.length - 1}`);
                    (window as any).clickCount = 0;
                } else {
                    console.log("[Stock] You can select the card to play.")
                }
            } 
            // else if((window as any).firstCardData.location === "FoundationOne" || (window as any).firstCardData.location === "FoundationTwo" || (window as any).firstCardData.location === "FoundationThree" || (window as any).firstCardData.location === "FoundationFour") {
            //     if((window as any).firstCardData.rank === "ACE") {
            //         (window as any).clickCount = 0;
            //         console.log("Can't move Ace card from Foundation");
            //     }
            // }
            // console.log(`${(window as any).firstSlot.color}`)
            break;
            case 2:
                switch((window as any).clickLocation) {
                    case "Card":
                        if((window as any).secondCardData.location === "FoundationOne" || (window as any).secondCardData.location === "FoundationTwo" || (window as any).secondCardData.location === "FoundationThree" || (window as any).secondCardData.location === "FoundationFour") {
                            console.log("[Foundation] Card to be stacked on is in one of the foundations");
                            if(Tableau.instance.isStackableInFoundations((window as any).firstSlot, (window as any).secondSlot)) {
                                console.log(`[Tableau] First Card location: ${(window as any).firstCardData.location}`);
                                console.log(`[Tableau] Second Card location: ${(window as any).secondCardData.location}`);
                                if((window as any).firstCardData.location !== (window as any).secondCardData.location) {
                                    Tableau.instance.changeCardArray((window as any).firstCardData.location, (window as any).secondCardData.location, (window as any).firstSlot, (window as any).secondSlot, 0);
                                    console.log(`First card array: ${(window as any).firstCardData.location}`);
                                    console.log(`Second card array: ${(window as any).secondCardData.location}`);
                                    if((window as any).secondCardData.cardArray > 0) {
                                        (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 1].node.active = true;
                                        if((window as any).secondCardData.cardArray > 1) {
                                            (window as any).secondCardData.cardArray[(window as any).secondCardData.cardArray.length - 2].node.active = false;
                                        }
                                    }
                                }
                            }
                        } else {
                            console.log(`[Tableau] Second Card selected: ${(window as any).secondCardData.name}`);
                            // console.log(`${(window as any).secondSlot.color}`);
                            if(Tableau.instance.isStackable((window as any).firstSlot, (window as any).secondSlot)) {
                                console.log(`[Tableau] First Card location: ${(window as any).firstCardData.location}`);
                                console.log(`[Tableau] Second Card location: ${(window as any).secondCardData.location}`);
                                if((window as any).firstCardData.location !== (window as any).secondCardData.location) {
                                    Tableau.instance.changeCardArray((window as any).firstCardData.location, (window as any).secondCardData.location, (window as any).firstSlot, (window as any).secondSlot, 60);
                                    console.log(`First card array: ${(window as any).firstCardData.location}`);
                                    console.log(`Second card array: ${(window as any).secondCardData.location}`);
                                }
                            } else {
                                return
                            }
                        }
                        
                        break;

                    case "Tableau":
                        break;
                        
                    case "Foundation":
                        break;
                }
            
            break;
        }
    }

}

