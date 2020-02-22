
      body {


var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    numFish: 30
};

var game;

function main() {
    game = new Phaser.Game(config);
}

function preload ()
{
    this.load.image('fish', 'assets/poisson-carre.png');
    this.load.image('filet', 'assets/filet1.png');
    this.load.image('background', 'assets/fond.png');
}

function create ()
{
    this.add.image(config.width/2, config.height/2, 'background');
    this.flock = this.physics.add.group();
    
    for (let i = 0; i < config.numFish; i++) {
        let x = config.width/2 + 50 * Math.sin(2 * Math.PI * i / config.numFish)
        let y = config.height/2 + 50 * Math.cos(2 * Math.PI * i / config.numFish)

        let newobj = this.flock.create(x, y, 'fish');

        newobj.setBounce(1);
        newobj.setCircle(newobj.width/2);
        newobj.setScale(0.5);
    }
    this.physics.add.collider(this.flock, this.flock)
    flock(this.flock);
    this.filet = new Filet(this);
    console.log(this.filet);
}

function update ()
{
    flock(this.flock);
}
