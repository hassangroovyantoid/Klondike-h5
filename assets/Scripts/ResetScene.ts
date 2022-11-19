import { _decorator, Component, Node, director } from 'cc';
import { Placement, Wortal } from '../wortal-api/Wortal';
const { ccclass, property } = _decorator;

@ccclass('ResetScene')
export class ResetScene extends Component {
    start() {
        // Wortal.init();

        this.node.on(Node.EventType.TOUCH_START, function(event) {
            director.loadScene("Klondike")
            
            // Wortal.showInterstitial(Placement.NEXT, 'NextLevel', function() {}, function() {
            //     director.loadScene("Klondike")
            // });
        }, this);
    }
}

