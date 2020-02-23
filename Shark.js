class Shark {
    constructor(world) {
        this.game = world;
        this.group = this.game.physics.add.group();

        let widget = this.game.physics.add.image(0, 0, "shark");
        this.widget = widget;
        this.group.add(widget);
        widget.setScale(0.5);
        widget.body.immovable = true;

        let bigrect = widget.getBounds();

        let body = this.createRect(widget, 150, 240, 218, 450);
        this.body = body;

        let mouth = this.createRect(widget, 170, 220, 198, 218);
        this.mouth = mouth;

        let leftJaw = this.createRect(widget, 158, 170, 190, 220);
        this.leftJaw = leftJaw;

        let rightJaw = this.createRect(widget, 220, 238, 190, 220);
        this.rightJaw = rightJaw;

        this.game.physics.add.collider(body, this.game.flock);
        this.game.physics.add.collider(leftJaw, this.game.flock);
        this.game.physics.add.collider(rightJaw, this.game.flock);

        //this.game.physics.add.collider(this.game.flock, widget);
        this.group.setVelocity(0, -190);
        widget.setBounce(0);

        // this.game.enemies.add(this.widget);
    }
    createRect(widget, left, right, top, bottom) {
        let leftProp = (left / 374 - 0.5) * widget.width;
        let rightProp = (right / 374 - 0.5) * widget.width;
        let topProp = (top / 604 - 0.5) * widget.height;
        let bottomProp = (bottom / 604 - 0.5) * widget.height;

        let x = (leftProp + rightProp) / 2
        let y = (topProp + bottomProp) / 2

        let rect = new Phaser.GameObjects.Rectangle(this.game, x, y, rightProp - leftProp, bottomProp - topProp);
        rect.depth = -1;
        rect.shift = { x: x, y: y}
        this.group.add(rect);
        rect.body.immovable = true;
        return rect;
    }

    capture(flock) {
        let mouth = this.mouth;
        flock.children.each(function (fish) {
            if (Phaser.Geom.Rectangle.Contains(mouth.getBounds(), fish.x, fish.y)) {
                fish.destroy()
            }
        });
    }
    moveTo(x, y) {
        this.widget.x = x;
        this.widget.y = y;

        for (let rect of [this.body, this.mouth, this.leftJaw, this.rightJaw]) {
            rect.x = x + rect.shift.x;
            rect.y = y + rect.shift.y;
        }
    }
    getBounds() {
        return this.widget.getBounds();
    }
}
