ig.module(
    'game.entities.paddle'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityPaddle = ig.Entity.extend({
    
    size: {x:48, y:16},
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,
    speed: 300,
    maxVel: {
        x: 300,
        y: 300
    },
    
    
    animSheet: new ig.AnimationSheet('media/paddle.png', 48, 16),
    
    init: function( x, y, settings){
        this.parent( x, y, settings );
        
        this.addAnim( 'idle', 0.1, [0, 1, 2, 2, 2, 1, 0] );
        //console.log('Paddle initilised');
    },
    
    update: function(){
        
        if( ig.input.state('left') ) {
            this.vel.x = -Math.abs(this.speed);
        }
        else if( ig.input.state('right') ) {
            this.vel.x = this.speed;
        }
        else {
            this.vel.x = 0
        }
        
        this.parent();
        //var puck = ig.game.getEntitiesByType( EntityPuck )[0];
        
    }
    
})

});