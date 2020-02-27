class Filet {
    constructor(world) {
        this.game = world;
        this.x = 0;
        this.y = config.height / 2;

        this.group = this.game.physics.add.group();

        let widget = this.game.physics.add.image(this.x, this.y, "filet"); // do it at random

        this.widget = widget;

        this.group.add(widget);


        widget.body.setVelocity(50, 0);
        widget.setScale(0.5);
        widget.logic = this;

        widget.body.immovable = true;

        let bigrect = widget.getBounds();

        let rect1 = new Phaser.GameObjects.Rectangle(this.game, bigrect.centerX, bigrect.top + 10, bigrect.width, 20);
        rect1.depth = -1;
        this.group.add(rect1);
        rect1.body.immovable = true;
        this.rect1 = rect1;

        let rect2 = new Phaser.GameObjects.Rectangle(this.game, bigrect.centerX, bigrect.bottom - 10, bigrect.width, 20);
        rect2.depth = -1;
        this.group.add(rect2);
        rect2.body.immovable = true;
        this.rect2 = rect2;

        let rect3 = new Phaser.GameObjects.Rectangle(this.game, bigrect.left + 10, bigrect.centerY, 20, bigrect.height);
        rect3.depth = -1;
        this.group.add(rect3);
        rect3.body.immovable = true;
        this.rect3 = rect3;

        this.game.physics.add.collider(rect1, this.game.flock);
        this.game.physics.add.collider(rect2, this.game.flock);
        this.game.physics.add.collider(rect3, this.game.flock);
        //this.game.physics.add.collider(this.game.flock, widget);

        this.group.setVelocity(50, 0);
        widget.setBounce(0);

        // this.game.enemies.add(this.widget);

    }

    capture(flock) {
        let filet = this;
        flock.children.iterate(function(fish) {
            if (Phaser.Geom.Rectangle.Contains(filet.widget.getBounds(), fish.x, fish.y)) {
                if (fish.body.acceleration.x < 0) {
                    fish.body.acceleration.x = 0;
                }
            }
        });
    }

    moveTo(x, y) {
        this.widget.x = x;
        this.widget.y = y;

        let bigrect = this.widget.getBounds();

        this.rect1.x = bigrect.centerX;
        this.rect1.y = bigrect.top + 10;

        this.rect2.x = bigrect.centerX;
        this.rect2.y = bigrect.bottom - 10;

        this.rect3.x = bigrect.left + 10;
        this.rect3.y = bigrect.centerY;
    }

    getBounds() {
        return this.widget.getBounds();
    }

}