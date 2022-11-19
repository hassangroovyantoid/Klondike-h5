export class Wortal {
    private static _platform: Platform;
    private static _linkInterstitialId: string;
    private static _linkRewardedId: string;
    private static _isInit: boolean = false;
    private static _isAdShowing: boolean = false;

    /**
     * Initializes the Wortal extension. It is necessary to call this before using the Wortal SDK.
     */
    static init() {
        if (Wortal._isInit) {
            console.warn("[Wortal] Already initialized");
            return;
        }

        Wortal._platform = Wortal.getPlatform();
        console.log("[Wortal] Platform: " + this._platform);

        if (Wortal._platform === Platform.LINK) {
            Wortal.getLinkAdUnitIds();
        }

        console.log("[Wortal] Initialized");
        Wortal._isInit = true;
    }

    /**
     * Shows an interstitial ad.
     * @param type Type of ad placement.
     * @param description Description of the ad placement. Ex: "NextLevel"
     * @param beforeAd Callback before the ad is shown. Pause the game here.
     * @param afterAd Callback after the ad is shown. Resume the game here.
     */
    static showInterstitial(type: Placement, description: string, beforeAd: Function, afterAd: Function): void;

    /**
     * Shows an interstitial ad.
     * @param type Type of ad placement.
     * @param description Description of the ad placement. Ex: "NextLevel"
     * @param beforeAd Callback before the ad is shown. Pause the game here.
     * @param afterAd Callback after the ad is shown. Resume the game here.
     * @param adBreakDone Callback when the adBreak has completed. Called only on AdSense platform. Will typically be called in conjunction with afterAd or noShow.
     * @param noShow Callback when the ad is timed out or not served.
     */
    static showInterstitial(type: Placement, description: string, beforeAd: Function, afterAd: Function,
                            adBreakDone?: Function, noShow?: Function) {

        // Take care when passing adBreakDone and noShow callbacks, as they will typically be called together alongside afterAd.
        // Ex: Ad shows successfully, afterAd and adBreakDone are called.
        // Ex: Ad does not fill, adBreakDone and noShow are called.
        // This can lead to duplicating calls and unintended consequences if these callbacks are used together.
        // Ex: Resume game on both afterAd and adBreakDone. Resume is called twice.

        if (!Wortal._isInit) {
            Wortal.init();
        }

        if (this._isAdShowing) {
            console.warn("[Wortal] Ad already showing, wait for it to complete before calling again.");
            return;
        }

        let placement: string = type;
        let adUnit: string = "";
        let adDone: boolean = false;

        if (Wortal._platform === Platform.LINK) {
            adUnit = Wortal._linkInterstitialId;
            if (adUnit == null) {
                console.warn("[Wortal] AdUnitId was null. Skipping ad call. Call Wortal.init() on game start to prevent this.");
                return;
            }
        }

        this._isAdShowing = true;
        (window as any).triggerWortalAd(placement, adUnit, description, {
            beforeAd: () => {
                console.log("[Wortal] BeforeAd");
                beforeAd();
            },
            afterAd: () => {
                console.log("[Wortal] AfterAd");
                afterAd();
                adDone = true;
                this._isAdShowing = false;
            },
            adBreakDone: () => {
                console.log("[Wortal] AdBreakDone");
                if (adBreakDone) {
                    adBreakDone()
                    this._isAdShowing = false;
                } else {
                    if (!adDone) {
                        adDone = true;
                        afterAd();
                        this._isAdShowing = false;
                    }
                }
            },
            noShow: () => {
                console.log("[Wortal] NoShow");
                if (noShow) {
                    noShow();
                    this._isAdShowing = false;
                } else {
                    if (!adDone) {
                        adDone = true;
                        afterAd();
                        this._isAdShowing = false;
                    }
                }
            },
        });
    }

    /**
     * Shows a rewarded ad.
     * @param description Description of the ad being shown. Ex: 'ReviveAndContinue'.
     * @param beforeAd Callback before the ad is shown. Pause the game here.
     * @param afterAd Callback after the ad is shown.
     * @param adDismissed Callback when the player cancelled the rewarded ad before it finished. Do not reward the player.
     * @param adViewed Callback when the player viewed the rewarded ad successfully. Reward the player.
     */
    static showRewarded(description: string, beforeAd: Function, afterAd: Function, adDismissed: Function,
                        adViewed: Function): void;

    /**
     * Shows a rewarded ad.
     * @param description Description of the ad being shown. Ex: 'ReviveAndContinue'.
     * @param beforeAd Callback before the ad is shown. Pause the game here.
     * @param afterAd Callback after the ad is shown.
     * @param adDismissed Callback when the player cancelled the rewarded ad before it finished. Do not reward the player.
     * @param adViewed Callback when the player viewed the rewarded ad successfully. Reward the player.
     * @param beforeReward Callback before showing the rewarded ad. This can trigger a popup giving the player the option to view the ad for a reward.
     * @param adBreakDone Callback when the adBreak has completed. Resume the game here.
     * @param noShow Callback when the ad is timed out or not served. Resume the game here.
     */
    static showRewarded(description: string, beforeAd: Function, afterAd: Function, adDismissed: Function,
                        adViewed: Function, beforeReward?: Function, adBreakDone?: Function, noShow?: Function) {

        //TODO: handle beforeReward args

        if (!Wortal._isInit) {
            Wortal.init();
        }

        if (this._isAdShowing) {
            console.warn("[Wortal] Ad already showing, wait for it to complete before calling again.");
            return;
        }

        let placement: string = Placement.REWARD;
        let adUnit: string = "";
        let adDone: boolean = false;

        if (Wortal._platform === Platform.LINK) {
            adUnit = Wortal._linkRewardedId;
            if (adUnit == null) {
                console.warn("[Wortal] AdUnitId was null. Skipping ad call. Call Wortal.init() on game start to prevent this.");
                return;
            }
        }

        this._isAdShowing = true;
        (window as any).triggerWortalAd(placement, adUnit, description, {
            beforeAd: () => {
                console.log("[Wortal] BeforeAd");
                if (beforeAd) beforeAd();
            },
            afterAd: () => {
                console.log("[Wortal] AfterAd");
                afterAd();
                adDone = true;
                this._isAdShowing = false;
            },
            adDismissed: () => {
                console.log("[Wortal] AdDismissed");
                adDismissed();
            },
            adViewed: () => {
                console.log("[Wortal] AdViewed");
                adViewed();
            },
            beforeReward: (showAdFn) => {
                console.log("[Wortal] BeforeReward");
                if (beforeReward) {
                    beforeReward(showAdFn);
                } else {
                    //TODO: can we auto trigger the rewarded ad here?
                }
            },
            adBreakDone: () => {
                console.log("[Wortal] AdBreakDone");
                if (adBreakDone) {
                    adBreakDone();
                    this._isAdShowing = false;
                } else {
                    if (!adDone) {
                        adDone = true;
                        afterAd();
                        this._isAdShowing = false;
                    }
                }
            },
            noShow: () => {
                console.log("[Wortal] NoShow");
                if (noShow) {
                    noShow();
                    this._isAdShowing = false;
                } else {
                    if (!adDone) {
                        adDone = true;
                        afterAd();
                        this._isAdShowing = false;
                    }
                }
            },
        });
    }

    private static getPlatform(): Platform {
        let platform = (window as any).getWortalPlatform();

        switch (platform) {
            case 'wortal':
                return Platform.WORTAL;
            case 'link':
                return Platform.LINK;
            case 'viber':
                return Platform.VIBER;
            default:
                return Platform.DEBUG;
        }
    }

    private static getLinkAdUnitIds() {
        (window as any).wortalGame.getAdUnitsAsync().then((adUnits) => {
            console.log("Link AdUnit IDs returned: \n" + adUnits);
            this._linkInterstitialId = adUnits[0].id;
            this._linkRewardedId = adUnits[1].id;
        });
    }
}

/**
 * Types of ad placements as defined by Google:
 * https://developers.google.com/ad-placement/docs/placement-types
 */
export enum Placement {
    /**
     * Your game has not loaded its UI and is not playing sound. There can only be one ‘preroll’ placement in your game
     * for each page load. Preroll ads can only use the adBreakDone callback.
     */
    PREROLL = 'preroll',
    /**
     * Your game has loaded, the UI is visible and sound is enabled, the player can interact with the game, but the
     * game play has not started yet.
     */
    START = 'start',
    /**
     * The player pauses the game.
     */
    PAUSE = 'pause',
    /**
     * The player navigates to the next level.
     */
    NEXT = 'next',
    /**
     * The player explores options outside of gameplay.
     */
    BROWSE = 'browse',
    /**
     * The player reaches a point in the game where they can be offered a reward.
     */
    REWARD = 'reward'
}

enum Platform {
    DEBUG = 'debug',
    WORTAL = 'wortal',
    LINK = 'link',
    VIBER = 'viber'
}