class Sound {

    constructor(sources, scene) {

        this.audio = document.createElement("audio");
        this.scene = scene;

        for (var i = 0; i < sources.length; i++) {
            var source = document.createElement("source");
            source.src = sources[i];
            this.audio.appendChild(source);
        }

    }


    pause(){
    this.audio.pause();
    }
    
    play(){
        this.audio.play()
    }
   
}