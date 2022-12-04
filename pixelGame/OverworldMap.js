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
    DemoRoom:{
        lowerSrc: "images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x:utils.widthGrid(7),
                y:utils.widthGrid(6),
            }),
            // npcA: new Person({
            //     x:utils.widthGrid(7),
            //     y:utils.widthGrid(9),
            //     src: "images/characters/npc1.png",
            //     behaviorLoop: [
            //         {type: "stand", direction: "left", time:800},
            //         {type: "stand", direction: "up", time:800},
            //         {type: "stand", direction: "right", time:1200},
            //         {type: "stand", direction: "up", time: 300},
            //     ],
            //     talking: [
            //         {
            //             events: [
            //                 { type: "textMessage", text: "I'm busy..", faceHero: "npcA"},
            //                 { type: "textMessage", text: "Go away!"},
            //                 { who: "cat", type: "walk", direction: "up"}
            //             ]
            //         }
            //     ]

            // }),
            // npcB: new Person({
            //     x:utils.widthGrid(8),
            //     y:utils.widthGrid(5),
            //     src: "images/characters/npc2.png",
            //     // behaviorLoop:[
            //     //     {type: "walk", direction: "left"},
            //     //     {type: "stand", direction: "up", time: 800},
            //     //     {type: "walk", direction: "up"},
            //     //     {type: "walk", direction: "right"},
            //     //     {type: "walk", direction: "down"},
            //     // ]
            // }),
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
                        { type: "textMessage", text: "This is my witch's Room"},
                        { type: "textMessage", text: "I am not allowed in there..."},
                        { type: "textMessage", text: "...I'm positive they are not in there"},
                        { type: "textMessage", text: "I should look somewhere else"},
                        {who: "cat", type: "walk", direction: "down"},
                    ]
                }
            ],
            [utils.asGridCoord(2,6)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "left"},
                        { type: "textMessage", text: "My witch spends a long time studying"},
                        { type: "textMessage", text: "I hope to be a great witch like them someday"},
                    ]
                }
            ],
            [utils.asGridCoord(12,9)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "right"},
                        { type: "textMessage", text: "These books are too hard for me to read..."},
                        {who: "cat", type: "stand", direction: "up"},
                        { type: "textMessage", text: "Maybe my witch went to buy a book?"},
                        {who: "cat", type: "stand", direction: "left"},
                    ]
                }
            ],
            [utils.asGridCoord(2,11)] : [
                {
                    events: [
                        {who: "cat", type: "stand", direction: "left"},
                        { type: "textMessage", text: "My witch loves flowers..."},
                        { type: "textMessage", text: "...I think they are quite pointless to have in the house"},
                    ]
                }
            ],
            [utils.asGridCoord(5,12)] : [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen"}
                    ]
                }
            ]
        }
    },

    Kitchen:{
        lowerSrc: "images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        gameObjects:{
            cat: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(10),
                y: utils.widthGrid(5),
            }),
            npcB: new Person({
                x: utils.widthGrid(10),
                y: utils.widthGrid(8),
                src: "images/characters/npc3.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "You made it!", faceHero: "npcB"},
                        ]
                    }
                ]
            })
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(1,3)] : true, //Back Wall
            [utils.asGridCoord(2,3)] : true
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5,5)] : [
                {
                    events: [
                        { type: "changeMap", map: "DemoRoom"}
                    ]
                }
            ]
        }
    }
}