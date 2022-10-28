class OverworldMap{
    constructor(config){
        this.gameObjects = config.gameObjects;
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
                x:utils.widthGrid(5),
                y:utils.widthGrid(6),
            }),
            npcA: new Person({
                x:utils.widthGrid(7),
                y:utils.widthGrid(9),
                src: "images/characters/npc1.png",
                behaviorLoop: [
                    {type: "stand", direction: "left", time:800},
                    {type: "stand", direction: "up", time:800},
                    {type: "stand", direction: "right", time:1200},
                    {type: "stand", direction: "up", time: 300},
                ]
            }),
            npcB: new Person({
                x:utils.widthGrid(3),
                y:utils.widthGrid(7),
                src: "images/characters/npc2.png",
                behaviorLoop:[
                    {type: "walk", direction: "left"},
                    {type: "stand", direction: "up", time: 800},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "right"},
                    {type: "walk", direction: "down"},
                ]
            }),
        },
        walls: {
            //"16, 16" : true
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        }
    },

    Kitchen:{
        lowerSrc: "images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        gameObjects:{
            cat: new GameObject({
                x:3,
                y:5,
            }),
            npcA: new GameObject({
                x:9,
                y:6,
                src: "images/characters/npc2.png",
            }),
            npcB: new GameObject({
                x:10,
                y:8,
                src: "images/characters/npc3.png",
            }),
        }
    }
}