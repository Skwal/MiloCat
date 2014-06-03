
MiloCat.Menu = function(game) {
    startButton1 = null;
    startButton2 = null;
    background = null;
};

MiloCat.Menu.prototype = {

    create: function() {

        // Room background
        background = this.add.sprite(0, 0, 'roombg');

        // menu here
        startButton1 = this.add.button(this.world.centerX, 0, 'button-start', this.clickStart, this, 1, 0, 2);
        startButton1.input.useHandCursor = true;
        startButton1.anchor.setTo(.5, .5);
        this.add.tween(startButton1).to({x: this.world.centerX, y: this.world.centerY}, 1000, Phaser.Easing.Exponential.Out, true, 0, false);

        startButton2 = this.add.button(this.world.centerX, 0, 'button-start2', this.clickStart2, this, 1, 0, 2);
        startButton2.input.useHandCursor = true;
        startButton2.anchor.setTo(.5, .5);
        this.add.tween(startButton2).to({x: this.world.centerX, y: this.world.centerY+40}, 1000, Phaser.Easing.Exponential.Out, true, 0, false);
    },
    clickStart: function() {

        storageAPI.set('catSprite', 'cat');

        this.state.start('Game');

    },
    clickStart2: function() {

        storageAPI.set('catSprite', 'cat2');

        this.state.start('Game');

    }

};