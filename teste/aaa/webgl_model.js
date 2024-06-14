class WebGLModel {
    constructor(gl, program, dim, primitiveType, coords, indices, colors) {
        this.gl = gl;
        this.program = program;
        this.dim = dim;
        this.primitiveType = primitiveType;
        this.coords = coords;
        this.indices = indices;
        this.colors = colors;
        this.VAO = null;
        this.coordsVBO = null;
        this.colorsVBO = null;
        this.IBO = null;
    }

    useProgram() {
        this.gl.useProgram(this.program);
    }

    initBuffers() {
        this.VAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.VAO);

        this.coordsVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.coordsVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.coords), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, 'aVertexPosition'), 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, 'aVertexPosition'));

        if (this.colors) {
            this.colorsVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorsVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, 'aVertexColor'), 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, 'aVertexColor'));
        }

        if (this.indices) {
            this.IBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
        }

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    set(attribShaderVariables, uniformShaderVariables) {
        this.initBuffers();
        this.useProgram();
    }

    draw() {
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        this.gl.drawElements(this.primitiveType, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
