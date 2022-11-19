import { _decorator, Component, Node, SpriteFrame, Prefab } from 'cc';
import {Card} from "../Scripts/Card";
import {Suit} from "../Scripts/Suit";
const { ccclass, property } = _decorator;

/**
 * Helper class for loading sprites at runtime. For better error handling, calls to this class should be wrapped
 * in a try/catch block.
 */
@ccclass('AssetLoader')
export class AssetLoader extends Component {
  static instance: AssetLoader;

  @property({
    type: Prefab,
    visible: true,
    tooltip: "Prefab of a card."
  })
  cardPrefab: Prefab;

  @property({
    type: SpriteFrame,
    visible: true,
    tooltip: "Sprites for the back of the card."
  })
  cardBack: SpriteFrame;

  @property({
    type: SpriteFrame,
    visible: true,
    tooltip: "Sprites for the card faces of the clubs suit. Needs to be in order of rank."
  })
  private _clubs: SpriteFrame[] = [];

  @property({
    type: SpriteFrame,
    visible: true,
    tooltip: "Sprites for the card faces of the diamonds suit. Needs to be in order of rank."
  })
  private _diamonds: SpriteFrame[] = [];

  @property({
    type: SpriteFrame,
    visible: true,
    tooltip: "Sprites for the card faces of the hearts suit. Needs to be in order of rank."
  })
  private _hearts: SpriteFrame[] = [];

  @property({
    type: SpriteFrame,
    visible: true,
    tooltip: "Sprites for the card faces of the spades suit. Needs to be in order of rank."
  })
  private _spades: SpriteFrame[] = [];

  onLoad() {
    console.log("[AssetLoader] Loaded.");
    AssetLoader.instance = this;
  }

}



