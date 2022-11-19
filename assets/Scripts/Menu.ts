import { _decorator, Component, Node, director, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {

    @property({ type: Node }) startButton: Node;
    @property({ type: Node }) helpButton: Node;

    @property({ type: Node }) englishButton: Node;
    @property({ type: Node }) japaneseButton: Node;

    @property({ type: Label }) startLabel: Label;
    @property({ type: Label }) helpLabel: Label;


    onLoad() {
        (window as any).gameLanguage;
    }

    start() {
        (window as any).gameLanguage = "English";
        
        this.startButton.on(Node.EventType.TOUCH_START, function() {
            console.log("[Scene] Switching to Game scene");
            director.loadScene("Klondike");
        }, this);

        this.helpButton.on(Node.EventType.TOUCH_START, function() {
            if((window as any).gameLanguage === "English") {
               director.loadScene("Help"); 
            } else {
                director.loadScene("Help-japanese");
            }
            console.log("[Scene] Switching to How to Play scene");
        }, this);

        this.englishButton.on(Node.EventType.TOUCH_START, function() {
            (window as any).gameLanguage = "English";
            console.log("[Language] Language changed to English");
            this.startLabel.string = "Start";
            this.helpLabel.string = "Help"; 
        }, this);

        this.japaneseButton.on(Node.EventType.TOUCH_START, function() {
            (window as any).gameLanguage = "Japanese";
            console.log("[Language] Language changed to Japanese");
            this.startLabel.string = "始める";
            this.helpLabel.string = "ヘルプ";
        }, this);
    }

    update(deltaTime: number) {
        
    }
}

