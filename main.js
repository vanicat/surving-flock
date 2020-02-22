var config = {
    type: Phaser.AUTO,
    width: 870,
    height: 550,
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
    }
};

var game;

function main() {
    game = new Phaser.Game(config);
}

function preload ()
{
    this.load.image('fish', 'assets/poisson.png');
    this.load.image('background', 'assets/fond.png');
}

function create ()
{
    this.add.image(config.width/2, config.height/2, 'background');
    this.flock = this.physics.add.group();
    
    for (let i = 0; i < 30; i++) {
		let x = Phaser.Math.RND.between(config.width/3, 2*config.width/3);
		let y = Phaser.Math.RND.between(0, config.height/4);


        let newobj = this.flock.create(x, y, 'fish');

        newobj.setMaxVelocity(40);
    }
    flock(this.flock);
}

function update ()
{
    flock(this.flock);
}