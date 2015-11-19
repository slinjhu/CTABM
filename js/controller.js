var Controller = function(){
    this.probAdaptive = document.getElementById("probAdaptive");
    this.effectOfBioMaker = document.getElementById("effectOfBioMaker");
    this.numBioMarker = document.getElementById("numBioMarker");
};

Controller.prototype = {
    addBioMaker: function(){
        var rate = this.effectOfBioMaker.value;
        this.numBioMarker.value += 1 / rate;
        document.getElementById('valueNumBioMarker').innerHTML = this.numBioMarker.value;
    }
};