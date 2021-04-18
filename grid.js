var width = window.innerWidth;
var height = window.innerHeight;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

var shadowRectangle = new Konva.Rect({
    x: 0,
    y: 0,
    width: blockSnapSize * 1,
    height: blockSnapSize * 1,
    fill: '#FF7B17',
    opacity: 0.6,
    stroke: '#CF6412',
    strokeWidth: 3,
    dash: [20, 2]
});

function newRectangle(x, y, layer, stage, text) {

    var group = new Konva.Group({
        x: x,
        y: y,
        draggable: true
    });

    let rectangle = new Konva.Rect({
    
        width: blockSnapSize * 1,
        height: blockSnapSize * 1,
        fill: '#fff',
        stroke: '#ddd',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.4,
        draggable: false,
    });

    group.on('dragstart', e => {
        shadowRectangle.show();
        shadowRectangle.moveToTop();
        group.moveToTop();
    });
    group.on('dragend', e => {
        group.position({
            x: Math.round(group.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(group.y() / blockSnapSize) * blockSnapSize
        });

        stage.batchDraw();
        shadowRectangle.hide();
    });
    group.on('dragmove', e => {
        shadowRectangle.position({
            x: Math.round(group.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(group.y() / blockSnapSize) * blockSnapSize
        });

        stage.batchDraw();
    });
    
    var text = new Konva.Text({
      
        fontSize: 16,
        fontFamily: 'Arial',
        text: text,
        fill: 'black',
        padding: 10,
        align: "center",
        verticalAlign: "middle",
      });

    group.add(rectangle).add(text);
    return group;
}

var stage = new Konva.Stage({
    container: 'grid',
    width: width,
    height: height
});


stage.on('mousedown', (e) => {
    const isRight = e.evt.button === 2;
    if (isRight) {
        if (e.target === stage) {
            return;
        }
        if (e.target.parent.nodeType === "Group") {
            e.target.parent.destroy();
            layer.draw();
        }
    }
});


var gridLayer = new Konva.Layer();
var padding = blockSnapSize;

var MAX_X = 0;
var MAX_Y = 0;
for (var i = 0; i < width / padding; i++) {
  
    gridLayer.add(new Konva.Line({
        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
        stroke: '#ddd',
        strokeWidth: 1
    }));
    MAX_X = i;
} 

gridLayer.add(new Konva.Line({ points: [0, 0, 10, 10] }));

for (var j = 0; j < height / padding; j++) {
  
    gridLayer.add(new Konva.Line({
        points: [0, Math.round(j * padding), width, Math.round(j * padding)],
        stroke: '#ddd',
        strokeWidth: 0.5
    }));
    MAX_Y = j;
} 

var layer = new Konva.Layer();
shadowRectangle.hide();
layer.add(shadowRectangle);

stage.add(gridLayer);
stage.add(layer);


