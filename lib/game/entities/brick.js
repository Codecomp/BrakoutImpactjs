ig.module(
    'game.entities.brick'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityBrick = ig.Entity.extend({
    
    size: {x:32, y:16},
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,
    
    animSheet: new ig.AnimationSheet('media/block.png', 32, 16),
    
    checkAgainst: ig.Entity.TYPE.A,
    health: 1,
    
    points: 100,
    
    init: function( x, y, settings){
        this.parent( x, y, settings );
        
        this.addAnim( 'idle', 1, [0] );
        
        //Add the animations fo different health levels
        this.addAnim( '1', 1, [0] );
        this.addAnim( '2', 1, [1] );
        this.addAnim( '3', 1, [2] );
        this.addAnim( '4', 1, [3] );
        this.addAnim( '5', 1, [4] );
        
        //Switch to the current starting helath of the block
        this.currentAnim = this.anims[this.health];
    },
    
    update: function(){
        
        this.parent();
        
    },
    
    check: function( other ){
        this.receiveDamage( 1 );
        //this.health = this.health -1;
        
        this.currentAnim = this.anims[this.health];
       
        if ( this.health < 1 ) {
            this.die();
        }
    },
    
    die: function(){
        ig.game.scoreSfx.play();
        ig.game.score += this.points;
        
        this.kill();
        
        if( !ig.game.getEntitiesByType( EntityBrick )[0] ){
            //console.log('Change level');
            ig.game.changeLevel();
        }
        
    }
    
})

});