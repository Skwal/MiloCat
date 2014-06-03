
MiloCat.Loader = function(game) {
};

MiloCat.Loader.prototype = {

    preload: function() {
        this.load.image('roombg', 'assets/img/bg.png');
        this.load.image('windows', 'assets/img/window.png');
        this.load.spritesheet('cat2','assets/img/catsprite.png', 84, 68, 18);
        this.load.spritesheet('cat','assets/img/catsprite2.png', 84, 68, 18);
        this.load.spritesheet('litter','assets/img/litterbox.png', 106, 48, 1);
        this.load.atlasXML('bowls', 'assets/img/bowls.png', 'assets/img/bowls.plist');
        this.load.spritesheet('button-start', 'assets/img/button-start.png', 130, 32);
        this.load.spritesheet('button-start2', 'assets/img/button-start2.png', 130, 32);
    },

    create: function() {

        this.state.start('Menu');
    }

};