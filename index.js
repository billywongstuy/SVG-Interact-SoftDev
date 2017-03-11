/*------------------
 VARIABLES
------------------*/

var pic = document.getElementById("vimage");
var clearB = document.getElementById("clear");
var moveB = document.getElementById("move");
var stopB = document.getElementById("stop");
var speedSlider = document.getElementById("speed");
var speedDiv = document.getElementById("speed_no");
var radiusSlider = document.getElementById("radius");
var radiusDiv = document.getElementById("radius_no");
var radius = 16;

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

var crtCircle = function(x,y,radius) {
    var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("r",radius.toString());
    c.setAttribute("fill","rgba(255,0,0,0.5)");
    c.setAttribute("stroke","black");
    c.setAttribute("cx",x.toString());
    c.setAttribute("cy",y.toString());

    var cAngle = Math.floor(Math.random()*2*Math.PI);
    var xDirInit = Math.cos(cAngle);
    var yDirInit = Math.sin(cAngle);
    c.setAttribute("ang",cAngle.toString());
    c.setAttribute("xDir",xDirInit.toString());
    c.setAttribute("yDir",yDirInit.toString());	    
    
    c.addEventListener("click",function(e) {
	changeColor(this,e);
    },false);
    
    return c;
};

var addCircle = function(x,y) {
    var c = crtCircle(x,y,radius);
    pic.appendChild(c);
};

var changeColor = function(c,e) {
    c.setAttribute("fill","rgba(255,255,0,0.5)");
    
    c.addEventListener("click",function(e) {
	removeCircle(this,e);
	var x =  Math.floor(Math.random() * (pic.width.baseVal.value+1));
	var y =  Math.floor(Math.random() * (pic.height.baseVal.value+1));
	addCircle(x,y,radius);
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

var interval = null;
var speed = 1;

var move = function(e) {
    var children = pic.children;
    
    for (var i = 0; i < children.length; i++) {

	var x = parseFloat(children[i].getAttribute("cx"));
	var y = parseFloat(children[i].getAttribute("cy"));	
	var xDir = parseFloat(children[i].getAttribute("xDir"));
	var yDir = parseFloat(children[i].getAttribute("yDir"));
	var radius = parseFloat(children[i].getAttribute("r"));
	
	x += xDir;
	y += yDir;
	
	if (x <= 0+radius || x >= pic.width.baseVal.value-radius) {
	    children[i].setAttribute("xDir",(-xDir.toString()));
	}
	if (y <= 0+radius || y >= pic.height.baseVal.value-radius) {
	    children[i].setAttribute("yDir",(-yDir.toString()));
	}
	
	children[i].setAttribute("cx",x.toString());
	children[i].setAttribute("cy",y.toString());

	if (onInvisibleLine(children[i])) {
	    split(children[i]);
	}
	
    }
};


var moveStart = function(e) {
    if (interval == null) {
	interval = setInterval(move,10/speed);
    }
};


/*-----------------
 SPLITTING
-----------------*/

var onInvisibleLine = function(c) {
    var y = parseFloat(c.getAttribute("cy"));
    var lineRegion = (pic.width.baseVal.value)/2;
    var yDir = parseFloat(c.getAttribute("yDir"));

    //On the line or about to cross it
    if (y < lineRegion) {
	return y+yDir > lineRegion;
    }
    if (y > lineRegion) {
	return y+yDir < lineRegion;
    }
    return y == lineRegion;
    
}

var split = function(c) {
    var x = parseFloat(c.getAttribute("cx"));
    var y = parseFloat(c.getAttribute("cy"));
    var oldRadius = parseFloat(c.getAttribute("r"));
    
    if (oldRadius <= 2) {
	pic.removeChild(c);
    }
    else {
	var newC = crtCircle(x,y,oldRadius);
	c.setAttribute("r",(oldRadius/2).toString());
	newC.setAttribute("r",(oldRadius/2).toString());
	newC.setAttribute("xDir",(-(parseFloat(c.getAttribute("yDir")))).toString());
	newC.setAttribute("yDir",(-(parseFloat(c.getAttribute("yDir")))).toString());
	pic.appendChild(newC);
    }
}


/*----------------
 SLIDERS
 ----------------*/

var changeSpeed = function() {
    speedDiv.innerHTML = speedSlider.value;
    speed = speedSlider.value;
    stopIt();
    moveStart();
}

var changeRadius = function() {
    radiusDiv.innerHTML = radiusSlider.value;
    radius = radiusSlider.value;
}


/*----------------
 STOP
----------------*/

var stopIt = function() {
    clearInterval(interval);
    interval = null;
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
speedSlider.addEventListener("change",changeSpeed);
radiusSlider.addEventListener("change",changeRadius);
