var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fish', 'assets/poisson.png')
    this.load.image('background', 'assets/fond.png')
}

function create ()
{
    this.add.image(config.width/2, config.height/2, 'background')
    this.gameitems = this.physics.add.group()
    
    for (var i = 0; i < 30; i++) {
		var x = Phaser.Math.RND.between(config.width/3, 2*config.width/3);
		var y = Phaser.Math.RND.between(0, config.height/4);

        var newobj = this.gameitems.create(x, y, 'fish');
	}
}