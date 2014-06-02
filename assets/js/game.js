var roomBG,

    bowls = {
        offsetX: 50,
        offsetY: 420,
        group: null,
        list: {}
    },

    bowlSelect,

    statBars = {
        offsetX: 90,
        offsetY: 20,
        width: 100,
        height: 12,
        list: {}
    },

    cat,

    tick = 0;

var game = new Phaser.Game(
    800, 600,
    Phaser.CANVAS, '',
    {
        preload: preload,
        create: create,
        update: update
    }
);

function preload() {
    game.load.image('roombg', 'assets/img/bg.png');
    game.load.spritesheet('cat','assets/img/catsprite2.png', 84, 68, 18);
    game.load.atlasXML('bowls', 'assets/img/bowls.png', 'assets/img/bowls.plist');
}


function create() {

    // Room background
    roomBG = game.add.sprite(0, 0, 'roombg');
    roomBG.inputEnabled = true;

    // // Bowl of food/water
    generateBowl('food');
    generateBowl('water');

    // Cat sprite
    cat = game.add.sprite(game.world.centerX, 400, 'cat');
    cat.anchor.setTo(.5, .5);
    cat.animations.add('still', [0,1,2,3], .3, true);
    cat.animations.add('eat', [4,5], 1, true);
    cat.animations.add('walk', [6,7,8,9,10,11], 6, true);
    cat.animations.add('run', [12,13,14,15,16,17], 10, true);
    // cat.scale.setTo(.7, .7)
    catStill();

    // stat bars
    generateStatBar('happy', 75);
    generateStatBar('healthy', 40);
    generateStatBar('hungry', 10);


}


function update() {

    tick++;

    if (tick > 600) {
        var rand = Math.floor((Math.random() * 100) + 1)
        if (rand < 50) {
            moveCatRandomly();
        } else {
            if (cat.action != 'eat') {
                moveCatToFood();
            }
        }
        tick = 0;
    }

}

function generateBowl(type) {

    // Bowl of food/water
    bowls.group = bowls.group || game.add.group();
    bowls.list[type] = bowls.group.create(bowls.offsetX, bowls.offsetY, 'bowls');
    bowls.list[type].frameName = 'bowlgreen.png';
    bowls.list[type].isEmpty = true;
    bowls.list[type].inputEnabled = true;
    bowls.list[type].input.useHandCursor = true;
    bowls.list[type].anchor.setTo(.5, .5);
    bowls.list[type].type = type;
    // bowls.list[type].input.enableDrag(false, true);


    bowls.list[type].events.onInputOver.add(mouseOverBowl, this);
    bowls.list[type].events.onInputOut.add(mouseOutBowl, this);

    bowls.list[type].events.onInputDown.add(clickBowl, this);

    bowls.offsetX -= 10;
    bowls.offsetY += 20;
}

function generateStatBar(name, initialValue) {

    var style = {
        font: "bold 12px Arial",
        fill: "#333",
        align: "left"
    };

    statBars.list[name] = {};

    statBars.list[name].txt = game.add.text(20, statBars.offsetY, name.toUpperCase(), style);

    statBars.list[name].bar = game.add.graphics(0, 0);
    statBars.list[name].bar.lineStyle(2, 0x333333, 1);
    statBars.list[name].bar.beginFill(0xFFFFFF, 1);
    statBars.list[name].bar.drawRect(statBars.offsetX, statBars.offsetY, statBars.width, statBars.height);

    statBars.list[name].level = game.add.graphics(0, 0);
    statBars.list[name].level.posY = statBars.offsetY;

    fillStatBar(statBars.list[name].level, initialValue);

    statBars.offsetY += 20;
}

function fillStatBar(bar, percent) {
    if (percent >= 50) {
        bar.beginFill(0x339900, 1);
    } else if (percent >= 20) {
        bar.beginFill(0xff6600, 1);
    } else {
        bar.beginFill(0xff0000, 1);
    }
    bar.drawRect(statBars.offsetX+1, bar.posY+1, percent, statBars.height-2);
}

function moveCatRandomly() {

    var moveX = Math.floor((Math.random() * 760) + 20),
        moveY = Math.floor((Math.random() * 200) + 390);

    moveCatTo(moveX, moveY);
}

function moveCatToFood() {

    var bowl = bowls.list['food'];

    var moveX = bowl.x + Math.abs(cat.width)/2,
        moveY = bowl.y - Math.abs(cat.height)/2 + 10;

    moveCatTo(moveX, moveY, catEat);
}

function moveCatTo(moveX, moveY, callback) {

    if (callback === undefined) callback = catStill;

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

    var tween_cat = game.add.tween(cat);
    tween_cat.to({x:moveX, y: moveY}, speed);
    tween_cat.onComplete.add(callback, this);
    tween_cat.start();
}

function catStill() {
    cat.animations.play('still');
    cat.action = 'still';
}

function catEat() {
    cat.scale.x = Math.abs(cat.scale.x);
    cat.animations.play('eat');
    cat.action = 'eat';
}

function mouseOverBowl(bowl) {
    bowlSelect = bowls.group.create(bowl.x, bowl.y, 'bowls');
    bowlSelect.anchor.setTo(.5, .5);
    if (bowl.isEmpty || bowl.type === 'water') {
        bowlSelect.frameName = 'selectbowlempty.png';
    } else {
        bowlSelect.frameName = 'selectbowlfull.png';
    }
}

function mouseOutBowl(bowl) {
    bowlSelect.kill();
    bowlSelect.parent.removeChild(bowlSelect);
}

function clickBowl(bowl) {
    if (bowl.isEmpty) {
        bowl.isEmpty = false;
        bowls.list[bowl.type+'Fill'] = bowls.group.create(bowl.x, bowl.y, 'bowls');
        bowls.list[bowl.type+'Fill'].anchor.setTo(.5, .5);
        if (bowl.type === 'food') {
            bowls.list[bowl.type+'Fill'].frameName = 'foodinbowl.png';
            bowlSelect.frameName = 'selectbowlfull.png';
        } else {
            bowls.list[bowl.type+'Fill'].frameName = 'waterinbowl.png';
        }
    } else {
        bowl.isEmpty = true;
        bowls.list[bowl.type+'Fill'].kill();
        bowlSelect.frameName = 'selectbowlempty.png';
    }
}



