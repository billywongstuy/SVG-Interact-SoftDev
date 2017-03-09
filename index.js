/*------------------
 VARIABLES
------------------*/

var pic = document.getElementById("vimage");
var clearB = document.getElementById("clear");
var moveB = document.getElementById("move");
var stopB = document.getElementById("stop");

/*--------------
 CLEAR
--------------*/

var clear = function(e) {
    while (pic.lastChild) {
	pic.removeChild(pic.lastChild);
    }
};



/*------------------------------------------
 CIRCLES
 ------------------------------------------*/

var crtCircle = function(x,y,radius=20) {
    var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("r",radius.toString());
    c.setAttribute("fill","rgba(255,0,0,0.5)");
    c.setAttribute("stroke","black");
    c.setAttribute("cx",x.toString());
    c.setAttribute("cy",y.toString());

    c.addEventListener("click",function(e) {
	changeColor(this,e);
    },false);
    
    return c;
};

var addCircle = function(x,y) {
    var c = crtCircle(x,y);
    pic.appendChild(c);
};

var changeColor = function(c,e) {
    c.setAttribute("fill","rgba(255,255,0,0.5)");
    
    c.addEventListener("click",function(e) {
	removeCircle(this,e);
	var x =  Math.floor(Math.random() * (pic.width.baseVal.value+1));
	var y =  Math.floor(Math.random() * (pic.height.baseVal.value+1));
	addCircle(x,y);
    },false);
    
    e.stopPropagation();
};

var removeCircle = function(c,e) {
    pic.removeChild(c);
    e.stopPropagation();
};



/*-------------------
 MOVE
-------------------*/

var interval;
var speed = 2;

var move = function(e) {
    var children = pic.children;
    for (var i = 0; i < children.length; i++) {

	//Initialize the starting angle
	if (children[i].getAttribute("ang") == null) {
	    var cAngle = Math.floor(Math.random()*2*Math.PI);
	    var xDirInit = Math.cos(cAngle);
	    var yDirInit = Math.sin(cAngle);
	    children[i].setAttribute("ang",cAngle.toString());
	    children[i].setAttribute("xDir",xDirInit.toString());
	    children[i].setAttribute("yDir",yDirInit.toString());	    
	}

	var x = parseFloat(children[i].getAttribute("cx"));
	var y = parseFloat(children[i].getAttribute("cy"));	
	var xDir = parseFloat(children[i].getAttribute("xDir"));
	var yDir = parseFloat(children[i].getAttribute("yDir"));
	var radius = parseFloat(children[i].getAttribute("r"));
	
	x += (xDir*speed);
	y += (yDir*speed);
	
	if (x <= 0+radius || x >= pic.width.baseVal.value-radius) {
	    children[i].setAttribute("xDir",(-xDir.toString()));
	}
	if (y <= 0+radius || y >= pic.height.baseVal.value-radius) {
	    children[i].setAttribute("yDir",(-yDir.toString()));
	}
	
	children[i].setAttribute("cx",x.toString());
	children[i].setAttribute("cy",y.toString());
	
    }
};


var moveStart = function(e) {
    interval = setInterval(move,10);
};


/*----------------
 STOP
----------------*/

var stopIt = function() {
    clearInterval(interval);
}


/*---------------------
 EVENT LISTENERS
 ---------------------*/

pic.addEventListener("click",function(e) {
    addCircle(e.offsetX,e.offsetY);
}, false);
clearB.addEventListener("click",clear);
moveB.addEventListener("click",moveStart);
stopB.addEventListener("click",stopIt);
