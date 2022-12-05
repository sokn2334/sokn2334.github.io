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

    bindCatPositionCheck(){
        document.addEventListener("PersonWalkingComplete", e => {
            if(e.detail.whoId === "cat") {
                //Cat's position has changed
                this.map.checkForFootstepCutscene()
            }
        })
    }


    startMap(mapConfig){
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init(){
        this.startMap(window.OverworldMaps.Main);

        this.bindActionInput();
        this.bindCatPositionCheck();
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();


        this.startGameLoop();

        this.map.startCutscene([
            // { type: "changeMap", map: "Main"}
            { type: "textMessage", text: "My witch hasn't been back home in a while..."},
            { type: "textMessage", text: "I'm starting to get worried, maybe I should go look for them!"},
            { type: "textMessage", text: "I should probably explore this room before leaving"}
        ])
    }
}