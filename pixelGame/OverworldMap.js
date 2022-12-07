class OverworldMap{
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};


        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(
            this.lowerImage, 
            utils.widthGrid(10.5) - cameraPerson.x,
            utils.widthGrid(6) - cameraPerson.y
            )
    }
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(
            this.upperImage,
            utils.widthGrid(10.5) - cameraPerson.x,
            utils.widthGrid(6) - cameraPerson.y
            )
    }

    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach (key =>{
            
            let object = this.gameObjects[key];
            object.id = key;

            //TODO: determine if this object should actually mount
            object.mount(this);
        })
    }

    async startCutscene(events){
        this.isCutscenePlaying = true;

        for (let i=0; i < events.length; i++){
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;
        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

  

    checkForActionCutscene() {
        const cat = this.gameObjects["cat"];
        const nextCoords = utils.nextPosition(cat.x, cat.y,cat.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`
        });
        if(!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene(){
        const cat = this.gameObjects["cat"];
        const match = this.cutsceneSpaces[ `${cat.x},${cat.y}` ];
        if (!this.isCutscenePlaying && match){
            this.startCutscene( match[0].events )
        }
    }

    addWall(x,y){
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y){
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }
}


window.OverworldMaps ={
    Main:{
        lowerSrc: "images/maps/MainLower.png",
        upperSrc: "images/maps/MainUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x:utils.widthGrid(7),
                y:utils.widthGrid(6),
            }),
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(1,3)] : true, //Back Wall
            [utils.asGridCoord(2,3)] : true,
            [utils.asGridCoord(3,3)] : true,
            [utils.asGridCoord(4,3)] : true,
            [utils.asGridCoord(5,3)] : true,
            [utils.asGridCoord(6,3)] : true,
            [utils.asGridCoord(7,3)] : true,
            [utils.asGridCoord(8,3)] : true,
            [utils.asGridCoord(9,2)] : true, //Door
            [utils.asGridCoord(10,3)] : true,

            [utils.asGridCoord(11,3)] : true, //left walls
            [utils.asGridCoord(11,4)] : true,
            [utils.asGridCoord(11,5)] : true,
            [utils.asGridCoord(11,6)] : true,
            [utils.asGridCoord(11,7)] : true,
            //[utils.asGridCoord(11,8)] : true,

            [utils.asGridCoord(12,7)] : true,
            [utils.asGridCoord(13,7)] : true,

            [utils.asGridCoord(13,8)] : true, //Left books
            [utils.asGridCoord(13,9)] : true,
            [utils.asGridCoord(13,10)] : true,
            [utils.asGridCoord(13,11)] : true,
            [utils.asGridCoord(13,12)] : true,

            [utils.asGridCoord(12,12)] : true, //Bottom
            [utils.asGridCoord(11,12)] : true,
            [utils.asGridCoord(10,12)] : true,
            [utils.asGridCoord(9,12)] : true,
            [utils.asGridCoord(8,12)] : true,
            [utils.asGridCoord(7,12)] : true,
            [utils.asGridCoord(6,12)] : true,

            [utils.asGridCoord(5,13)] : true,
            [utils.asGridCoord(4,12)] : true,
            [utils.asGridCoord(3,12)] : true,
            [utils.asGridCoord(2,12)] : true,
            [utils.asGridCoord(1,12)] : true,
            [utils.asGridCoord(0,12)] : true,

            [utils.asGridCoord(0,11)] : true, //Right Side
            [utils.asGridCoord(0,10)] : true,
            [utils.asGridCoord(0,9)] : true,
            [utils.asGridCoord(0,8)] : true,
            [utils.asGridCoord(1,7)] : true,
            [utils.asGridCoord(1,6)] : true,
            [utils.asGridCoord(1,5)] : true,
            [utils.asGridCoord(0,4)] : true,

            [utils.asGridCoord(5,6)] : true, //Pot
            [utils.asGridCoord(4,6)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(9,3)] : [
                {
                    events: [
                        { type: "textMessage", text: "Cat: This is my witch's room."},
                        { type: "textMessage", text: "Cat: I am not allowed in there..."},
                        { type: "textMessage", text: "Cat: ...I'm positive they are not in there."},
                        { type: "textMessage", text: "Cat: I should look somewhere else."},
                        {who: "cat", type: "walk", direction: "down"},
                    ]
                }
            ],
            [utils.asGridCoord(2,6)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "left"},
                        { type: "textMessage", text: "Cat: My witch spends a long time studying."},
                        { type: "textMessage", text: "Cat: I hope to be a great witch like them someday."},
                    ]
                }
            ],
            [utils.asGridCoord(12,9)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "right"},
                        { type: "textMessage", text: "Cat: These books are too hard for me to read..."},
                        {who: "cat", type: "stand", direction: "up"},
                        { type: "textMessage", text: "Cat: Maybe my witch went to buy a book?"},
                        {who: "cat", type: "stand", direction: "left"},
                    ]
                }
            ],
            [utils.asGridCoord(2,11)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "left"},
                        { type: "textMessage", text: "Cat: My witch loves flowers..."},
                        { type: "textMessage", text: "Cat: ...I think they are quite pointless to have in the house."},
                    ]
                }
            ],
            [utils.asGridCoord(5,12)] : [
                {
                    events: [
                        { type: "changeMap", map: "SouthForest"}
                    ]
                }
            ]
        }
    },
    NorthForest:{
        lowerSrc: "images/maps/NorthForestLower.png",
        upperSrc: "images/maps/LibraryUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(27),
                y: utils.widthGrid(21),
            }),
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(25,19)] : true, //Back Wall
            [utils.asGridCoord(26,19)] : true,
            [utils.asGridCoord(27,19)] : true,
            [utils.asGridCoord(28,19)] : true,
            [utils.asGridCoord(29,19)] : true,

            [utils.asGridCoord(29,20)] : true,
            [utils.asGridCoord(29,21)] : true,
            [utils.asGridCoord(29,22)] : true,
            [utils.asGridCoord(29,23)] : true,

            [utils.asGridCoord(28,23)] : true,
            [utils.asGridCoord(27,23)] : true,
            [utils.asGridCoord(26,23)] : true,
            [utils.asGridCoord(25,23)] : true,
            [utils.asGridCoord(24,23)] : true,
            [utils.asGridCoord(23,23)] : true,
            [utils.asGridCoord(22,23)] : true,
            [utils.asGridCoord(21,23)] : true,
            [utils.asGridCoord(20,23)] : true,

            [utils.asGridCoord(20,22)] : true,
            [utils.asGridCoord(19,22)] : true,

            [utils.asGridCoord(19,21)] : true,
            [utils.asGridCoord(18,21)] : true,
            [utils.asGridCoord(17,21)] : true,

            [utils.asGridCoord(17,20)] : true,

            [utils.asGridCoord(17,19)] : true,
            [utils.asGridCoord(17,18)] : true,

            [utils.asGridCoord(18,18)] : true,
            [utils.asGridCoord(19,18)] : true,
            [utils.asGridCoord(20,18)] : true,

            [utils.asGridCoord(22,18)] : true,
            [utils.asGridCoord(23,18)] : true,
            [utils.asGridCoord(24,18)] : true,
            [utils.asGridCoord(25,18)] : true,

            [utils.asGridCoord(21,17)] : true,



        },
        cutsceneSpaces: {
            [utils.asGridCoord(21,18)] : [
                {
                    events: [
                        { type: "changeMap", map: "Library"}
                    ]
                }
            ],
            [utils.asGridCoord(27,21)] : [
                {
                    events: [
                        { type: "changeMap", map: "SouthForest"}
                    ]
                }
            ]
        }
    },
    SouthForest:{
        lowerSrc: "images/maps/SouthForestLower.png",
        upperSrc: "images/maps/SouthForestUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(15),//utils.widthGrid(0)252
                y: utils.widthGrid(19),//utils.widthGrid(0)300,
            }),
            swampy: new Person({
                x: utils.widthGrid(44.5),
                y: utils.widthGrid(45),
                src: "images/characters/swampy.png",
                behaviorLoop:[
                    {type: "stand", direction: "down", time: 800},
                    {type: "stand", direction: "left", time: 800},
                ],
            }),
            shadowy: new Person({
                x: utils.widthGrid(61), 
                y: utils.widthGrid(12), 
                src: "images/characters/shadowy.png",
                behaviorLoop:[
                    {type: "stand", direction: "down", time: 1400},
                    {type: "stand", direction: "right", time: 1400},
                ],
            })
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(7,17)] : true, //Main House + fence
            [utils.asGridCoord(8,17)] : true,
            [utils.asGridCoord(9,17)] : true,
            [utils.asGridCoord(10,17)] : true,
            [utils.asGridCoord(11,17)] : true,
            [utils.asGridCoord(12,17)] : true,
            [utils.asGridCoord(13,17)] : true,
            [utils.asGridCoord(14,17)] : true,

            [utils.asGridCoord(14,18)] : true,
            [utils.asGridCoord(14,19)] : true,
            [utils.asGridCoord(16,18)] : true,
            [utils.asGridCoord(16,19)] : true,

            [utils.asGridCoord(15,17)] : true,
            [utils.asGridCoord(16,17)] : true,
            [utils.asGridCoord(17,17)] : true,
            [utils.asGridCoord(18,17)] : true,
            [utils.asGridCoord(19,17)] : true,
            [utils.asGridCoord(20,17)] : true,
            [utils.asGridCoord(21,17)] : true,
            [utils.asGridCoord(22,17)] : true,
            [utils.asGridCoord(23,17)] : true,
            [utils.asGridCoord(24,17)] : true,
            [utils.asGridCoord(25,17)] : true,
            [utils.asGridCoord(26,17)] : true,
            [utils.asGridCoord(27,17)] : true,
            [utils.asGridCoord(28,17)] : true,
            [utils.asGridCoord(29,17)] : true,
            [utils.asGridCoord(30,17)] : true,
            [utils.asGridCoord(31,17)] : true,
            [utils.asGridCoord(32,17)] : true,
            [utils.asGridCoord(33,17)] : true,

            [utils.asGridCoord(33,18)] : true,
            [utils.asGridCoord(33,19)] : true,
            [utils.asGridCoord(33,20)] : true,
            [utils.asGridCoord(33,21)] : true,
            [utils.asGridCoord(33,22)] : true,
            [utils.asGridCoord(33,23)] : true,
            [utils.asGridCoord(33,24)] : true,
            [utils.asGridCoord(33,25)] : true,
            [utils.asGridCoord(33,26)] : true,
            [utils.asGridCoord(33,27)] : true,

            [utils.asGridCoord(32,27)] : true,
            [utils.asGridCoord(31,27)] : true,
            [utils.asGridCoord(30,27)] : true,
            [utils.asGridCoord(29,27)] : true,
            [utils.asGridCoord(28,27)] : true,
            [utils.asGridCoord(27,27)] : true,
            [utils.asGridCoord(26,27)] : true,
            [utils.asGridCoord(25,27)] : true,
            [utils.asGridCoord(24,27)] : true,
            [utils.asGridCoord(23,27)] : true,
            [utils.asGridCoord(22,27)] : true,
            [utils.asGridCoord(21,27)] : true,
            [utils.asGridCoord(20,27)] : true,
            [utils.asGridCoord(19,27)] : true,
            [utils.asGridCoord(18,27)] : true,
            [utils.asGridCoord(17,27)] : true,

            [utils.asGridCoord(13,27)] : true,
            [utils.asGridCoord(12,27)] : true,
            [utils.asGridCoord(11,27)] : true,
            [utils.asGridCoord(10,27)] : true,
            [utils.asGridCoord(9,27)] : true,
            [utils.asGridCoord(8,27)] : true,
            [utils.asGridCoord(7,27)] : true,

            [utils.asGridCoord(7,27)] : true,
            [utils.asGridCoord(7,26)] : true,
            [utils.asGridCoord(7,25)] : true,
            [utils.asGridCoord(7,24)] : true,
            [utils.asGridCoord(7,23)] : true,
            [utils.asGridCoord(7,22)] : true,
            [utils.asGridCoord(7,21)] : true,
            [utils.asGridCoord(7,20)] : true,
            [utils.asGridCoord(7,19)] : true,
            [utils.asGridCoord(7,18)] : true, // End of house and fence
        
            [utils.asGridCoord(30,19)] : true,
            [utils.asGridCoord(31,19)] : true,
            [utils.asGridCoord(32,19)] : true,
            [utils.asGridCoord(31,18)] : true,

            [utils.asGridCoord(42,41)] : true, // 
            [utils.asGridCoord(41,41)] : true,
            [utils.asGridCoord(40,41)] : true,
            [utils.asGridCoord(39,41)] : true,
            [utils.asGridCoord(38,41)] : true,
            [utils.asGridCoord(37,41)] : true,

            [utils.asGridCoord(42,41)] : true,
            [utils.asGridCoord(42,42)] : true,
            [utils.asGridCoord(42,43)] : true,
            [utils.asGridCoord(42,44)] : true,
            [utils.asGridCoord(42,45)] : true,
            [utils.asGridCoord(42,46)] : true,

            [utils.asGridCoord(43,46)] : true,
            [utils.asGridCoord(44,46)] : true,
            [utils.asGridCoord(45,46)] : true,
            [utils.asGridCoord(46,46)] : true,
            [utils.asGridCoord(47,46)] : true,

            [utils.asGridCoord(47,45)] : true,
            [utils.asGridCoord(47,44)] : true,
            [utils.asGridCoord(47,43)] : true,
            [utils.asGridCoord(47,42)] : true,
            [utils.asGridCoord(47,41)] : true,

            [utils.asGridCoord(48,40)] : true,



        },
        cutsceneSpaces: {
            [utils.asGridCoord(15,19)] : [
                {
                    events: [
                        { type: "changeMap", map: "Main"}
                    ]
                }
            ],
            [utils.asGridCoord(48,23)] : [
                {
                    events: [
                        { type: "changeMap", map: "NorthForest"}
                    ]
                }
            ],
            [utils.asGridCoord(44,44)] : [
                {
                    events: [
                        { type: "textMessage", text: "Swampy: You are looking for your witch?"},
                        { type: "textMessage", text: "Swampy: Sorry, I don't know..."},
                        { type: "textMessage", text: "Swampy: Keep following the path to the East, then North..."},
                        { type: "textMessage", text: "Swampy: You'll find the shadow, maybe he'll know."},
                        {who: "cat", type: "walk", direction: "up"},
                    ]
                }
            ],
            [utils.asGridCoord(45,44)] : [
                {
                    events: [
                        { type: "textMessage", text: "Swampy: You are looking for your witch?"},
                        { type: "textMessage", text: "Swampy: Sorry, I don't know..."},
                        { type: "textMessage", text: "Swampy: Keep following the path to the East, then North..."},
                        { type: "textMessage", text: "Swampy: You'll find the shadow, maybe he'll know."},
                        {who: "cat", type: "walk", direction: "up"},
                    ]
                }
            ],
            [utils.asGridCoord(62,12)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "left"},
                        { type: "textMessage", text: "Shadow: Mhmmmm?"},
                        { type: "textMessage", text: "Shadow: Your witch? I recall seeing them go through that portal..."},
                        { type: "textMessage", text: "Shadow: You know, the one South West of here? Just follow the path to the left."},
                        { type: "textMessage", text: "Shadow: Good luck!"},
                    ]
                }
            ],
            [utils.asGridCoord(15,27)] : [
                {
                    events: [
                        { type: "textMessage", text: "Cat: I should go to the dock to find Swampy, maybe they will know where my witch is."},
                        { type: "textMessage", text: "Cat: I just need to follow the path to the lake."},
                    ]
                }
            ],
            [utils.asGridCoord(14,27)] : [
                {
                    events: [
                        { type: "textMessage", text: "Cat: I should go to the dock to find Swampy, maybe they will know where my witch is."},
                        { type: "textMessage", text: "Cat: I just need to follow the path to the lake."},
                    ]
                }
            ],
            [utils.asGridCoord(16,27)] : [
                {
                    events: [
                        { type: "textMessage", text: "Cat: I should go to the dock to find Swampy, maybe they will know where my witch is."},
                        { type: "textMessage", text: "Cat: I just need to follow the path to the lake."},
                    ]
                }
            ],
        }
    },
    Library:{
        lowerSrc: "images/maps/LibraryLower.png",
        upperSrc: "images/maps/LibraryUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(12),
                y: utils.widthGrid(14),
            }),
            wizard: new Person({
                x: utils.widthGrid(9),
                y: utils.widthGrid(8),
                src: "images/characters/wizard.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "You made it!"},
                        ]
                    }
                ]
            })
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(1,6)] : true, //Back Wall
            [utils.asGridCoord(2,6)] : true,
            [utils.asGridCoord(3,6)] : true,
            [utils.asGridCoord(4,6)] : true,
            [utils.asGridCoord(5,6)] : true,
            [utils.asGridCoord(6,6)] : true,
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(9,6)] : true,
            [utils.asGridCoord(10,6)] : true,
            [utils.asGridCoord(11,6)] : true,
            [utils.asGridCoord(12,6)] : true,

            [utils.asGridCoord(12,5)] : true,
            [utils.asGridCoord(12,4)] : true,

            [utils.asGridCoord(13,4)] : true,
            [utils.asGridCoord(14,4)] : true,
            [utils.asGridCoord(15,4)] : true,
            [utils.asGridCoord(16,4)] : true,
            [utils.asGridCoord(17,4)] : true,
            [utils.asGridCoord(18,4)] : true,
            [utils.asGridCoord(19,4)] : true,

            [utils.asGridCoord(19,5)] : true,
            [utils.asGridCoord(19,6)] : true,
            [utils.asGridCoord(19,7)] : true,
            [utils.asGridCoord(19,8)] : true,
            [utils.asGridCoord(19,9)] : true,
            [utils.asGridCoord(19,10)] : true,
            [utils.asGridCoord(19,11)] : true,
            [utils.asGridCoord(19,12)] : true,
            [utils.asGridCoord(19,13)] : true,
            [utils.asGridCoord(19,14)] : true,

            [utils.asGridCoord(18,14)] : true,
            [utils.asGridCoord(17,14)] : true,
            [utils.asGridCoord(16,14)] : true,
            [utils.asGridCoord(15,14)] : true,
            [utils.asGridCoord(14,14)] : true,
            [utils.asGridCoord(13,14)] : true,

            [utils.asGridCoord(12,15)] : true,

            [utils.asGridCoord(11,14)] : true,
            [utils.asGridCoord(10,14)] : true,
            [utils.asGridCoord(9,14)] : true,
            [utils.asGridCoord(8,14)] : true,
            [utils.asGridCoord(7,14)] : true,
            [utils.asGridCoord(6,14)] : true,
            [utils.asGridCoord(5,14)] : true,
            [utils.asGridCoord(4,14)] : true,
            [utils.asGridCoord(3,14)] : true,
            [utils.asGridCoord(2,14)] : true,
            [utils.asGridCoord(1,14)] : true,
            [utils.asGridCoord(0,14)] : true,
            
            [utils.asGridCoord(0,14)] : true,
            [utils.asGridCoord(0,13)] : true,
            [utils.asGridCoord(0,12)] : true,
            [utils.asGridCoord(0,11)] : true,
            [utils.asGridCoord(0,10)] : true,
            [utils.asGridCoord(0,9)] : true,
            [utils.asGridCoord(0,8)] : true,
            [utils.asGridCoord(0,7)] : true,

            [utils.asGridCoord(3,10)] : true, //Table
            [utils.asGridCoord(4,10)] : true,
            [utils.asGridCoord(5,10)] : true,
            [utils.asGridCoord(6,10)] : true,
            [utils.asGridCoord(6,9)] : true,
            [utils.asGridCoord(5,9)] : true,
            [utils.asGridCoord(4,9)] : true,
            [utils.asGridCoord(3,9)] : true,

            [utils.asGridCoord(14,9)] : true,
            [utils.asGridCoord(15,9)] : true,
            [utils.asGridCoord(16,9)] : true,
            [utils.asGridCoord(17,9)] : true,
            [utils.asGridCoord(18,9)] : true,


           
        },
        cutsceneSpaces: {
            [utils.asGridCoord(12,14)] : [
                {
                    events: [
                        { type: "changeMap", map: "NorthForest"}
                    ]
                }
            ],
            [utils.asGridCoord(12,13)] : [
                {
                    events: [
                        {who: "wizard", type: "walk", direction: "down"},
                        {who: "wizard", type: "walk", direction: "down"},
                        {who: "wizard", type: "walk", direction: "down"},
                        {who: "wizard", type: "walk", direction: "down"},
                        { type: "textMessage", text: "Witch: You made it!"},
                        { type: "textMessage", text: "Witch: Happy birthday my apprentice!"},
                        { type: "textMessage", text: "Witch: I'm glad to have you as my partner, thank you!"},
                        {who: "wizard", type: "walk", direction: "up"},
                        {who: "wizard", type: "walk", direction: "up"},
                        {who: "wizard", type: "walk", direction: "up"},
                        {who: "wizard", type: "walk", direction: "up"},
                        {who: "wizard", type: "stand", direction: "down"},
                    ]
                }
            ],
        }
    },
}