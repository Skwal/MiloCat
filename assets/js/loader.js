
MiloCat.Loader = function(game) {
};

MiloCat.Loader.prototype = {

    preload: function() {
        this.load.image('roombg', 'assets/img/bg.png');
        this.load.spritesheet('cat','assets/img/catsprite2.png', 84, 68, 18);
        this.load.atlasXML('bowls', 'assets/img/bowls.png', 'assets/img/bowls.plist');
        this.load.spritesheet('button-start', 'assets/img/button-start.png', 130, 32);
    },

    create: function() {

        this.state.start('Menu');
    }

};