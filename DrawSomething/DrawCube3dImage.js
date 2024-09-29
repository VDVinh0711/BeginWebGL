    import {Cube} from '../Entitys/Cube3d.js';
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

    }


    let cameraAngleRadians = 0;
    let numFs = 5;
        let radius = 200;

    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //SetUp projecttion
        const fieldOfView = 60 * Math.PI / 180; // góc nhìn
        const aspect = (gl.canvas.clientWidth / gl.canvas.clientHeight) * 1; // tỉ lệ khung hình
        const zNear = 0.1; // khoảng cách gần
        const zFar = 10000.0; // khoảng cách xa
        const projectionMatrix = Matrix4.createPerspectiveMatrix(fieldOfView,aspect,zNear,zFar);

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
