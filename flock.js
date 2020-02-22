const MAXSPEED = 30;
const MAXFORCE = 10;
const DESIREDSEP = 20.0;

const NEIGHBORDIST = 50;
const CONTROLDIST = 1000;

function multArray(a, x) {
    for (let i = 0; i<a.length; i++) {
        a[i].scale(x);
    }
}

function addArray(a, b) {
    for (let i = 0; i<a.length; i++) {
        a[i].add(b[i]);
    }
}

function boid_accel(boid, group) {
    //if (boid === group.children.entries[0]) debugger;
    let sep = separate(boid, group);   // Separation
    let ali = align(boid, group);      // Alignment
    let coh = cohesion(boid, group);   // Cohesion
    let cont = control(boid);

    sep.scale(10);
    ali.scale(4);
    coh.scale(5);
    cont.scale(20);

    boid.body.setAcceleration(0);
    boid.body.acceleration.add(sep);
    
    boid.body.acceleration.add(ali);
    
    boid.body.acceleration.add(coh);
    boid.body.acceleration.add(cont);
    
    // console.log(boid.body.acceleration);

    // let force = new Phaser.Math.Vector2(0, 0);
    // force.add(sep);
    // force.add(ali);
    // force.add(coh);

    // boid.setAcceleration(force[0], force[1]);    
}


function flock(group) {
    group.children.iterate(function(boid) {
        boid_accel(boid, group);
    });
}

function seek(boid, target) {
    let desired = new Phaser.Math.Vector2(boid.x, boid.y);
    desired.subtract(target);
    if(desired.length() === 0) {
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
    group.children.iterate(function (other) {
        if (other !== boid) {
            let d = boid.body.position.distance(other.body.position);
            if ((d < DESIREDSEP)) {
                let diff = new Phaser.Math.Vector2();
                diff.copy(boid.body.position);
                diff.subtract(other.body.position);
                diff.normalize();
                diff.scale(1/d);        // Weight by distance
                steer.add(diff);
                count++;            // Keep track of how many
            }
        }
    });

    // Average -- divide by how many
    if (count > 0) {
      steer.scale(1/count);
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
      limitVector(steer,MAXFORCE);
    }
    return steer;
}

function align(boid, group) {
    let sum = new Phaser.Math.Vector2(0, 0);
    let count = 0;
    group.children.iterate(function(other) {
        d = boid.body.position.distance(other.body.position);
        if ((d > 0) && (d < NEIGHBORDIST)) {
            sum.add(other.body.velocity);
            count++;
        }
    })
    if (count > 0) {
        sum.normalize();
        sum.scale(MAXSPEED);
        sum.subtract(boid.body.velocity);
        limitVector(sum, MAXFORCE);
        return sum;
    } 
    else {
        return new Phaser.Math.Vector2(0, 0);
    }
}

function cohesion(boid, group) {
    let sum = new Phaser.Math.Vector2(0, 0);   // Start with empty vector to accumulate all positions
    let count = 0;
    group.children.iterate(function (other) {
        let d = boid.body.position.distance(other.body.position);
        if ((d > 0) && (d < NEIGHBORDIST)) {
            sum.add(other.body.position); // Add position
            count++;
        }
    });
    if (count > 0) {
        sum.scale(1/count);
        let s = seek(boid, sum); 
        return s;  // Steer towards the position
    } else {
        return new Phaser.Math.Vector2(0, 0);
    }
}

function control(boid) {
    let d = boid.body.position.distance(game.input.pointers[0].position);
    return seek(boid, game.input.pointers[0].position);
    if (d < CONTROLDIST) {
        return seek(boid, game.input.pointers[0].position);
    }  else {
        return new Phaser.Math.Vector2(0, 0);
    }
}