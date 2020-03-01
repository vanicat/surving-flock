const MAXSPEED = 70;
const MAXFORCE = 10;
const DESIREDSEP = 20.0;

const NEIGHBORDIST = 100;
const CONTROLDIST = 200;

function boid_accel(boid, group) {
    // if (boid === group.children.entries[0]) debugger;
    let sep = separate(boid, group); // Separation
    let ali = align(boid, group); // Alignment
    let coh = cohesion(boid, group); // Cohesion
    let cont = control(boid);

    sep.scale(30);
    ali.scale(4);
    coh.scale(8);
    cont.scale(25);

    boid.body.acceleration.setToPolar(Phaser.Math.RND.angle(), Phaser.Math.RND.realInRange(0, 5));
    boid.body.acceleration.add(sep);

    boid.body.acceleration.add(ali);

    boid.body.acceleration.add(coh);
    boid.body.acceleration.add(cont);
}



function seek(boid, target) {
    let desired = new Phaser.Math.Vector2(boid.x, boid.y);
    desired.subtract(target);
    if (desired.length() === 0) {
        return desired;
    }

    desired.normalize();

    desired.scale(-MAXSPEED);

    let pull = desired;
    pull.subtract(boid.body.velocity.clone());

    limitVector(pull, MAXFORCE);
    // console.log(pull);  
    return pull;
}

function limitVector(pull, max) {
    if (pull.length() > max) {
        pull.normalize();
        pull.scale(max);
    }
}

function separate(boid, group) {
    let steer = new Phaser.Math.Vector2(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    group.children.iterate(function(other) {
        if (other !== boid) {
            let d = boid.body.position.distance(other.body.position);
            if ((d > 0) && (d < DESIREDSEP)) {
                let diff = boid.body.position.clone();
                diff.subtract(other.body.position);
                diff.normalize();
                diff.scale(1 / d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }
    });

    // Average -- divide by how many
    if (count > 0) {
        steer.scale(1 / count);
    }


    // As long as the vector is greater than 0
    if (steer.length() > 0) {
        // First two lines of code below could be condensed with new Phaser.Math.Vector2 setMag() method
        // Not using this method until Processing.js catches up
        // steer.setMag(maxspeed);

        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.scale(MAXSPEED);
        steer.subtract(boid.body.velocity);
        limitVector(steer, MAXFORCE);
    }
    return steer;
}

function align(boid, group) {
    let sum = new Phaser.Math.Vector2(0, 0);
    let count = 0;
    group.children.iterate(function(other) {
        let d = boid.body.position.distance(other.body.position);
        if ((d > 0) && (d < NEIGHBORDIST)) {
            sum.add(other.body.velocity);
            count++;
        }
    });
    if (count > 0) {
        sum.normalize();
        sum.scale(MAXSPEED);
        sum.subtract(boid.body.velocity);
        limitVector(sum, MAXFORCE);
        return sum;
    } else {
        return new Phaser.Math.Vector2(0, 0);
    }
}

function cohesion(boid, group) {
    let sum = new Phaser.Math.Vector2(0, 0); // Start with empty vector to accumulate all positions
    let count = 0;
    group.children.iterate(function(other) {
        let d = boid.body.position.distance(other.body.position);
        if ((d > 0) && (d < NEIGHBORDIST)) {
            sum.add(other.body.position); // Add position
            count++;
        }
    });
    if (count > 0) {
        sum.scale(1 / count);
        let s = seek(boid, sum);
        return s; // Steer towards the position
    } else {
        return new Phaser.Math.Vector2(0, 0);
    }
}

function control(boid) {
    let d = boid.body.position.distance(game.input.activePointer.position);
    if (d < CONTROLDIST) {
        let s = seek(boid, game.input.mousePointer.position);
        if (d < NEIGHBORDIST) {
            return new Phaser.Math.Vector2(s.y, -s.x);
        } else {
            return s;
        }
    } else {

        return new Phaser.Math.Vector2(0, 0);
    }
}

class Flock {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();
    }

    newFich(x, y) {
        let newobj = this.group.create(x, y, 'fish');
        newobj.setBounce(1);
        newobj.setScale(0.05);
        newobj.setCircle(newobj.width / 2);
    }

    update() {
        let me = this;
        this.group.children.iterate(function(boid) {
            boid_accel(boid, me.group);
        });

        let bounds = this.scene.bounds;
        this.boids.each(function(fish) {
            if (!bounds.contains(fish.x, fish.y)) {
                fish.destroy();
            }
        });
    }

    get boids() {
        return this.group.children;
    }

    get count() {
        return this.group.countActive();
    }
}
