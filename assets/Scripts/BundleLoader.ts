import { _decorator, Component, Node, assetManager, SpriteFrame } from 'cc';
import { Tableau } from './Tableau';
const { ccclass, property } = _decorator;

@ccclass('BundleLoader')
export class BundleLoader extends Component {

    public static instance: BundleLoader;
    
    @property(Tableau)
    public tableu: Tableau;

    public bundle;

    public remoteAssetUrl = "http://dwklondikehost.ap-1.evennode.com/remote/klondike-assets/";

    onLoad()
    {
        if(BundleLoader.instance == null)
        {
            BundleLoader.instance = this;
        }

        this.LoadBundle();
    }

    LoadBundle()
    {
      assetManager.loadBundle(this.remoteAssetUrl, (err, bundle) => {
        if(err)
        {
          this.bundle = null;
          console.log("errr " + err);
        }
        else
        {
          console.log("Bundle loaded succefully!");
            console.log(bundle);
            this.bundle = bundle;
        }
          this.tableu.starts();
        });
    }
}

