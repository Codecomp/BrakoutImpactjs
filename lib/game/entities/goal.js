ig.module(
    'game.entities.goal'
)
.requires(
    'impact.entity',
    'impact.font'
)
.defines(function(){

EntityGoal = ig.Entity.extend({
    
    _wmDrawBox: true,
    _wmScalable: true,
    _wmBoxColor: 'rgba(255, 0, 0, 0.5)',
    
    checkAgainst: ig.Entity.TYPE.A,
    
    message: 'Watch out!',
    goalTimer: null,
    font: new ig.Font('media/04b03.font.png'),
    
    update: function(){},
    
    check: function( other ){
        ig.game.goalSfx.play();
        
        ig.game.lives -= 1;
        console.log( 'lives: '+ig.game.lives );
        
        this.goalTimer = new ig.Timer( 2 );
        
        var puck = ig.game.getEntitiesByType( EntityPuck )[0];
        puck.launched   = null;
        puck.vel.x      = 0;
        puck.vel.y      = 0;
    },
    
    draw: function(){
        if ( this.goalTimer && this.goalTimer.delta() < 0 ){
            this.font.draw( this.message, ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER );
        }
        
    }
    
})

});