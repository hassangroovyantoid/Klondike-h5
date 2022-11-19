import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Help')
export class Help extends Component {

    @property({ type: Node }) startButton: Node;

    start() {
        this.startButton.on(Node.EventType.TOUCH_START, function() {
            director.loadScene("Klondike");
            console.log("[Scene] Switching to Game scene");
        }, this);
    }

    update(deltaTime: number) {
        
    }
}

