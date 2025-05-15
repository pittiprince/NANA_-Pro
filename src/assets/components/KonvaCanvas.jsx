

import Konva from "konva";
import '../../../src/componentsStyle.css';
import { useEffect, useState, useRef } from "react";

export const KonvaCanva = () => {
    const StageRef = useRef(null);
    const LayerRef = useRef(null);
    const [isdrawing, setIsdrawing] = useState(false);
    const transformerRef = useRef(null);
    const [shapes, setShapes] = useState([]);
    const [currentShape, setCurrentShape] = useState('');
    const [scribbleLines, setScribbleLines] = useState([]); // Array to hold scribble lines
    const [color, setColor] = useState('#000000');
    const [selected, setSelected] = useState(null); // for shape selection
   const KonvaStage = useRef(null)

    useEffect(() => {
        const Stage = new Konva.Stage({
            container: StageRef.current,
            width: 3000,
            height: 3000
        });

        KonvaStage.current = Stage
        const layer = new Konva.Layer();
        Stage.add(layer);
        

        const transformer = new Konva.Transformer();
        layer.add(transformer);
        transformerRef.current = transformer;
        LayerRef.current = layer;
        // Clear the transformer when clicking on the stage (deselect shapes)
        Stage.on('click', (e) => {
            if (e.target === Stage) {
                transformer.nodes([]);
                setSelected(null);
                layer.batchDraw();
            }
        });

        return () => {
            Stage.destroy();
        };
    }, []);

    const handleMouseDown = () => {
        if (!currentShape) return;

    const pos = LayerRef.current.getRelativePointerPosition();
    setIsdrawing(true);

    let newShape;
    if (currentShape === 'scribble') {
        newShape = createScribbleLine(pos);
        setScribbleLines((prevLines) => [...prevLines, newShape]);
    } else if (currentShape === 'rect') {
        newShape = createRect(pos);
    } else if (currentShape === 'text') {
        newShape = createText(pos);
    } else if (currentShape === 'circle') {
        newShape = createCircle(pos);
    } else if (currentShape === 'line') {
        newShape = createLine(pos);
    }

    if (newShape) {
        newShape.moveToTop();
        setShapes((prevShapes) => [...prevShapes, newShape]);

        // Add click event to attach transformer when shape is clicked
        newShape.on('click', () => handleShapeClick(newShape));

        LayerRef.current.add(newShape);
        LayerRef.current.batchDraw();
    }

    };

    const handleMouseUp = () => {
        setIsdrawing(false); 
    };

    const handleMouseMove = () => {
        if (!isdrawing || !currentShape) return;

        const pos = LayerRef.current.getRelativePointerPosition();
        if (currentShape === 'scribble') {
            const line = scribbleLines[scribbleLines.length - 1]; // Get the last scribble line
            const newPoints = line.points().concat([pos.x, pos.y]);
            line.points(newPoints);
        } else {
            const shape = shapes[shapes.length - 1];
            if (currentShape === 'rect') {
                shape.width(pos.x - shape.x());
                shape.height(pos.y - shape.y());
            } else if (currentShape === 'circle') {
                const radius = Math.sqrt(
                    Math.pow(pos.x - shape.x(), 2) + Math.pow(pos.y - shape.y(), 2)
                );
                shape.radius(radius);
            } else if (currentShape === 'line') {
                shape.points([shape.points()[0], shape.points()[1], pos.x, pos.y]);
            }
        }

        LayerRef.current.batchDraw();
    };
    const createText = (pos) => {
        const shape = new Konva.Text({
            x: pos.x,
            y: pos.y,
            text: 'edit',
            fontSize: 40,
            draggable: true,
            fill: 'black',
            fontFamily: "Caveat, cursive",
        });

        shape.on('dblclick', () => handleTextEditing(shape)); // Handle double click for text editing
        return shape;
    };

    const handleTextEditing = (shape) => {
        const textPosition = shape.getClientRect();
        const areaPosition = {
            x: StageRef.current.offsetLeft + textPosition.x,
            y: StageRef.current.offsetTop + textPosition.y,
        };

        const textArea = document.createElement('textarea');
        document.body.appendChild(textArea);
        textArea.value = shape.text();
        textArea.style.position = 'absolute';
        textArea.style.top = `${areaPosition.y}px`;
        textArea.style.left = `${areaPosition.x}px`;
        textArea.style.width = `${textPosition.width}px`;
        textArea.style.height = `${textPosition.height}px`;
        textArea.style.fontSize = '20px';
        textArea.style.background = 'white';
        textArea.style.padding = '4px';
        textArea.focus();

        textArea.addEventListener('blur', () => {
            shape.text(textArea.value);
            textArea.remove();
            LayerRef.current.batchDraw();
        });
    };
    const createScribbleLine = (pos) => {
        const freeLine = new Konva.Line({
            points: [pos.x, pos.y],
            stroke: 'black', // Use the selected color
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: true,
        });
        freeLine.on('dblclick', () => handleShapeClick(freeLine));
        return freeLine;
    };

    // Other shape creation functions...
    const createRect = (pos) => {
        const rect = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: 'rgba(0,0,255,0.5)',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true,
        });
        rect.on('click', () => handleShapeClick(rect));
        return rect;
    };
    
    const createCircle = (pos) => {
        const circle = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: 0,
            fill: 'rgba(255,0,0,0.5)',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true,
        });
        circle.on('click', () => handleShapeClick(circle));
        return circle;
    };

    const createLine = (pos) => {
        const line = new Konva.Line({
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: 'black',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: true,
        });
        line.on('click', () => handleShapeClick(line));
        return line;
    };

    const handleShapeClick = (shape) => {
        setSelected(shape); // Store the shape in selected state
        transformerRef.current.nodes([shape]); // Attach transformer to shape
        LayerRef.current.batchDraw(); // Refresh the layer
    };
    const HandleDelete = () => {
        if (selected) { // Check if a shape is selected
            selected.destroy(); // Remove the selected shape
            LayerRef.current.batchDraw(); // Update the layer
            setSelected(null); // Reset selected state
        }
    };
    const HandleClearCanvas = () => {
     // Clear all children in the layer and reset transformer
     LayerRef.current.removeChildren();
     LayerRef.current.batchDraw();
 
     // Reset shapes and scribbles
     setShapes([]); 
     setScribbleLines([]); 
     setSelected(null); 
 
     // Detach transformer nodes to prevent lingering attachment issues
     if (transformerRef.current) {
         transformerRef.current.nodes([]);
     }
    };

    const handleColorChange = (event) => {
        setColor(event.target.value);
    };
const changeCanvasColor = () =>{
    StageRef.current.style.backgroundColor = color;
}

const convertintoJSON = () =>{
   const toJson = KonvaStage.current.toJSON()
   console.log(toJson)

}
    return (
        <div id="main-container">
            <div id="options">
                {/* Shape buttons */}
                <button onClick={() => setCurrentShape('rect')}>Rectangle</button>
                <button onClick={() => setCurrentShape('circle')}>Circle</button>
                <button onClick={() => setCurrentShape('line')}>Line</button>
                <button onClick={() => setCurrentShape('text')}>Text</button>
                <button onClick={() => setCurrentShape('scribble')}>Draw</button>
                <button onClick={HandleClearCanvas}>Clear canvas</button>
                <button onClick={HandleDelete}>Delete</button>
                <input type="color" value={color} onChange={handleColorChange} />
                <button onClick={changeCanvasColor}>change</button>
                <button onClick={convertintoJSON}>TurnBase64Image</button>
            </div>

            <div
                id="stageContainer"
                ref={StageRef}
                style={{ width: '100vw', height: '100vh' }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            ></div>
        </div>
    );
};
