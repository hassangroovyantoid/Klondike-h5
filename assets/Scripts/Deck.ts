import { _decorator, Component, Node, instantiate} from 'cc';
import { AssetLoader } from './AssetLoader';
import { Card } from './Card';
import { Rank } from './Rank';
import { Suit } from './Suit';
const { ccclass, property } = _decorator;

@ccclass('Deck')
export class Deck extends Component {
    /**
     * Builds the deck of cards for the game
     * @returns Array of 52 Cards, not shuffled.
     */
    build(): Card[] {
        const deck = []
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
}

