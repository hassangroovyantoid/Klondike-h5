import { _decorator, Component, Node, math, NodeEventType, assetManager, ImageAsset, SpriteFrame, Texture2D, Sprite } from 'cc';
import { Card } from './Card';
import { Tableau } from './Tableau';
const { ccclass, property } = _decorator;

@ccclass('Stock')
export class Stock extends Component {
    static instance: Stock;
    

    private _offsetX: number;

    @property({
        visible: true,
        type: Node,
        tooltip: "Stock pile node."
    })
    stockPileNode: Node;

    onLoad() {
        (window as any).allowedStockCard;
    }

    start() {
        this.node.on(Node.EventType. TOUCH_START, function(event) {
            this.dealCardsFromStock();
        }, this)
    }

    shownCards : Card[] = []
    /**
     * Deals cards from the stock pile
     * @param cards Cards remaining after the 7 Tableaux are set up.
     */
    dealCardsFromStock() {
        const cards : Card[] = Tableau.instance.stockPile;

        console.log(`[Stock] Stock pile length is: ${cards.length}`);

        if(cards.length + Tableau.instance.wastePile.length > 24) {
            console.error("[Stock] Stock pile length is bigger than 24 cards.");
        }
        this.stockPileNode.children.forEach(element => {
            element.active = false;
        });

        let offsetCounter: number = 0;
        this._offsetX = 110;
        if(cards.length >= 3) {
            for(let i = 0; i < 3; i ++) {
                let card = cards[i].node;
                card.parent = this.stockPileNode;
                card.setPosition(
                    this.stockPileNode.worldPosition.x + (this._offsetX * offsetCounter),
                    this.stockPileNode.worldPosition.z,
                    this.stockPileNode.worldPosition.y,
                );
                offsetCounter++;
                card.active = true;
                Tableau.instance.wastePile.push(cards[i]);
                if(i === 2 || cards[i] === Tableau.instance.wastePile[Tableau.instance.wastePile.length - 1]) {
                    (window as any).allowedStockCard = card;
                }
            }
            const added_nodes = cards.splice(0, 3);
            this.shownCards = added_nodes;
            if(cards.length + Tableau.instance.wastePile.length > 24) {
                console.error("[Stock] Stock pile length is bigger than 24 cards. 2");
            }
            
        } else if(cards.length < 3 && cards.length > 0) {
            for(let i = 0; i < cards.length; i ++) {
                let card = cards[i].node;
                card.parent = this.stockPileNode;
                card.setPosition(
                    this.stockPileNode.position.x - 120 + (this._offsetX * offsetCounter),
                    this.stockPileNode.position.z,
                    this.stockPileNode.position.y,
                );
                card.active = true;
                offsetCounter++;
                Tableau.instance.wastePile.push(cards[i]);
                if(i === cards.length - 1 || cards[i] === Tableau.instance.wastePile[Tableau.instance.wastePile.length - 1]) {
                    (window as any).allowedStockCard = card;
                }
            }
            const added_nodes = cards.splice(0, cards.length);
            this.shownCards = added_nodes;

            if(cards.length + Tableau.instance.wastePile.length > 24) {
                console.error("[Stock] Stock pile length is bigger than 24 cards. 3");
            }
        } else {
            this.node.removeAllChildren();
            if(Tableau.instance.wastePile.length > 0) {
                Tableau.instance.stockPile = Tableau.instance.wastePile;
                console.log(`Waste pile length: ${Tableau.instance.wastePile.length}`);
                // console.log(Tableau.instance.wastePile.length);
                Tableau.instance.wastePile = [];
                // console.log(Tableau.instance.stockPile.length);
            }
            offsetCounter = 1;

            if(cards.length + Tableau.instance.wastePile.length > 24) {
                console.error("[Stock] Stock pile length is bigger than 24 cards. 4");
            }
        }
    }
}

