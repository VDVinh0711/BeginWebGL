
import { BasicTween } from "../TWEENS/basicTween.js";
import {Cube} from '../Entitys/Cube3d.js';
import { Tween } from "../TWEENS/TweenHelper.js";
import { TweenManager } from "../TWEENS/tweenmanager.js";
import { Matrix4 } from "../Utils/Matrix4Helper.js";

let gl;
let canvas;
let program;
//let cube3D;
let deltaTime = 0; // aka delta time
let oldTimeStamp = 0;

const vertexShaderSource = `
    attribute vec3 aVertexPosition;
    attribute vec2 a_texCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    varying vec2 v_texCoord;
  
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
   precision mediump float;
   uniform sampler2D u_image;

    varying vec2 v_texCoord;
    void main(void) {
       gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

function initGL() {
    canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram() {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    gl.useProgram(program);
}



let objs = [];

function Awake()
{
    const cube3D = new Cube(gl,program);
    cube3D.init(5,0,-10);
    const Cube3d2 = new Cube(gl,program);
    Cube3d2.init(0,0,-50);
    objs.push(cube3D);
    objs.push(Cube3d2);
    
    // TweenManager.createTweens(cube3D,{positionX:0.3,
    //     positionY:0.1 ,
    //    // rotationX: 5 ,
    //     rotationY : 155,
    //     scaleX:1.5  ,
    //     scaleY:1.5,
    //     scaleZ:1.5},
    //     {
    //         delay :0,
    //         duration : 2,
    //         easing: Tween.easeInOutBounce,
    //         repeat: 1,
    //         yoyo: true,
    //         onStart:()=>
    //         {
    //             console.log("play");
    //         },
    //         onComplete:()=>
    //         {
    //             console.log("complete");
    //         }
    //     }).Play();

        
    
}


let cameraAngleRadians = 0;
let numFs = 5;
    let radius = 200;

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //SetUp Camera
    const fieldOfView = 45 * Math.PI / 180; // góc nhìn
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; // tỉ lệ khung hình
    const zNear = 0.1; // khoảng cách gần
    const zFar = 100.0; // khoảng cách xa
    // const projectionMatrix = mat4.create();
    const projectionMatrix = Matrix4.createPerspectiveMatrix(fieldOfView,aspect,zNear,zFar);


    // var cameraMatrix = Matrix4.rotateY(cameraAngleRadians);
    // cameraMatrix = Ma(cameraMatrix, 0, 0, radius * 1.5);
    // var viewMatrix = Matrix4.Inverse(cameraMatrix);


    //projectionMatrix = Matrix4.multiplyMatrices4x4(projectionMatrix,viewMatrix);

   // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    //cube3D.draw(projectionMatrix);

    objs.forEach(obj => {
        obj.draw(projectionMatrix);
    });
}



function render() {
    drawScene();
}

function gameLoop(timeStamp) {
    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    deltaTime = Math.min(deltaTime, 0.1);
    oldTimeStamp = timeStamp;



    if(!isNaN(deltaTime)) 
    {
       // cube3D.update(deltaTime);
        //tween.update(deltaTime);

        objs.forEach(obj => {
            obj.update(deltaTime);
        });

        TweenManager.update(deltaTime);
        render();
    }
    requestAnimationFrame(gameLoop);
}

function main() {
    initGL();
    initShaderProgram();
    Awake();
    gameLoop();
    
}

main();
