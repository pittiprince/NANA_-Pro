import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import useUndo from 'use-undo';
import '../../../src/componentsStyle.css';

export const KonvaCanva = () => {
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [shapes, setShapes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [tool, setTool] = useState('');
    const [color, setColor] = useState('#000000');
    const [isDrawing, setIsDrawing] = useState(false);
    const stageRef = useRef(null);
    const layerRef = useRef(null);
    const [isPanning, setIsPanning] = useState(false);
    const [lastPointerPosition, setLastPointerPosition] = useState(null);
    const transformerRef = useRef(null);
    
    const [shapesState, {
        set: setShapesState,
        undo: undoShapes,
        redo: redoShapes,
        canUndo,
        canRedo
    }] = useUndo([]);

    useEffect(() => {
        if (selectedId) {
            const selectedNode = layerRef.current.findOne('#' + selectedId);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
            }
        } else {
            transformerRef.current.nodes([]);
        }
        layerRef.current.batchDraw();
    }, [selectedId]);

    const handleWheel = (e) => {
        e.evt.preventDefault();
        
        const scaleBy = 1.1;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        
        const pointerPos = stage.getPointerPosition();
        const mousePointTo = {
            x: (pointerPos.x - stage.x()) / oldScale,
            y: (pointerPos.y - stage.y()) / oldScale,
        };
        
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        
        setStageScale(newScale);
        setStagePos({
            x: pointerPos.x - mousePointTo.x * newScale,
            y: pointerPos.y - mousePointTo.y * newScale,
        });
    };

    const handleMouseDown = (e) => {
        if (e.evt.button === 1) {
            setIsPanning(true);
            setLastPointerPosition(stageRef.current.getPointerPosition());
            return;
        }

        setIsDrawing(true);
        const pos = stageRef.current.getPointerPosition();
        const newShape = {
            id: Date.now().toString(),
            type: tool,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            points: [pos.x, pos.y],
            fill: color,
            text: 'Double click to edit',
        };

        setShapes([...shapes, newShape]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        if (isPanning && lastPointerPosition) {
            const newPos = stageRef.current.getPointerPosition();
            setStagePos({
                x: stagePos.x + (newPos.x - lastPointerPosition.x),
                y: stagePos.y + (newPos.y - lastPointerPosition.y),
            });
            setLastPointerPosition(newPos);
            return;
        }

        const pos = stageRef.current.getPointerPosition();
        const lastShape = shapes[shapes.length - 1];
        
        if (!lastShape) return;

        const newShapes = shapes.slice(0, -1);
        switch (lastShape.type) {
            case 'rect':
                newShapes.push({
                    ...lastShape,
                    width: pos.x - lastShape.x,
                    height: pos.y - lastShape.y,
                });
                break;
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(pos.x - lastShape.x, 2) + Math.pow(pos.y - lastShape.y, 2)
                );
                newShapes.push({
                    ...lastShape,
                    radius: radius,
                });
                break;
            case 'line':
                newShapes.push({
                    ...lastShape,
                    points: [...lastShape.points.slice(0, -2), pos.x, pos.y],
                });
                break;
        }
        setShapes(newShapes);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsPanning(false);
        setLastPointerPosition(null);
        if (shapes.length) {
            setShapesState(shapes);
        }
    };

    const handleTextDblClick = (e) => {
        const shape = e.target;
        const textPosition = shape.getAbsolutePosition();
        const stageBox = stageRef.current.container().getBoundingClientRect();
        
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        
        textarea.value = shape.text();
        textarea.style.position = 'absolute';
        textarea.style.top = `${stageBox.top + textPosition.y}px`;
        textarea.style.left = `${stageBox.left + textPosition.x}px`;
        textarea.style.width = `${shape.width()}px`;
        textarea.style.height = `${shape.height()}px`;
        textarea.style.fontSize = '16px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = shape.lineHeight();
        textarea.style.fontFamily = shape.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = shape.align();
        textarea.style.color = shape.fill();
        
        textarea.focus();
        
        textarea.addEventListener('blur', function() {
            const newShapes = shapes.map(s => {
                if (s.id === shape.id()) {
                    return { ...s, text: textarea.value };
                }
                return s;
            });
            setShapes(newShapes);
            setShapesState(newShapes);
            document.body.removeChild(textarea);
        });
    };

    const handleSelect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(null);
            return;
        }
        setSelectedId(e.target.id());
    };

    return (
        <div id="main-container">
            <div id="options">
                <button onClick={() => setTool('rect')}>Rectangle</button>
                <button onClick={() => setTool('circle')}>Circle</button>
                <button onClick={() => setTool('line')}>Line</button>
                <button onClick={() => setTool('text')}>Text</button>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                <button onClick={undoShapes} disabled={!canUndo}>Undo</button>
                <button onClick={redoShapes} disabled={!canRedo}>Redo</button>
                <button onClick={() => {
                    setShapes([]);
                    setShapesState([]);
                }}>Clear</button>
            </div>
            
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleSelect}
                onWheel={handleWheel}
                scale={{ x: stageScale, y: stageScale }}
                position={stagePos}
                draggable={isPanning}
            >
                <Layer ref={layerRef}>
                    {shapes.map((shape) => {
                        switch (shape.type) {
                            case 'rect':
                                return (
                                    <Rect
                                        key={shape.id}
                                        id={shape.id}
                                        {...shape}
                                        draggable
                                        onTransformEnd={(e) => {
                                            const node = e.target;
                                            const newShapes = shapes.map(s => {
                                                if (s.id === shape.id) {
                                                    return {
                                                        ...s,
                                                        x: node.x(),
                                                        y: node.y(),
                                                        width: node.width() * node.scaleX(),
                                                        height: node.height() * node.scaleY(),
                                                    };
                                                }
                                                return s;
                                            });
                                            setShapes(newShapes);
                                            setShapesState(newShapes);
                                        }}
                                    />
                                );
                            case 'circle':
                                return (
                                    <Circle
                                        key={shape.id}
                                        id={shape.id}
                                        {...shape}
                                        draggable
                                    />
                                );
                            case 'line':
                                return (
                                    <Line
                                        key={shape.id}
                                        id={shape.id}
                                        {...shape}
                                        draggable
                                    />
                                );
                            case 'text':
                                return (
                                    <Text
                                        key={shape.id}
                                        id={shape.id}
                                        {...shape}
                                        draggable
                                        onDblClick={handleTextDblClick}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                    <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                </Layer>
            </Stage>
        </div>
    );
};