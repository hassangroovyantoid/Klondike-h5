import { _decorator, Component, Node, SpriteFrame, Prefab, Sprite, assetManager, ImageAsset, Texture2D, CCString, resources } from 'cc';
import { Suit } from './Suit';
import { Rank } from './Rank';
import { Direction } from './Direction'; 
import { AssetLoader } from './AssetLoader';
import { Stock } from './Stock';
import { Location } from './Location';
import { Color } from './Color';
import { Tableau } from './Tableau';
import { BundleLoader } from './BundleLoader';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    static instance: Card;

    @property({
        type: Prefab,
        visible: true,
        tooltip: "Prefab of a Card."
    })
    CardPrefab: Prefab;

    @property({
        type: SpriteFrame,
        visible: true,
        tooltip: "Sprites for the back of the Card."
    })
    CardBack: SpriteFrame;

    @property({ type: Node }) firstCard: Node = null;
    @property({ type: Node }) secondCard: Node = null;
    
    @property({ type: SpriteFrame }) ClubsA: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs2: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs3: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs4: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs5: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs6: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs7: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs8: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs9: SpriteFrame;
    @property({ type: SpriteFrame }) Clubs10: SpriteFrame;
    @property({ type: SpriteFrame }) ClubsJ: SpriteFrame;
    @property({ type: SpriteFrame }) ClubsQ: SpriteFrame;
    @property({ type: SpriteFrame }) ClubsK: SpriteFrame;

    @property({ type: SpriteFrame }) HeartsA: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts2: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts3: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts4: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts5: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts6: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts7: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts8: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts9: SpriteFrame;
    @property({ type: SpriteFrame }) Hearts10: SpriteFrame;
    @property({ type: SpriteFrame }) HeartsJ: SpriteFrame;
    @property({ type: SpriteFrame }) HeartsQ: SpriteFrame;
    @property({ type: SpriteFrame }) HeartsK: SpriteFrame;

    @property({ type: SpriteFrame }) DiamondsA: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds2: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds3: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds4: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds5: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds6: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds7: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds8: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds9: SpriteFrame;
    @property({ type: SpriteFrame }) Diamonds10: SpriteFrame;
    @property({ type: SpriteFrame }) DiamondsJ: SpriteFrame;
    @property({ type: SpriteFrame }) DiamondsQ: SpriteFrame;
    @property({ type: SpriteFrame }) DiamondsK: SpriteFrame;

    @property({ type: SpriteFrame }) SpadesA: SpriteFrame;
    @property({ type: SpriteFrame }) Spades2: SpriteFrame;
    @property({ type: SpriteFrame }) Spades3: SpriteFrame;
    @property({ type: SpriteFrame }) Spades4: SpriteFrame;
    @property({ type: SpriteFrame }) Spades5: SpriteFrame;
    @property({ type: SpriteFrame }) Spades6: SpriteFrame;
    @property({ type: SpriteFrame }) Spades7: SpriteFrame;
    @property({ type: SpriteFrame }) Spades8: SpriteFrame;
    @property({ type: SpriteFrame }) Spades9: SpriteFrame;
    @property({ type: SpriteFrame }) Spades10: SpriteFrame;
    @property({ type: SpriteFrame }) SpadesJ: SpriteFrame;
    @property({ type: SpriteFrame }) SpadesQ: SpriteFrame;
    @property({ type: SpriteFrame }) SpadesK: SpriteFrame;

    @property({
      type: CCString,
      visible: true,
      tooltip: "Remote Sprites for the card faces of the clubs suit. Needs to be in order of rank."
    })
    private _clubs: string[] = [];
  
    @property({
      type: CCString,
      visible: true,
      tooltip: "Remote Sprites for the card faces of the diamonds suit. Needs to be in order of rank."
    })
    private _diamonds: string[] = [];
  
    @property({
      type: CCString,
      visible: true,
      tooltip: "Remote Sprites for the card faces of the hearts suit. Needs to be in order of rank."
    })
    private _hearts: string[] = [];
  
    @property({
      type: CCString,
      visible: true,
      tooltip: "Remote Sprites for the card faces of the spades suit. Needs to be in order of rank."
    })
    private _spades: string[] = [];

    public bundle: any = null;





    private _suit: Suit;
    private _rank: Rank;
    public _direction: Direction;
    private _location: Location;
    private _sprite: Sprite;

    private ranksArray: string[] = ["ACE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "JACK", "QUEEN", "KING"]

    @property({ type: SpriteFrame }) cardOutLine: SpriteFrame;
    @property({ type: Node }) cardOutlineNode: Node = null;
    public outlineRenderer: Sprite;


    public spriteframeToUse: SpriteFrame

    private remoteAssetUrl;

    private onLoadImageCallback: () => void;
    private shouldInvokeImageCallback: boolean = false;

    onLoad() {
        (window as any).clickCount = 0;
        (window as any).firstCardData;
        (window as any).secondCardData;
        (window as any).firstSlot;
        (window as any).secondSlot;
        (window as any).parentCard;
        (window as any).flipBackCard = false;
        (window as any).clickLocation;
        (window as any).assets;
    }

    getBundleRef()
    {
      if(this.bundle == null)
      {
        console.log("bundle is null, will try to get it");
        this.bundle = BundleLoader.instance.bundle;

        if(this.bundle != null) 
        {
          console.log("got bundle!");
          this.spriteframeToUse = this.bundle.get(`CardBack`, SpriteFrame);
          return true;
        }
        else
        {
          console.log("bundle could not be gotten");
          return false;
        }
      }
      else
      {
        console.log("bundle already there");
        return true;
      }
    }

    start() {
        this.outlineRenderer = this.cardOutlineNode.getComponent(Sprite);
    
        this.firstCard = this.node;


        switch(this.locationToString()) {
          case "FoundationOne":
            if(Tableau.instance.firstFoundation.indexOf(this) !== Tableau.instance.firstFoundation.length - 1) {
              this.node.off(Node.EventType.TOUCH_START);
            }
            break;
          case "FoundationTwo":
            if(Tableau.instance.secondFoundation.indexOf(this) !== Tableau.instance.secondFoundation.length - 1) {
              this.node.off(Node.EventType.TOUCH_START);
            } 
            break;
          case "FoundationThree":
            if(Tableau.instance.thirdFoundation.indexOf(this) !== Tableau.instance.thirdFoundation.length - 1) {
              this.node.off(Node.EventType.TOUCH_START);
            } 
            break;
          case "FoundationFour":
            if(Tableau.instance.fourthFoundation.indexOf(this) !== Tableau.instance.fourthFoundation.length - 1) {
              this.node.off(Node.EventType.TOUCH_START);
            } 
            break;
        }
        

        this.node.on(Node.EventType.TOUCH_START, function (event) {
          event.propagationImmediateStoppedtrue = true;
          this.cardTouchEvent();
          // There shouldn't be anywhere for the touch to bubble up to, but stop it regardless.
          event.propagationStopped = true;
        }, this);
    
        

        (window as any).fetchRemoteAssets = false
    }

    cardTouchEvent() {
      console.log(`Location: ${this.locationToString()}`);
      (window as any).clickCount++;
      (window as any).clickLocation = "Card";
      this.handleInput();
      Tableau.handleInput();
      this.node.off(Node.EventType.TOUCH_START, function() {
        console.log(`[Card] ${this.rankSuitToString()}'s Input Event is off.`);
      }, this); 
    }

    update() {
        if(this === (window as any).firstSlot) {
          if(this.locationToString() === "Stock" && this !== Tableau.instance.wastePile[Tableau.instance.wastePile.length - 1]) {
            return
          } else {
            this.outlineRenderer.spriteFrame = this.cardOutLine;
          }
          
        } else {
            this.outlineRenderer.spriteFrame = null;
        }
    } 


    /**
     * Changes location of the card.
     * @param location New Location of the Card.
     */
    changeCardLocation(location: Location) {
        this._location = location;
    }


    /**
     * Checks if card is selectable/ should have a touch event.
     */
    isSelectable() {
      if(this.locationToString() === "FoundationOne") {
        if(Tableau.instance.firstFoundation.indexOf(this) !== Tableau.instance.firstFoundation.length - 1) {
          return false
        }
      }
      
      if(this.locationToString() === "FoundationTwo") {
        if(Tableau.instance.secondFoundation.indexOf(this) !== Tableau.instance.secondFoundation.length - 1) {
          return false
        }
      }

      if(this.locationToString() === "FoundationThree") {
        if(Tableau.instance.thirdFoundation.indexOf(this) !== Tableau.instance.thirdFoundation.length - 1) {
          return false
        }
      }

      if(this.locationToString() === "FoundationFour") {
        if(Tableau.instance.fourthFoundation.indexOf(this) !== Tableau.instance.fourthFoundation.length - 1) {
          return false
        }
      }

      if(this.locationToString() !== "FoundationOne" && this.locationToString() !== "FoundationTwo" && this.locationToString() !== "FoundationThree" && this.locationToString() !== "FoundationFour") {
        return true
      }
    }


    /**
     * Initializes a new card.
     * @param suit Suit of the card.
     * @param rank Rank of the card.
     * @param direction Direction the card is facing.
     * @param location Current location of the card.
     */
    init(suit: Suit, rank: Rank, direction: Direction = Direction.Down, location: Location = Location.Deck) {
        this._suit = suit;
        this._rank = rank;
        this._direction = direction;
        this._location = location;

        this._sprite = this.getComponent(Sprite);
        console.log(`suit: ${this._suit} rank: ${this._rank} direction: ${this._direction}`);
        (window as any).assets = "Remote";
    }



    get color(): Color {
        if (this.suitToString() === "CLUBS" || this.suitToString() === "SPADES") {
          return Color.BLACK;
        } else {
          return Color.RED;
        }
      }
    
    get direction(): Direction {
        return this._direction;
    }

    get rank(): Rank {
        return this._rank;
    }

    get suit(): Suit {
        return this._suit;
    }

    get location(): Location {
        return this._location;
    }

    toString() {
        if(this._direction === Direction.Up){
            return "up"
        } else if(this._direction === Direction.Down){
            return "down"
        }
    }

    locationToString() {
        return `${this._location}`
    }
    

    rankSuitToString(): string {
        return `${this.rank} of ${this.suit}`;
    }

    suitToString(): string {
        return `${this._suit}`;
    }

    rankToString(): string {
        return `${this.rank}`
    }




    /**
     * @param pathEnd End of the URL path for Card's image.
     * @returns The URL of Card's image.
     */
    getCardImageUrl(pathEnd: string): void {
      //this.remoteAssetUrl = `http://localhost/klondike-assets/${pathEnd}.png`;
    }



    useLocalassets() {
      
      console.log("chose local assets :(");
      console.log("[Assets] Local assets are loaded.")
      let clubsArray: SpriteFrame[] = [this.ClubsA, this.Clubs2, this.Clubs3, this.Clubs4, this.Clubs5, this.Clubs6, this.Clubs7, this.Clubs8, this.Clubs9, this.Clubs10, this.ClubsJ, this.ClubsQ, this.ClubsK];
      let diamondsArray: SpriteFrame[] = [this.DiamondsA, this.Diamonds2, this.Diamonds3, this.Diamonds4, this.Diamonds5, this.Diamonds6, this.Diamonds7, this.Diamonds8, this.Diamonds9, this.Diamonds10, this.DiamondsJ, this.DiamondsQ, this.DiamondsK];
      let heartsArray: SpriteFrame[] = [this.HeartsA, this.Hearts2, this.Hearts3, this.Hearts4, this.Hearts5, this.Hearts6, this.Hearts7, this.Hearts8, this.Hearts9, this.Hearts10, this.HeartsJ, this.HeartsQ, this.HeartsK];
      let spadesArray: SpriteFrame[] = [this.SpadesA, this.Spades2, this.Spades3, this.Spades4, this.Spades5, this.Spades6, this.Spades7, this.Spades8, this.Spades9, this.Spades10, this.SpadesJ, this.SpadesQ, this.SpadesK];
      

      switch(this.suitToString()) {
        case "CLUBS":
          this._sprite.spriteFrame = clubsArray[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "DIAMONDS":
          this._sprite.spriteFrame = diamondsArray[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "HEARTS":
          this._sprite.spriteFrame = heartsArray[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "SPADES":
          this._sprite.spriteFrame = spadesArray[this.ranksArray.indexOf(this.rankToString())];
          break;
      }

      if(this.shouldInvokeImageCallback)
      {
        this.onLoadImageCallback();
        this.shouldInvokeImageCallback = false;
      }

    }

    
    useAssetBundle() {
  
      
      console.log("chose asset bundle yay");

      let self = this;
      console.log("loading card from bundle " + `${this.suitToString()}${this.ranksArray.indexOf(this.rankToString()) + 1}/spriteFrame`);
      try{
      this.bundle.load(`${this.suitToString()}${this.ranksArray.indexOf(this.rankToString()) + 1}/spriteFrame`, SpriteFrame, function (err, spriteFrame ) {

        if(err)
        {
          console.log("errr " + err);
        }

        console.log(spriteFrame);

        console.log(`Asset bundle Spriteframe is: ${self.rankToString()} of ${self.suitToString()}`);
        self.getComponent(Sprite).spriteFrame = spriteFrame;

        if(self.shouldInvokeImageCallback)
        {
          self.onLoadImageCallback();
          self.shouldInvokeImageCallback = false;
        }

      })
    }
    catch(e){
      console.log("- " + e);
    }
    }

    useRemoteAssets() {
      console.log("[Assets] Remote assets are loaded.");
      switch(this.suitToString()) {
        case "CLUBS":
          this.remoteAssetUrl = this._clubs[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "DIAMONDS":
          this.remoteAssetUrl = this._diamonds[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "HEARTS":
          this.remoteAssetUrl = this._hearts[this.ranksArray.indexOf(this.rankToString())];
          break;
        case "SPADES":
          this.remoteAssetUrl = this._spades[this.ranksArray.indexOf(this.rankToString())];
          break;
      }


          // let remoteUrl = `http://localhost/secondary-klondike-assets/${this.suitToString()}${this.ranksArray.indexOf(this.rankToString()) + 1}.png`;
          let remoteUrl = this.remoteAssetUrl;
          console.log(`Spriteframe URL is: ${remoteUrl}`);
          let self = this;
          assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) {
              try {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;

                self.getComponent(Sprite).spriteFrame = spriteFrame;

                if(self.shouldInvokeImageCallback)
                {
                  self.onLoadImageCallback();
                  self.shouldInvokeImageCallback = false;
                }

              } catch {
                console.log(`[Assets] Could not load remote Spriteframes, ${err}`);
              }
          });
    }

    setOnImageLoadCallback(callback: () => void)
    {
      this.onLoadImageCallback = callback;
      this.shouldInvokeImageCallback = true;
    }

    /**
   * Flips the card over to the opposite direction and changes the card back spriteframe.
   */
  flip(): void {

    this.getBundleRef();

    this._direction = Direction.Up;

    if(this.bundle == null)
    {
      this.useLocalassets();
    }
    else
    {
      try
      {
        console.log(`[Assets] Assets type: ${(window as any).assets}`);

        switch((window as any).assets) {
          case "Local":
            this.useLocalassets();
            break;
          case "Remote":
            try {
              this.useAssetBundle();
            } catch (error) {
              this.useLocalassets();
              console.error(`[Card] Failed to load remote assets, local assets have been loaded instead. ${error}`);
            }
            
            break;
        }

      } catch (e) {
        console.error(`[Card] Failed to load card face sprite for: ${this.rankSuitToString()} ${e}`);
      }
    }
    console.log(`[Card] Flipped upwards: ${this.rankSuitToString()} in: ${this.locationToString()}`);
    // } else {
    //   console.log(`[Card] Card is already facing up`)
    // }
  }


  /**
   * Gets the array that the card is in.
   * @param currentLocation Location card is currently in
   */
  getCardArray(currentLocation: string) {
    let cardArray: Card[];
    let cardLocation: Location;
    let cardNode: Node;

    switch(currentLocation) {
        case "Stock":
            cardArray = Tableau.instance.wastePile;
            cardLocation = Location.Stock;
            break;
        case "TableauOne":
            cardArray = Tableau.instance.firstTableau;
            cardLocation = Location.TableauOne;
            cardNode = Tableau.instance.firstTableauNode;
            break;
        case "TableauTwo":
            cardArray = Tableau.instance.secondTableau;
            cardLocation = Location.TableauTwo;
            cardNode = Tableau.instance.secondTableauNode;
            break;
        case "TableauThree":
            cardArray = Tableau.instance.thirdTableau;
            cardLocation = Location.TableauThree;
            cardNode = Tableau.instance.thirdTableauNode;
            break;
        case "TableauFour":
            cardArray = Tableau.instance.fourthTableau;
            cardLocation = Location.TableauFour;
            cardNode = Tableau.instance.fourthTableaNode;
            break;
        case "TableauFive":
            cardArray = Tableau.instance.fifthTableau;
            cardLocation = Location.TableauFive;
            cardNode = Tableau.instance.fifthTableauNode;
            break;
        case "TableauSix":
            cardArray = Tableau.instance.sixthTableau;
            cardLocation = Location.TableauSix;
            cardNode = Tableau.instance.sixthTableauNode;
            break;
        case "TableauSeven":
            cardArray = Tableau.instance.seventhTableau;
            cardLocation = Location.TableauSeven;
            cardNode = Tableau.instance.seventhTableauNode;
            break;
        case "FoundationOne":
            cardArray = Tableau.instance.firstFoundation;
            cardLocation = Location.FoundationOne;
            cardNode = Tableau.instance.firstFoundationNode;
            break;
        case "FoundationTwo":
            cardArray = Tableau.instance.secondFoundation;
            cardLocation = Location.FoundationTwo;
            cardNode = Tableau.instance.secondFoundationNode;
            break;
        case "FoundationThree":
            cardArray = Tableau.instance.thirdFoundation;
            cardLocation = Location.FoundationThree;
            cardNode = Tableau.instance.thirdFoundationNode;
            break;
        case "FoundationFour":
            cardArray = Tableau.instance.fourthFoundation;
            cardLocation = Location.FoundationFour;
            cardNode = Tableau.instance.fourthFoundationNode;
            break;
      }

      return {
        cardArray: cardArray,
        cardNode: cardNode
      };
  }

  getCardData(): {} {
    return {
      name: this.rankSuitToString(),
      suit: this.suitToString(),
      rank: this.rankToString(),
      location: this.locationToString(),
      cardArray: this.getCardArray(this.locationToString()).cardArray,
      cardNode: this.getCardArray(this.locationToString()).cardNode
    }
  }

  

  handleInput() {
    if(this.toString() === "up") {
        switch((window as any).clickCount) {
          case 1:
            this.firstCard = this.node;
            (window as any).firstSlot = this.firstCard.getComponent(Card);
            (window as any).parentCard = (window as any).firstSlot.node.parent.getComponent(Card);
            (window as any).firstCardData = this.getCardData();
            break;
          case 2:
            this.secondCard = this.node;
            (window as any).secondSlot = this.node.getComponent(Card);
            (window as any).secondCardData = this.getCardData();
            break;
          case 3:
            (window as any).clickCount = 1;
            this.handleInput();
        }
      }
  }

}

