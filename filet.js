class Filet {
    constructor (world) {
        this.game = world;
        this.x = 0;
        this.y = config.height/2;

        this.group = this.game.physics.add.group();

        let widget = this.game.physics.add.image(this.x, this.y, "filet"); // do it at random
        this.group.add(widget);


        widget.body.setVelocity(50,0);
        widget.setScale(0.5);
        widget.logic = this;

        widget.body.immovable = true

        let bigrect = widget.getBounds();

        let rect1 = new Phaser.GameObjects.Rectangle(this.game, bigrect.centerX, bigrect.top+10, bigrect.width, 20);
        rect1.depth = -1;
        this.group.add(rect1);
        rect1.body.immovable = true;
        
        let rect2 = new Phaser.GameObjects.Rectangle(this.game, bigrect.centerX, bigrect.bottom-10, bigrect.width, 20);
        rect2.depth = -1;
        this.group.add(rect2);
        rect2.body.immovable = true;

        let rect3 = new Phaser.GameObjects.Rectangle(this.game, bigrect.left + 10, bigrect.centerY, 20, bigrect.height);
        rect3.depth = -1;
        this.group.add(rect3);
        rect3.body.immovable = true;

        this.game.physics.add.collider(rect1, this.game.flock);
        this.game.physics.add.collider(rect2, this.game.flock);
        this.game.physics.add.collider(rect3, this.game.flock);
        //this.game.physics.add.collider(this.game.flock, widget);
        
        this.group.setVelocity(50, 0);
        widget.setBounce(0);

        // this.game.enemies.add(this.widget);
        
    }


}
