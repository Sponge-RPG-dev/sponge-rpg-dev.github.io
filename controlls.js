function generateUIElements(textAreaID, divContainerID) {
    $("#"+divContainerID).empty()
    var lines = $("#" + textAreaID).val().split("\n");

    $.each(lines, function(index, item) {
        var btn = $('<button/>',
        {
            text: item,
            click: function () { 
                var rec = newRectangle(1, 4, layer, stage, item);
                layer.add(rec);
                layer.draw();
            },
            class: "ui-element-buttons"
        });
        $("#"+divContainerID).append(btn)
    });
    $("#uibtns").hide();
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}
var _TREE; //yeah im awesome js dev
function parseTree(textAreaID, divContainerID, taControlls) {
    $("#"+divContainerID).empty()
    var lines = $("#" + textAreaID).val();

    _TREE = parseHocon(lines);
    if (_TREE.asciiMap == undefined) {
        _TREE.asciiMap = ["X"];
    }
    var asciiMap = _TREE.AsciiMap;
    
    var skills = _TREE.Skills;

    //Fill missing
    var arr = [];
    $.each(skills, function(index, skill) {
        var a = skill.SkillTreeId;
        if (a === undefined) {
            var k = 1;
            while (arr.filter(e => e == k).length == 1) {
                k++;
            }
            skill.SkillTreeId = k;
        }
        arr.push(skill.SkillTreeId);
        
    });


    skills.sort((a,b) => (a.SkillTreeId > b.SkillTreeId) ? 1 : ((b.SkillTreeId > a.SkillTreeId) ? -1 : 0))

    $.each(skills, function(index, skill) {
        var btn = $('<button/>',
        {
            text: skill.SkillId + " (" + skill.SkillTreeId + ")",
            click: function () { 
                var rec = newRectangle(1, 1, layer, stage, skill.SkillTreeId);
                layer.add(rec);
                layer.draw();
            },
            class: "sk-btn"
        });
        $("#"+divContainerID).append(btn) 
    });

    var midX=Math.round(MAX_X/4);
    var midY=Math.round(MAX_Y/4);
    
    var skillMidX=0;
    var skillMidY=0;

    $.each(asciiMap, function(index, row) {
        for (var x = 0; x < row.length; x++) {
            var c = row.charAt(x);
            if (c == "X") {
                skillMidX = index;
                skillMidY = x;
            }
        }
    });
    
    if (skillMidY == 0 && skillMidX == 0) {
        skillMidY = midY;
        skillMidX = midX;
    }


    $.each(asciiMap, function(index, row) {    
        for (var x = 0; x < row.length; x++) {
            var c = row.charAt(x);
            if (c == ".") {
                continue;
            }
            console.log("creating node node at " + index + " " + x)
            if (isControllElement(taControlls, c)) {
                var element = newRectangle((x + midX) * blockSnapSize, (index + midY) * blockSnapSize, layer, stage,c);
                console.log("created ui node at " + element.x() + " " + element.y())
                layer.add(element);
            } else {
                var element = newRectangle((x + midX) * blockSnapSize, (index + midY) * blockSnapSize, layer, stage,c);    
                console.log("created skill node at " + element.x() + " " + element.y())
                layer.add(element);
            }
            
        }
    });
    layer.draw();
}

function isControllElement(taControlls, char) {
    return $("#" + taControlls).val().indexOf(char) >=0;
}

function updateTree(textAreaID, textAreaOutput, modalID) {

    var maxX=layer.getChildren()[1].attrs.x
    var maxY=layer.getChildren()[1].attrs.y;
    var minX=layer.getChildren()[1].attrs.x;
    var minY=layer.getChildren()[1].attrs.y;
    //find maxs
    for (var id = 2; id < layer.getChildren().length; id++) {
        var child = layer.getChildren()[id];
        if (child.nodeType == "Shape") {
            continue;
        }
        var pos = child.attrs;
        maxX=Math.max(maxX,pos.x);
        maxY=Math.max(maxY,pos.y);
        minX=Math.min(minX,pos.x);
        minY=Math.min(minY,pos.y);
    }

    var matrix = []; 
    
    for (var j = maxY; j >= minY; j=j-blockSnapSize) {
        var row = [];
        for (var i = minX; i <= maxX; i=i+blockSnapSize) {
                var group = getAt(i,j);
                if (group == undefined) {
                    row.push(".");
                } else {
                    group.children.forEach(element => {
                        if (element.className == "Text") {
                            row.push(element.textArr[0].text);
                        }
                    });
                }
            }
        matrix.push(row);
    }
    // Get the modal
    var modal = $("#" + modalID);
    modal.css("display", "block");
    $("#"+textAreaOutput).val("AsciiMap: " + JSON.stringify(matrix.reverse())); //meh
}

function getAt(x,y) {
    for (const obj in layer.children) {
        var o = layer.children[obj];
        if (o.nodeType != "Group") {
            continue;
        }
        var pos = o.attrs;
        if (pos.x == x && pos.y == y) {
            return o;
        }
    }
    return undefined;
}