
function update_chart(counter) {


}

var Distribution = function(canvasId){
    this.ctx = document.getElementById(canvasId).getContext("2d");
    this.options = {
        animation : false,
        tooltipEvents: []
    };
    var data = [{value: 0, color: "gray"}];
    console.log("Created distribution chart");
};

Distribution.prototype = {
    draw: function(data){
        this.chart = new Chart(this.ctx).Doughnut(data, this.options);

    }
};

var CurvePlot = function(canvasId){
    this.ctxPlot = document.getElementById(canvasId).getContext("2d");
    this.plot = this.init();
    console.log("Created curve plot");
};

CurvePlot.prototype = {
    init: function(){
        var data = [
            {
                label: 'Accepted, standard',
                strokeColor: "#FFF",
                pointColor: Para.color.As,
                pointStrokeColor: Para.color.As,
                data: [{x: 0, y: 0}]
            },
            {
                label: 'Accepted, adaptive',
                strokeColor: "#FFF",
                pointColor: Para.color.Aa,
                pointStrokeColor: Para.color.Aa,
                data: [{x: 0, y: 0}]
            }
        ];
        var options = {
            animation : false
        };
        return new Chart(this.ctxPlot).Scatter(data, options);
    },
    addPoint: function(line, x, y){
        var idx;
        switch (line){
            case "As":
                idx = 0;
                break;
            case "Aa":
                idx = 1;
                break;
            default:
                console.log("Wrong line name on adding point");
        }

        this.plot.datasets[idx].addPoint(x, y);
        this.plot.update();
    }

};


var MyView = function(){
    this.AsAa = new CurvePlot("AsAa");

    this.distribution = new Distribution("distribution");

};

MyView.prototype = {
    make_legend: function(counter){
        for (var key in counter) {
            var tr = document.createElement("tr");

            var tdId = tr.appendChild(document.createElement("td"));

            tdId.innerHTML = counter[key].id;
            tdId.style.backgroundColor = Para.color[key];
            tdId.style.color = "white";
            tdId.style.padding = "5px";
            tdId.style.border = "10px solid #fff";


            var tdLabel = tr.appendChild(document.createElement("td"));
            tdLabel.style.paddingLeft = "10px";
            tdLabel.innerHTML = counter[key].label;

            document.getElementById("legend").appendChild(tr);

        }
    },
    make_mini_legend: function(counter){
        var miniCounter = {Aa: counter.Aa, As: counter.As};
        this.make_legend(miniCounter);
    }
};