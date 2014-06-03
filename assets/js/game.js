
MiloCat.Game = function(game) {

    background = null,
    windows = null,

    bowls = {
        offsetX: 50,
        offsetY: 420,
        group: null,
        list: {}
    },

    statBars = {
        offsetX: 90,
        offsetY: 20,
        width: 100,
        height: 12,
        list: {}
    },

    cat = null,

    litter = null,

    tick = 0;

};

MiloCat.Game.prototype = {

    create: function() {

        // Room background
        background = this.add.sprite(0, 0, 'roombg');
        windows = this.add.sprite(this.world.centerX-85, 190, 'windows');

        // // Bowl of food/water
        this.generateBowl('food');
        this.generateBowl('water');

        // Cat sprite
        cat = storageAPI.get('catSprite') || 'cat';
        cat = this.add.sprite(this.world.centerX, 400, cat);
        cat.anchor.setTo(.5, .5);
        cat.animations.add('still', [0,1,2,3], .3, true);
        cat.animations.add('eat', [4,5], 1, true);
        cat.animations.add('walk', [6,7,8,9,10,11], 6, true);
        cat.animations.add('run', [12,13,14,15,16,17], 10, true);
        // cat.scale.setTo(.7, .7)
        this.catStill();

        // Cat initial stats
        cat.stats = {
            happy: 75,
            healthy: 50,
            hungry: 50
        };

        // Litter
        litter = this.add.sprite(650, 410, 'litter');

        // stat bars
        this.generateStatBar('happy', cat.stats.happy);
        this.generateStatBar('healthy', cat.stats.healthy);
        this.generateStatBar('hungry', cat.stats.hungry);

    },

    update: function() {

        if (cat.stats.happy > 0) cat.stats.happy -= .005;
        this.fillStatBar(statBars.list['happy'].level, cat.stats.happy);

        if (cat.stats.healthy > 0) cat.stats.healthy -= .01;
        this.fillStatBar(statBars.list['healthy'].level, cat.stats.healthy);

        if (cat.stats.hungry > 0) cat.stats.hungry -= .02;
        this.fillStatBar(statBars.list['hungry'].level, cat.stats.hungry);

        tick++;

        // FOR DEBUG
        /*
        if (tick > 600) {
            var rand = Math.floor((Math.random() * 100) + 1);
            if (rand < 50  && cat.action != 'drink') {
                this.moveCatToBowl('water');
            } else {
                this.moveCatRandomly();
            }
            tick = 0;
        }
        */
        // FOR DEBUG

        if (tick > 600) {
            var rand = Math.floor((Math.random() * 100) + 1);
            if (cat.stats.hungry <= 25) {
                this.moveCatToBowl('food');
            } else {
                if (rand < 34  && cat.action != 'eat') {
                    this.moveCatToBowl('food');
                } else if (rand < 67  && cat.action != 'drink') {
                    this.moveCatToBowl('water');
                } else {
                    this.moveCatRandomly();
                }
            }
            tick = 0;
        }

    },

    generateBowl: function(type) {

        // Bowl of food/water
        bowls.group = bowls.group || this.add.group();
        bowls.list[type] = bowls.group.create(bowls.offsetX, bowls.offsetY, 'bowls');
        bowls.list[type].frameName = 'bowlgreen.png';
        bowls.list[type].isEmpty = true;
        bowls.list[type].inputEnabled = true;
        bowls.list[type].input.useHandCursor = true;
        bowls.list[type].anchor.setTo(.5, .5);
        bowls.list[type].type = type;
        // bowls.list[type].input.enableDrag(false, true);


        bowls.list[type].events.onInputOver.add(this.mouseOverBowl, this);
        bowls.list[type].events.onInputOut.add(this.mouseOutBowl, this);

        bowls.list[type].events.onInputDown.add(this.clickBowl, this);

        bowls.offsetX -= 10;
        bowls.offsetY += 20;
    },

    generateStatBar: function(name, initialValue) {

        var style = {
            font: "bold 12px Arial",
            fill: "#333",
            align: "left"
        };

        statBars.list[name] = {};

        statBars.list[name].txt = this.add.text(20, statBars.offsetY, name.toUpperCase(), style);

        statBars.list[name].bar = this.add.graphics(0, 0);
        statBars.list[name].bar.lineStyle(2, 0x333333, 1);
        statBars.list[name].bar.beginFill(0xFFFFFF, 1);
        statBars.list[name].bar.drawRect(statBars.offsetX, statBars.offsetY, statBars.width+2, statBars.height);

        statBars.list[name].level = this.add.graphics(0, 0);
        statBars.list[name].level.posY = statBars.offsetY;

        this.fillStatBar(statBars.list[name].level, initialValue);

        statBars.offsetY += 20;
    },

    fillStatBar: function(bar, percent) {
        // reset bar first
        bar.beginFill(0xFFFFFF, 1);
        bar.drawRect(statBars.offsetX+1, bar.posY+1, 100, statBars.height-2);

        if (percent >= 50) {
            bar.beginFill(0x339900, 1);
        } else if (percent >= 20) {
            bar.beginFill(0xff6600, 1);
        } else {
            bar.beginFill(0xff0000, 1);
        }
        bar.drawRect(statBars.offsetX+1, bar.posY+1, percent, statBars.height-2);
    },

    moveCatRandomly: function() {

        var moveX = Math.floor((Math.random() * 760) + 20),
            moveY = Math.floor((Math.random() * 200) + 390);

        this.moveCatTo(moveX, moveY);
    },

    moveCatToBowl: function(type) {

        var bowl = bowls.list[type];

        var moveX = bowl.x + Math.abs(cat.width)/2,
            moveY = bowl.y - Math.abs(cat.height)/2 + 10;

        if (type == 'food') {
            this.moveCatTo(moveX, moveY, this.catEat);
        } else {
            this.moveCatTo(moveX, moveY, this.catDrink);
        }
    },

    moveCatTo: function(moveX, moveY, callback) {

        if (callback === undefined) callback = this.catStill;

        var speed = (Math.abs(moveX - cat.x) + Math.abs(moveY - cat.y));

        if (Math.abs(moveX - cat.x) > 300) {
            cat.animations.play('run');
            speed *= 2;
        } else {
            cat.animations.play('walk');
            speed *= 4;
        }

        if (moveX > cat.x) {
            cat.scale.x = Math.abs(cat.scale.x) * -1;
        } else {
            cat.scale.x = Math.abs(cat.scale.x);
        }

        var tween_cat = this.add.tween(cat);
        tween_cat.to({x:moveX, y: moveY}, speed);
        tween_cat.onComplete.add(callback, this);
        tween_cat.start();
    },

    catStill: function() {
        cat.animations.play('still');
        cat.action = 'still';
    },

    catEat: function() {
        cat.scale.x = Math.abs(cat.scale.x);
        cat.animations.play('eat');
        cat.action = 'eat';
        cat.stats.hungry = cat.stats.hungry + 50 > 100 ? 100 : cat.stats.hungry + 50;
        cat.stats.healthy = cat.stats.healthy + 5 > 100 ? 100 : cat.stats.healthy + 5;
        cat.stats.happy = cat.stats.happy + 1 > 100 ? 100 : cat.stats.happy + 1;
    },

    catDrink: function() {
        cat.scale.x = Math.abs(cat.scale.x);
        cat.animations.play('eat');
        cat.action = 'drink';
        cat.stats.hungry = cat.stats.hungry + 5 > 100 ? 100 : cat.stats.hungry + 5;
        cat.stats.healthy = cat.stats.healthy + 20 > 100 ? 100 : cat.stats.healthy + 20;
        cat.stats.happy = cat.stats.happy + 1 > 100 ? 100 : cat.stats.happy + 1;
    },

    mouseOverBowl: function(bowl) {
        bowls.list[bowl.type+'Select'] = bowls.group.create(bowl.x, bowl.y, 'bowls');
        bowls.list[bowl.type+'Select'].anchor.setTo(.5, .5);
        if (bowl.isEmpty || bowl.type === 'water') {
            bowls.list[bowl.type+'Select'].frameName = 'selectbowlempty.png';
        } else {
            bowls.list[bowl.type+'Select'].frameName = 'selectbowlfull.png';
        }
    },

    mouseOutBowl: function(bowl) {
        bowls.list[bowl.type+'Select'].kill();
        bowls.list[bowl.type+'Select'].parent.removeChild(bowls.list[bowl.type+'Select']);
    },

    clickBowl: function(bowl) {
        if (bowl.isEmpty) {
            bowl.isEmpty = false;
            bowls.list[bowl.type+'Fill'] = bowls.group.create(bowl.x, bowl.y, 'bowls');
            bowls.list[bowl.type+'Fill'].anchor.setTo(.5, .5);
            this.fillBowl(bowl);
        } else {
            bowl.isEmpty = true;
            bowls.list[bowl.type+'Fill'].kill();
            bowls.list[bowl.type+'Select'].frameName = 'selectbowlempty.png';
        }
    },

    fillBowl: function(bowl) {
        if (bowl.type === 'food') {
            bowls.list[bowl.type+'Fill'].frameName = 'foodinbowl.png';
            bowls.list[bowl.type+'Select'].frameName = 'selectbowlfull.png';
        } else {
            bowls.list[bowl.type+'Fill'].frameName = 'waterinbowl.png';
        }
    }








};

