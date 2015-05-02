ig.module(
    'game.entities.puck'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityPuck = ig.Entity.extend({
    
    size: {x:16, y:16},
    collides: ig.Entity.COLLIDES.ACTIVE,
    type: ig.Entity.TYPE.A,
    
    animSheet: new ig.AnimationSheet('media/puck.png', 16, 16),
    
    bounciness: 1,
    checkAgainst: ig.Entity.TYPE.B,
    speed: 200,
    //minBounceVelocity: 0,
    //gravityFactor: 0,
    maxVel: {
        x: 150,
        y: 250
    },
    
    launched: null,
    
    init: function( x, y, settings){
        this.parent( x, y, settings );
        
        this.addAnim( 'idle', 1, [0] );
        
        //this.vel.x  = -200;
        //this.vel.y  = 100;
    },
    
    update: function(){
        if ( this.launched == null ) {
            var paddle = ig.game.getEntitiesByType( EntityPaddle )[0];
            
            // Move the puck to above the paddle in the center of the paddle
            this.pos.x = paddle.pos.x + paddle.size.x/2 - 8 ;
            this.pos.y = paddle.pos.y - 16;
            
            if( ig.input.state('space') ) {
                this.launched   = true
                this.vel.y      = -6000;
            }
        }
        
        this.parent();
        
    },
    
    // Extend the collion layer hit functionality to ass SFX
    handleMovementTrace: function( res ) {
        
        //console.log(res);
        //ig.game.hitSfx.play();
    
        // Continue resolving the collision as normal
        this.parent(res); 
    },
    
    check: function( other ){
        /*
        if ( other instanceof EntityBrick ) {
            console.log('Brick hit');
            var bricks = ig.game.getEntitiesByType( EntityBrick );
            if ( !bricks ) {
                console.log('Out of bricks');
            }
            console.log( bricks );
        }
        */
    },
    
    collideWith: function(other, axis) {
        
        ig.game.hitSfx.play();
        
        if (axis === 'y' && other instanceof EntityPaddle) {
            this.vel.x = this.calculateAngle( other );
        }
        
    },
    
    calculateAngle: function( paddle ){        
        var magnitude = (this.distanceTo(paddle) - this.size.y / 2 - paddle.size.y / 2);
        // using ratio allows us to account for if the paddle changes sizes with powerups
        var ratio = magnitude / (paddle.size.x / 2) * 2.5;
        
        if(this.pos.x + this.size.x / 2 < paddle.pos.x + paddle.size.x / 2) {
                // send the ball to the left if hit on the left side of the paddle, and vice versa
                ratio = -ratio;
        }

        return this.speed * ratio;
    }
    
})

});