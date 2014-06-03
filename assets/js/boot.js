
var MiloCat = {
    Boot: function(game) {}
};

MiloCat.Boot.prototype = {

    preload: function() {

    },

    create: function() {

        // Welcome screen

        this.state.start('Loader');
    }

};