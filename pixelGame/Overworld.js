class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }


    startGameLoop(){
        const step = () => {

            //Clearing the screen to avoid have character smears
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Establish the camera person
            const cameraPerson = this.map.gameObjects.cat;

            //Update all objects
            Object.values(this.map.gameObjects).forEach(object =>{
                object.update ({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            //Draw Lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);
            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a,b)=> {
                return a.y - b.y;
                }).forEach(object =>{
                object.sprite.draw(this.ctx, cameraPerson);
            })
            //Draw Lower layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindActionInput(){
        new KeyPressListener("Enter", () => {
            //Is there a person to talk to?
            this.map.checkForActionCutscene()
        })
    }


    init(){
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();

        this.bindActionInput();
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        // this.directionInput.direction; //Return "down"

        this.startGameLoop();

        // this.map.startCutscene([
        
        //     { who: "cat", type: "walk", direction: "down"},
        //     { who: "cat", type: "walk", direction: "down"},
        //     { who: "npcA", type: "walk", direction: "up"},
        //     { who: "npcA", type: "walk", direction: "left"},
        //     { who: "cat", type: "stand", direction: "right", time: 200},
        //     { type: "textMessage", text: "HELLO THERE!"}
        //     // { who: "npcA", type: "walk", direction: "left"},
        //     // { who: "npcA", type: "walk", direction: "left"},
        //     // { who: "npcA", type: "stand", direction: "up", time: 800 },
        // ])
    }
}