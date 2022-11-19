window.addEventListener("load", () => {
    window.initWortal(function () {
        console.log("[Wortal] Setup complete.");
        document.getElementById("loading-cover").style.display = "none";
        window.wortalGame.initializeAsync().then(() => {
            window.wortalGame.startGameAsync();
        });
    });
});