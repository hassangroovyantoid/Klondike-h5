import { _decorator, Component, Node, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {

    @property(Node)
    private backgroundNode: Node = null;

    @property(CCBoolean)
    private startState: boolean = false;

    public static instance: LoadingScreen;

    private isOn: boolean;

    onLoad()
    {
        if(LoadingScreen.instance == null)
        {
            LoadingScreen.instance = this;
        }

        this.toggle(this.startState);
    }

    public toggle(on: boolean)
    {
        if(this.backgroundNode != null)
        {
            this.backgroundNode.active = on;
            this.isOn = on;
        }
        else
        {
            this.isOn = false;
        }
    }
}

