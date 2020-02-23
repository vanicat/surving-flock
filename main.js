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
    this.score = 0;

    this.add.image(config.width/2, config.height/2, 'background');
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.flock = this.physics.add.group();
    
    for (let i = 0; i < config.numFish; i++) {
        let x = config.width/2 + 50 * Math.sin(2 * Math.PI * i / config.numFish)
        let y = config.height/2 + 50 * Math.cos(2 * Math.PI * i / config.numFish)

        let newobj = this.flock.create(x, y, 'fish');

        newobj.setBounce(1);
        newobj.setCircle(newobj.width/2);
        newobj.setScale(0.05);
    }
    this.physics.add.collider(this.flock, this.flock)
    flock(this.flock);
    this.enemies = [];
    this.firstFiletTimer = this.time.addEvent({
        delay: 2000,
        callback: makeFilet,
        callbackScope: this
    })
}

function makeFilet() {
    if (! this.filet) {
        this.filet = new Filet(this);
    }
    this.filet.moveTo(-20, Phaser.Math.Between(0, config.height));
    this.enemies.push(this.filet);

}


function update (time, delta)
{
    flock(this.flock);
    for (let enemie of this.enemies) {
        enemie.capture(this.flock);
    }

    let world = this.physics.world
    this.enemies.filter(function (enemie) {return Phaser.Geom.Rectangle.Overlaps(world.bounds, enemie.getBounds())});
    remove_far(this, this.flock);
    this.score += this.flock.countActive() * delta/1000;
    this.scoreText.setText('Score: ' + Math.ceil(this.score));
}
