import {_decorator, Component, Button, AudioSource} from 'cc';
import {Placement, Wortal} from "../wortal-api/Wortal";

const { ccclass, property } = _decorator;

/**
 * Demo script that displays how to use the Wortal SDK and provides examples of how to interact with the API.
 */
@ccclass('WortalDemo')
export class WortalDemo extends Component {

    @property (Button)
    interstitial: Button;

    @property (Button)
    rewarded: Button;

    @property (AudioSource)
    audio: AudioSource;

    /** Initialization
     *
     * Initialize the Wortal SDK when the game starts.
     * It is strongly recommended to do this before using the SDK to ensure that no ad calls are skipped.
     *
     * If this is not done, it will happen automatically the first time you call for an ad.
     * In this scenario it is possible for the first ad call to be skipped if the SDK has not finished initializing yet.
     */
    start() {
        Wortal.init();

        this.interstitial.node.on(Button.EventType.CLICK, this.levelOver, this);
        this.rewarded.node.on(Button.EventType.CLICK, this.playerDied, this);
    }

    /**
     * Interstitial Ad
     *
     * These ads are useful to display at certain intervals or milestones in the game. Ex: Level finished, player level up.
     *
     * Giving a meaningful description in the ad call will improve ad analytics and give better insight as to which
     * parts of the game players are interacting with the most.
     *
     * Pause the game in the beforeAd callback, and resume it in the afterAd callback.
     */
    levelOver() {
        Wortal.showInterstitial(Placement.NEXT, "NextLevel", this.pause, this.resume);
    }

    /**
     * Rewarded Ad
     *
     * These ads are longer and require the player to watch the ad in its entirety to receive a reward. These are
     * useful to call in scenarios where the player can earn a bonus. Ex: Player dies, offer a rewarded ad for the
     * player to revive and continue playing.
     *
     * Giving a meaningful description in the ad call will improve ad analytics and give better insight as to which
     * parts of the game players are interacting with the most.
     *
     * Pause the game in the beforeAd callback, and resume it in the afterAd callback.
     * Reward the player in the adViewed callback only.
     * The adDismissed callback signals that the player skipped the ad and cannot be rewarded for watching it.
     */
    playerDied() {
        Wortal.showRewarded("ReviveAndContinue", this.pause, this.resume, this.gameOver, this.revive);
    }

    pause() {
        // Pause the game here.
        // Game.Pause();
        this.audio.pause();
    }

    resume() {
        // Resume the game here.
        // Game.Resume();
        this.audio.play();
    }

    gameOver () {
        // Player did not completely watch the rewarded ad, so we will call game over.
        // Game.Restart();
    }

    revive() {
        // Player watched the rewarded ad successfully, so we will revive them and allow them to continue playing.
        // Player.Revive();
    }
}

