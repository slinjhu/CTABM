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
        x = 110 * (0.2+x);
        y = 100 * y;
        return new paper.Point(x, y);
    },
    makeText: function(text){
        var circle = new paper.Path.Circle(this.point, 20);
        circle.fillColor = 'white';
        circle.strokeColor = '#bdc3c7';
        var text = new paper.PointText({
            content: text,
            point: this.point,
            justification: "center",
            fillColor: "#FF2742",
            fontSize: "22px",
        });
        text.translate(new paper.Point(0, 8));
    }
};


var Graph = function(){
    this.vertices = this.getVertices();
    this.root = "P";
    this.showme(this.vertices, this.root);
};

Graph.prototype = {
    getVertices: function() {
        return {
            P: new Vertex(0, 4, ["D"]),
            D: new Vertex(1, 4, ["ST", "AD"]),
            ST: new Vertex(4, 2, ["As", "Ns"]),
            AD: new Vertex(4, 5, ["Aa", "Na"]),
            As: new Vertex(5, 1, []),
            Ns: new Vertex(5, 3, []),
            Aa: new Vertex(5, 4, []),
            Na: new Vertex(5, 6, [])
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
                        strokeColor: "#bdc3c7",
                        strokeWidth: 8
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
    this.origin = graph.vertices["P"].point;
    this.instances = new Array();
    this.counter = {
        As: {id: "As", label: "Accepted, standard", value: 0, color: "#279CEB"},
        Ns: {id: "Ns", label: "Not accepted, standard", value: 0, color: "#f35958"},
        Aa: {id: "Aa", label: "Accepted, adaptive", value: 0, color: "#50E3C2"},
        Na: {id: "Na", label: "Not accepted, adaptive", value: 0, color: "#f1c40f"}
    };
    make_legend(this.counter)
    update_chart([{label: " ", value: 1, color: "#CCC"}] );
};



Particles.prototype = {
    newone: function(){
        var placedSymbol = this.symbol.place(this.origin);
        placedSymbol.from = "P";
        placedSymbol.to = "D";

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
        function getDest(thisVertex, adj){
            switch (thisVertex){
                case "D":
                    var probAdaptive = document.getElementById("probAdaptive").value;
                    if(Math.random()*100 < probAdaptive){
                        return "AD";
                    }else{
                        return "ST";
                    }
                case "ST":
                    var probAccept = 10;
                    if(Math.random()*100 < probAccept){
                        return "As";
                    }else{
                        return "Ns";
                    }
                case "AD":
                    var probAccept = 10;
                    if(Math.random()*100 < probAccept){
                        return "Aa";
                    }else{
                        return "Na";
                    }
                default:
                    return adj[Math.floor(Math.random()*adj.length)];
            }

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
                        this.instances[i].to = getDest(to, adj);
                    } else { // Reached the end
                        var id = this.instances[i].to;
                        this.counter[id].value += 1;
                        update_chart(this.counter);

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
        circle.fillColor = '#1D85FF';
        circle.strokeColor = '#2980b9';
        circle.strokeWidth = 2;
        circle.opacity = 0.7;
        return new paper.Symbol(circle);
    }
};

paper.install(window);
window.onload = function(){
    paper.setup("graph");

    var graph = new Graph();
    var p = new Particles(graph);

    var cnt = 0;
    view.onFrame = function(event){
        cnt += 1;
        if(cnt % 30 == 0){
            p.newone();
        }
        p.move();
    };

    paper.view.draw();



};



function make_legend(counter) {
    for (var key in counter) {
        var tr = document.createElement("tr");

        var tdId = tr.appendChild(document.createElement("td"));
	
        tdId.innerHTML = counter[key].id;
        tdId.style.backgroundColor = counter[key].color;
        tdId.style.color = "white";
        tdId.style.padding = "8px";
		tdId.style.border = "10px solid #fff";

        var tdLabel = tr.appendChild(document.createElement("td"));
		tdLabel.className = "mytd";
			
        tdLabel.innerHTML = counter[key].label;

        document.getElementById("legend").appendChild(tr);
		
    }
}