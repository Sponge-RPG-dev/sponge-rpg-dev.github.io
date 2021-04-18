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