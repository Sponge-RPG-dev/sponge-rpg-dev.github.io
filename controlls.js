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

function parseTree(textAreaID, divContainerID, taControlls) {
    $("#"+divContainerID).empty()
    var lines = $("#" + textAreaID).val();

    var obj = parseHocon(lines);
    if (obj.asciiMap == undefined) {
        obj.asciiMap = ["X"];
    }
    var asciiMap = obj.AsciiMap;
    
    var skills = obj.Skills;

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

    var midX=Math.round(MAX_Y/2);
    var midY=Math.round(MAX_Y/2);
    
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
                var element = newRectangle(x * blockSnapSize, index * blockSnapSize, layer, stage,c);
                console.log("created ui node at " + element.x() + " " + element.y())
                layer.add(element);
            } else {
                var element = newRectangle(x * blockSnapSize, index * blockSnapSize, layer, stage,c);    
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
