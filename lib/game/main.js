ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.puck',
	'game.entities.paddle',
	'game.entities.brick',
	'game.entities.goal',
	
	'game.levels.test',
	'game.levels.introduction',
	'game.levels.gameOver',
	'game.levels.stageOne',
	'game.levels.stageTwo',
	'game.levels.stageThree'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	// Set the starting score
	score: 0,
	lives: 3,
	
	// Setup the leveles
	currentStage: 0,
	gameStages: [/*
		'test',
		'test',
		'test',*/
		'stageOne',
		'stageTwo',
		'stageThree'
	],
	
	bgm: null,
	gameoverBgm: null,
	hitSfx: null,
	goalSfx: null,
	scoreSfx: null,
	
	lifegraphic: new ig.Image( 'media/life.png' ),
	logo: new ig.Image( 'media/logo.png' ),
	
	introduction: true,
	gameEnded: null,
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.LEFT_ARROW, 	'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW,	'right');
		ig.input.bind( ig.KEY.SPACE, 		'space');
		ig.input.bind( ig.KEY.ENTER, 		'enter');
		
		this.loadLevel( LevelIntroduction );
		//this.changeLevel();
		
		this.bgm 	= new ig.Sound( 'media/sounds/anotherretrotune.*' );
		this.gameoverBgm= new ig.Sound( 'media/sounds/ThisIsFairlyChill_2.*' );
		this.hitSfx 	= new ig.Sound( 'media/sounds/hit.*' );
		this.goalSfx 	= new ig.Sound( 'media/sounds/goal.*' );
		this.scoreSfx 	= new ig.Sound( 'media/sounds/score.*' );
		
		this.bgm.play();
	},
	
	changeLevel: function( ){
		//Calculate the next level required looping back to the first
		var nextLevel = this.currentStage + 1;
		
		if ( nextLevel > (this.gameStages.length - 1) ){
			nextLevel = 0;
		}
		console.log(this.gameStages.length);
		console.log('Next level: '+nextLevel);
		
		// Make sure the name is formatted correctly
		var levelName = this.gameStages[ nextLevel ].replace(/^(Level)?(\w)(\w*)/,
		function( m, l, a, b ) {
			return a.toUpperCase() + b;
		});
		
		//Load the level after the end of the game update loop
		ig.game.loadLevelDeferred( ig.global['Level'+levelName] );
		
		this.currentStage = nextLevel;
	},
	
	loadLevel: function( data ){
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;
		
		// Call the parent implemenation; this creates the background
		// maps and entities.
		this.parent( data );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		if ( this.introduction && ig.input.state('enter')){
			this.introduction = null;
			ig.game.loadLevelDeferred( LevelStageOne );
		} else if ( this.lives < 0 && this.gameEnded == null ) {
			ig.game.loadLevelDeferred( LevelGameOver );
		}
		
		/*
		if ( this.introduction == null && this.gameEnded == null ){
			console.log('Game is running now');
		}
		if ( this.introduction == null && !this.getEntitiesByType( EntityBrick )[0] ){
			console.log('Change level');
			//this.changeLevel();
		}
		*/

	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
		var 	x = ig.system.width/2,
			y = ig.system.height/2;
		
		if ( this.lives < 0 ) {			
			this.gameover();
		} else if ( this.introduction ){
			this.logo.draw( x/2, 100 );
			
			this.font.draw( 'Move left: LEFT', ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Move right: RIGHT', ig.system.width/2, ig.system.height/2 + 10, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Launch puck: SPACE', ig.system.width/2, ig.system.height/2 + 20, ig.Font.ALIGN.CENTER );
			
			this.font.draw( 'Press ENTER to start', ig.system.width/2, ig.system.height/2 + 42, ig.Font.ALIGN.CENTER );
		}
		else {
			//Draw the lives on screen
			for( i=0; i<this.lives; i++ ){
				this.lifegraphic.draw( i * 16 + 18, 4);
				//console.log('life '+i);
			}
			// Draw the score on the screen
			this.font.draw( this.score, 472, 8, ig.Font.ALIGN.RIGHT );
		}
	},
	
	gameover: function(){
		// Run the game over events once
		if ( this.gameEnded == null) {
			this.gameEnded = true;
			
			//Stop the Background music
			this.bgm.stop();
			//Play the end game music
			this.gameoverBgm.play();
		}
		
		//Display game over message
		this.font.draw( 'GAME OVER', ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER );
		this.font.draw( 'score: '+this.score, ig.system.width/2, ig.system.height/2 + 32, ig.Font.ALIGN.CENTER );
		this.font.draw( 'Press ENTER to restart', ig.system.width/2, ig.system.height/2 + 42, ig.Font.ALIGN.CENTER );
		
		if( ig.input.state('enter') ) {
			// Reset the Game
			this.currentStage	= 0;
			this.score 		= 0;
			this.lives 		= 3;
			
			this.gameEnded = null;
			
			this.gameoverBgm.stop();
			this.bgm.play();
			
			ig.game.loadLevelDeferred( LevelStageOne );
		}
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 480, 320, 2 );

});
