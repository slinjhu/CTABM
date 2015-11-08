var symbol;
var mypoints;

window.onload = function(){
    var canvas = document.getElementById("myCanvas");
    paper.setup(canvas);

    var myPoints = function(points){
        this.points = {};
        for(var i = 0; i < points.length; i++){
            var id = points[i][0];
            var x = 100 * points[i][1];
            var y = 100 * points[i][2];
            this.points[id] = new paper.Point(x, y);
            var text = new paper.PointText({
                content: id,
                point: this.points[id],
                justification: "left",
                fillColor: "red",
                fontSize: "25px"
            });
        }
    }

    mypoints = new myPoints([
        ["E", 0, 4], ["F", 1, 4], ["C", 4, 2], ["D", 4, 5],
        ["As", 5, 1], ["Ns", 5, 3], ["Aa", 5, 4], ["Na", 5, 6]
    ]);

    var myPaths = function(paths, mypoints){
        this.paths = [];
        for(var i = 0; i < paths.length; i++){
            var p1 = mypoints.points[ paths[i][0] ];
            var p2 = mypoints.points[ paths[i][1] ];
            this.paths.push(new paper.Path({
                segments: [p1, p2],
                strokeColor: "#888",
                strokeWidth: 10
            }).sendToBack());
        }

    }

    var paths = new myPaths([
        ["E","F"], ["F","C"], ["F","D"],
        ["C","As"], ["C","Ns"], ["D","Aa"], ["D","Na"]
    ], mypoints);

    var path = new paper.Path.Circle(new paper.Point(20, 20), 20);
    path.fillColor = 'blue';
    symbol = new paper.PlacedSymbol(new paper.Symbol(path));

    paper.view.draw();
};



