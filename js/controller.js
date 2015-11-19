var Controller = function(){
    this.probAdaptive = document.getElementById("probAdaptive");
    this.effectOfBioMaker = document.getElementById("effectOfBioMaker");
    this.probAcceptAtAdaptive = document.getElementById("probAcceptAtAdaptive");
};

Controller.prototype = {
    addBioMaker: function(){
        var rate = this.effectOfBioMaker.value;
        this.probAcceptAtAdaptive.value += 1 * rate;
        document.getElementById('valueProbAcceptAtAdaptive').innerHTML = this.probAcceptAtAdaptive.value;
    }
};