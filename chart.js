const $ = go.GraphObject.make;

const numIcon = (num) => `https://ui-avatars.com/api/?background=2196F3&color=fff&rounded=true&length=3&font-size=0.75&bold=true&name=${num}`

const myDiagram = $(go.Diagram, "myDiagramDiv", 
  { // enable Ctrl-Z to undo and Ctrl-Y to redo
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
  }
);


const itemTemplateMap = new go.Map();
itemTemplateMap.add("text", $(
  go.Panel, "Vertical", {width: 250},
  $(go.TextBlock, {margin: 5, width: 240},
    new go.Binding("text", "text"),
    new go.Binding("stroke", "color"),
    new go.Binding("font", "font"),
   )
))

itemTemplateMap.add("item", $(
  go.Panel, "Horizontal", {width: 250},
  $(go.Picture, { margin: 5, width: 20, height: 20, visible: false },
    new go.Binding("source", "icon"),
    new go.Binding("visible", "icon", (icon) => !!icon)
  ),
  $(go.Panel, "Vertical", { margin: 5, defaultAlignment: go.Spot.Left},
    $(go.TextBlock, new go.Binding("text", "title"), {font: "bold 12px sans-serif", stroke: "#2196f3"}), 
    $(go.TextBlock, new go.Binding("text", "subTitle"), {visible: false, font: "Italic 11px sans-serif", stroke: "gray"}, new go.Binding("visible", "subTitle", (s) => !!s))
  )
))

itemTemplateMap.add("header", $(
  go.Panel, "Horizontal", {width: 250},
  $(go.Picture, { margin: 5, width: 30, height: 30, visible: false },
    new go.Binding("source", "icon"),
    new go.Binding("visible", "icon", (icon) => !!icon)
  ),
  $(go.Panel, "Vertical", { margin: 5, defaultAlignment: go.Spot.Left},
    $(go.TextBlock, new go.Binding("text", "title"), {font: "bold 12px sans-serif", stroke: "#660099"}), 
    $(go.TextBlock, new go.Binding("text", "subTitle"), {visible: false, font: "Italic 11px sans-serif", stroke: "gray"}, new go.Binding("visible", "subTitle", (s) => !!s))
  )
))

itemTemplateMap.add("buttons", $(
  go.Panel, "Horizontal", {width: 250},
  new go.Binding("itemArray", "buttons"),
  {
    itemTemplate: $(
      go.Panel, "Auto",
      $(go.TextBlock, new go.Binding("text", "", (text) => text.toUpperCase()), {margin: 5, font: "Normal bold 12px sans-serif", stroke: "#2196f3"})
    )
  }
))





myDiagram.nodeTemplate = $(
  go.Node, "Vertical",
  $(go.Panel, "Vertical",
    new go.Binding("itemArray", "sessions"),
    {
      itemTemplate: $(
        go.Panel, "Auto",
        $(go.Shape, "Rectangle", { strokeWidth: 1, fill: "white", stroke: "lightgray" }),
        $(go.Panel, "Vertical", { margin: 5, width: 250 },
          new go.Binding("itemArray", "items"),
          {
            itemTemplateMap
          }
        )
      )
    }
  ),
  $("TreeExpanderButton"),
  {
    toolTip:  // define a tooltip for each node that displays the color as text
      $("ToolTip",
        $(go.TextBlock, { margin: 4 },
          new go.Binding("text", "key"))
      )  // end of Adornment
  }
);

myDiagram.nodeTemplateMap.add("Comment",
$(go.Node,  // this needs to act as a rectangular shape for BalloonLink,
  { background: "transparent" },  // which can be accomplished by setting the background.
  $(go.TextBlock,
    { stroke: "brown", margin: 3 },
    new go.Binding("text"))
));

myDiagram.nodeTemplateMap.add("start", $(
  go.Node, "Vertical",
  $(go.Panel, "Auto",
    $(go.Shape, "Ellipse", {fill: "lightgreen", stroke: "lightgray", width: 70, height: 70}),
    $(go.TextBlock, {text: "START", margin: 25}),
  ),
  $("TreeExpanderButton")
));

myDiagram.nodeTemplateMap.add("end", $(
  go.Node, "Auto",
  $(go.Shape, "Ellipse", {fill: "#fd7272", stroke: "lightgray", width: 70, height: 70}),
  $(go.TextBlock, {text: "END", margin: 25})
));


myDiagram.linkTemplate =$(go.Link,
  $(go.Shape),
  $(go.Shape, { toArrow: "Standard" }),
  $(go.Panel, "Auto",  // this whole Panel is a link label
    {segmentIndex: -1, visible: false},
    $(go.Shape, "Rectangle", 
      { fill: "lightyellow", stroke: "lightgray" },
      new go.Binding("fill", "type", (type) => type === "upload" ? "lightblue" : "lightyellow")
    ),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "text"),
    ),
    new go.Binding("visible", "text", text => !!text)
  ),
  {
    toolTip:  // define a tooltip for each node that displays the color as text
      $("ToolTip",
        $(go.TextBlock, { margin: 4, text: "input" },
          new go.Binding("text", "type"))
      )  // end of Adornment
  }
);

myDiagram.linkTemplateMap.add("Comment",
// if the BalloonLink class has been loaded from the Extensions directory, use it
$((typeof BalloonLink === "function" ? BalloonLink : go.Link),
  $(go.Shape,  // the Shape.geometry will be computed to surround the comment node and
    // point all the way to the commented node
    { stroke: "brown", strokeWidth: 1, fill: "lightyellow" })
));

function load() {
  myDiagram.model = go.GraphLinksModel.fromJson(editor.getValue());
}
// print the diagram by opening a new window holding SVG images of the diagram contents for each page
function printDiagram() {
  var svgWindow = window.open();
  if (!svgWindow) return;  // failure to open a new Window
  var printSize = new go.Size(1700, 2960);
  var bnds = myDiagram.documentBounds;
  var svg = myDiagram.makeSvg({ scale: 1.0, position: new go.Point(0, 0), size: bnds });
  svgWindow.document.body.appendChild(svg);
}
