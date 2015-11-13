var symbol;
var mypoints;

var Vertex = function(x, y, adj){
    this.x = x;
    this.y = y;
    this.adj = adj;
    this.point = this.makePoint(x, y);
};

Vertex.prototype = {
    makePoint: function(x, y){
        x = 120 * (1+x);
        y = 100 * y;
        return new paper.Point(x, y);
    },
    makeText: function(text){
        var circle = new paper.Path.Circle(this.point, 20);
        circle.fillColor = 'white';
        circle.strokeColor = 'black';
        var text = new paper.PointText({
            content: text,
            point: this.point,
            justification: "center",
            fillColor: "red",
            fontSize: "25px"
        });
        text.translate(new paper.Point(0, 10));
    }
};



var Graph = function(){
    this.vertices = this.getVertices();
    this.root = "E";
    this.showme(this.vertices, this.root);
};

Graph.prototype = {
    getVertices: function() {
        return {
            "E": new Vertex(0, 4, ["F"]),
            "F": new Vertex(1, 4, ["C", "D"]),
            "C": new Vertex(4, 2, ["As", "Ns"]),
            "D": new Vertex(4, 5, ["Aa", "Na"]),
            "As": new Vertex(5, 1, []),
            "Ns": new Vertex(5, 3, []),
            "Aa": new Vertex(5, 4, []),
            "Na": new Vertex(5, 6, [])
        }
    },
    showme: function(vertices, root){
        // Initialize discovery mark
        var keys = Object.keys(vertices);
        var isDiscovered = {};
        keys.forEach(function(key){
            isDiscovered[key] = false;
        });
        function DFSdraw(id){
            isDiscovered[id] = true;
            var adj = vertices[id].adj;
            adj.forEach(function(child){
                if (! isDiscovered[child]) {
                    var path = new paper.Path({
                        segments: [vertices[id].point, vertices[child].point],
                        strokeColor: "#888",
                        strokeWidth: 10
                    }).sendToBack();
                    DFSdraw(child);
                }
            });
        }
        DFSdraw(root);
        // Show the nodes
        keys.forEach(function(key){
            var point = vertices[key];
            point.makeText(key);
        });
    }
};



var Particles = function(graph){
    this.symbol = this.makeSymbol();
    this.graph = graph;
    this.origin = graph.vertices["E"].point;
    this.instances = new Array();
    this.counter = {"As": 0, "Ns": 0, "Aa": 0, "Na": 0};
};


Particles.prototype = {
    newone: function(){
        var placedSymbol = this.symbol.place(this.origin);
        placedSymbol.from = "E";
        placedSymbol.to = "F";

        this.instances.push(placedSymbol);
    },
    move: function(){
        function getFrac(ptFrom, ptTo, ptNow){
            if(ptFrom.x == ptTo.x){
                return (ptNow.y - ptFrom.y) / (ptTo.y - ptFrom.y);
            }else{
                return (ptNow.x - ptFrom.x) / (ptTo.x - ptFrom.x);
            }
        }
        function getStep(ptFrom, ptTo){
            var dx = ptTo.x - ptFrom.x;
            var dy = ptTo.y - ptFrom.y;
            var dis = Math.sqrt(dx*dx + dy*dy);
            return new paper.Point(dx / dis, dy / dis);
        }
        function getDest(adj){
            return adj[Math.floor(Math.random()*adj.length)];
        }
        for(var i = 0; i < this.instances.length; i++){
            if(typeof this.instances[i] !== 'undefined') {
                var from = this.instances[i].from;
                var to = this.instances[i].to;
                var ptFrom = this.graph.vertices[from].point;
                var ptTo = this.graph.vertices[to].point;
                var ptNow = this.instances[i].position;
                var frac = getFrac(ptFrom, ptTo, ptNow);
                if (frac < 1) {
                    var step = getStep(ptFrom, ptTo);
                    this.instances[i].position = this.instances[i].position.add(step);
                } else {
                    this.instances[i].from = to;
                    var adj = this.graph.vertices[to].adj;
                    if (adj.length > 0) {
                        this.instances[i].to = getDest(adj);
                    } else {
                        var id = this.instances[i].to;
                        this.counter[id] += 1;
                        console.log(this.counter);
                        this.instances[i].visible = false;
                        delete this.instances[i];
                    }
                }
            }
        }
    },
    makeSymbol: function(){
        var point = new paper.Point(0, 0);
        var circle = new paper.Path.Circle(point, 10);
        circle.fillColor = 'blue';
        circle.strokeColor = 'black';
        circle.strokeWidth = 3;
        circle.opacity = 0.7;
        return new paper.Symbol(circle);
    }
};

paper.install(window);
window.onload = function(){
    paper.setup("myCanvas");

    var graph = new Graph();
    var p = new Particles(graph);
    var cnt = 0;
    view.onFrame = function(event){
        cnt += 1;
        if(cnt % 50 == 0){
            p.newone();
        }

        p.move();
    };

    paper.view.draw();

};



