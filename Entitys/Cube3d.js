
import { Matrix4 } from "../Utils/Matrix4Helper.js";

export class Cube {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.positionBuffer = null;
        this.textureBuffer = null;
        this.indexBuffer = null;
        this.texture = null;

        //position
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = -10;

        //rotate
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;

        //scale
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;


        this.image = new Image();
        this.onload = false;
        this.projectionMatrixLocation = null;
        this.modelViewMatrixLocation = null;
        this.initUniform();
        this.initBuffers();
        this.initTexture();
    }

    init(posx,posy,posz)
    {
        this.positionX = posx;
        this.positionY = posy;
        this.positionZ = posz;
    }
    initUniform() {
        this.projectionMatrixLocation = this.gl.getUniformLocation(this.program, "uProjectionMatrix");
        this.modelViewMatrixLocation = this.gl.getUniformLocation(this.program, "uModelViewMatrix");
    }

    initBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);


        this.textureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        const textureCoords = [
           // Front face
           0.0, 0.0,
            0.25, 0.0,
            0.25, 0.5,
            0.0, 0.5,

            // Back face (top-right image)
            0.25, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.25, 0.5,

            // Top face (middle-left image)
            0.0, 0.5,
            0.25, 0.5,
            0.25, 1.0,
            0.0, 1.0,

            // Bottom face (middle-right image)
            0.25, 0.5,
            0.5, 0.5,
            0.5, 1.0,
            0.25, 1.0,

            // Right face (bottom-left image)
            0.5, 0.0,
            0.75, 0.0,
            0.75, 0.5,
            0.5, 0.5,

            // Left face (bottom-right image)
            0.5, 0.5,
            0.75, 0.5,
            0.75, 1.0,
            0.5, 1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        const indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23    // left
        ];
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }

    initTexture() {
        this.texture = this.gl.createTexture();
        this.image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
            // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

            if ( this.isPowerOf2(this.image.width) && this.isPowerOf2(this.image.height)) {
                // Yes, it's a power of 2. Generate mips.
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
             } else {
                // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
             }

            this.onload = true;

        }
        this.image.src = './noodles.jpg';
    }

    draw(projectionMatrix) {

        if(!this.onload) return;
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.positionX, this.positionY, this.positionZ]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotationX, [this.rotationX, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotationY, [0, this.rotationY, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotationY, [0, 0, this.rotationZ]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [this.scaleX, this.scaleY, this.scaleZ]);


        
        //Compute Matrix
        let matrix = Matrix4.Indenity();
        let translateMatrix = Matrix4.Translation(this.positionX,this.positionY,this.positionZ);
        let rotateMatrixX = Matrix4.rotateX(this.rotationX);
        let rotateMatrixY = Matrix4.rotateY(this.rotationY);
        let rotateMatrixZ = Matrix4.rotateZ(this.rotationZ);
        let scaleMatrix = Matrix4.scaling(this.scaleX,this.scaleY,this.scaleZ);


        matrix = Matrix4.multiplyMatrices4x4(matrix,rotateMatrixX);
        matrix = Matrix4.multiplyMatrices4x4(matrix,rotateMatrixY);
        matrix = Matrix4.multiplyMatrices4x4(matrix,rotateMatrixZ);
        matrix = Matrix4.multiplyMatrices4x4(matrix,translateMatrix);
      
        matrix = Matrix4.multiplyMatrices4x4(matrix,scaleMatrix);

        this.gl.uniformMatrix4fv(this.projectionMatrixLocation, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.modelViewMatrixLocation, false, matrix);



        // set Position
        const vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vertexPosition);




        //texture

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(texCoordLocation);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_image'), 0);
        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }

    update(deltaTime) {
        
        //Dosomething
        this.rotationX+=deltaTime;
        this.rotationY+=deltaTime;
    }


    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
      }
}