
MiloCat.Menu = function(game) {
    startButton = null;
    background = null;
};

MiloCat.Menu.prototype = {

    create: function() {

        // Room background
        background = this.add.sprite(0, 0, 'roombg');

        // menu here
        startButton = this.add.button(this.world.centerX, 0, 'button-start', this.clickStart, this, 1, 0, 2);
        startButton.input.useHandCursor = true;
        startButton.anchor.setTo(.5, .5);
        this.add.tween(startButton).to({x: this.world.centerX, y: this.world.centerY}, 1000, Phaser.Easing.Exponential.Out, true, 0, false);
    },
    clickStart: function() {

        this.state.start('Game');

    }

};