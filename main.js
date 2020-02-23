var game;

var Starter = new Phaser.Class({
    Extends: Phaser.Scene,

    preload: function ()
    {
        this.load.image('fish', 'assets/poisson-carre.png');
        this.load.image('filet', 'assets/filet1.png');
        this.load.image('shark', 'assets/requin.png');
        this.load.image('background', 'assets/fond.png');
    },

    create: function ()
    {
        this.scene.add("game", MainGame, false);
        this.scene.add("menu", Menu, false);
        this.scene.add("gameover", GameOver, false);
    },

    update: function ()
    {
        this.scene.start("menu", null);
    }
})

var Menu =  new Phaser.Class({
    Extends: Phaser.Scene,

    create: function () 
    {
        let fromLimit = 200;
        this.add.image(config.width/2, config.height/2, 'background');

        this.flock = this.physics.add.group();
        
        for (let i = 0; i < config.numFish/2; i++) {
            let y = config.height * (i + 5) / (config.numFish + 10)

            newFich(this.flock, fromLimit, y);
            newFich(this.flock, config.width - fromLimit, y);
        }

        var color = new Phaser.Display.Color();
        color.random(50);


        let startButton = this.add.text(this.physics.world.bounds.centerX, 16, 'Start Game', config.textStyle);
        this.physics.add.existing(startButton);
        startButton.setInteractive();
        startButton.body.immovable = true

        let scene = this.scene
        startButton.on('pointerdown', function (pointer) {
            scene.start("game");
        })

        this.physics.add.collider(startButton, this.flock)


        //startButton = this.add.text(this.physics.world.bounds.centerX, 16, 'Start Game', config.textStyle);
        //startButton = this.add.text(this.physics.world.bounds.centerX, 16, 'Start Game', config.textStyle);
        //startButton = this.add.text(this.physics.world.bounds.centerX, 16, 'Start Game', config.textStyle);
    },

    update: function () 
    {
        flock(this.flock);

    }
})

var GameOver =  new Phaser.Class({
    Extends: Phaser.Scene,

    create: function(data)
    {
        console.log(data);
        GameOver = this.add.text(data.posx, data.posy, 'GAMEOVER', config.textStyle);
        SCORE = this.add.text(data.posx, data.posy + GameOver.height * 1.5, 'Score: ' + data.score, config.textStyle);
        this.input.once('pointerup', function (event) {
            data.me.filet = null;
            data.me.shark = null;
            this.scene.start('menu');

        }, this);

    }
})

var MainGame = new Phaser.Class({
    Extends: Phaser.Scene,

    create: function ()
    {

        this.add.image(config.width/2, config.height/2, 'background');

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.flock = this.physics.add.group();
        
        for (let i = 0; i < config.numFish; i++) {
            let x = config.width/2 + 50 * Math.sin(2 * Math.PI * i / config.numFish)
            let y = config.height/2 + 50 * Math.cos(2 * Math.PI * i / config.numFish)

            newFich(this.flock, x, y);
        }
        this.physics.add.collider(this.flock, this.flock)
        // flock(this.flock); for debug

        this.enemies = [];

        this.firstFiletTimer = this.time.addEvent({
            delay: 2000,
            callback: makeFilet,
            callbackScope: this
        })

        this.firstSharkTimer = this.time.addEvent({
            delay: 10000, // TODO: change that
            callback: makeShark,
            callbackScope: this
        })
    },

    update: function(time, delta)
    {
        flock(this.flock);

        for (let i = 0; i<this.enemies.length; ) {
            let enemie = this.enemies[i];
            if (Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, enemie.getBounds())) {
                enemie.capture(this.flock, delta);
                i++
            } else {
                enemie.getLost.call(this);
                this.enemies.slice(i);
            }
        }

        remove_far(this, this.flock);
        this.score += this.flock.countActive() * delta/100;
        this.scoreText.setText('Score: ' + Math.ceil(this.score));

        if (this.flock.countActive() === 0 && !this.gameover) {
            this.gameover = true;
            this.scene.launch("gameover", { 
                score: Math.ceil(this.score), 
                posx: this.physics.world.bounds.centerX,
                posy: this.physics.world.bounds.centerY,
                me: this
            })
        }
    }
})


function newFich(flock, x, y) {
    let newobj = flock.create(x, y, 'fish');
    newobj.setBounce(1);
    newobj.setCircle(newobj.width / 2);
    newobj.setScale(0.05);
}

function makeFilet() {
    if (! this.filet) {
        this.filet = new Filet(this);
        this.filet.getLost = makeFilet;
    }
    this.filet.moveTo(-20, Phaser.Math.Between(this.filet.getBounds().height/2, config.height - this.filet.getBounds().height/2));
    this.enemies.push(this.filet);

}


function makeShark() {
    if (! this.shark) {
        this.shark = new Shark(this);
        this.shark.getLost = makeShark;
    }
    if (this.flock.countActive() > 0) {
        let i = Phaser.Math.Between(0, this.flock.countActive() - 1);
        let x = this.flock.getChildren()[i].x;
        this.shark.moveTo(x, config.height);
    } else {
        this.shark.moveTo(game.input.mousePointer.x, config.height);
    };
    this.enemies.push(this.shark);
}


var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        }
    },
    scene: [ Starter ],
    numFish: 30,
    parent: "game",
    textStyle: { fontSize: '32px', fill: '#000', boundsAlignH: "center", boundsAlignV: "middle" }
};


function main() {
    game = new Phaser.Game(config);
}