class WebGLMainApp {
    constructor() {
        this.canvas = document.getElementById("webgl-canvas");
        if (!this.canvas) {
            alert("canvas could not be obtained");
        }
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            alert("no webgl-context could be obtained");
        }
    }

    getShader(id) {
        const script = document.getElementById(id);
        const shaderString = script.text.trim();

        var shader;
        if (script.type === 'x-shader/x-vertex') {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        } else if (script.type === 'x-shader/x-fragment') {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        } else {
            return null;
        }

        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    createProgram(vertexShaderName, fragmentShaderName) {
        const vertexShader = this.getShader(vertexShaderName);
        const fragmentShader = this.getShader(fragmentShaderName);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Could not initialize shaders');
        }

        this.gl.useProgram(this.program);

        return this.program;
    }

    setProgramAttribShaderVariablesLocation(program, variables) {
        if (variables == null) return;
        var i;
        for (i = 0; i < variables.length; i++) {
            program[variables[i]] = this.gl.getAttribLocation(program, variables[i]);
        }
    }

    setProgramUniformShaderVariablesLocation(program, variables) {
        if (variables == null) return;
        var i;
        for (i = 0; i < variables.length; i++) {
            program[variables[i]] = this.gl.getUniformLocation(program, variables[i]);
        }
    }

    setProgramUniformShaderVariablesValues(program, variables) {
        if (variables == null) return;
        var v;
        for (v in variables) {
            var type = variables[v][0];

            if (type === "1i") {
                this.gl.uniform1i(program[v], variables[v][1]);
            } else if (type === "2i") {
                this.gl.uniform2i(program[v], variables[v][1], variables[v][2]);
            } else if (type === "3i") {
                this.gl.uniform3i(program[v], variables[v][1], variables[v][2], variables[v][3]);
            } else if (type === "4i") {
                this.gl.uniform4i(program[v], variables[v][1], variables[v][2], variables[v][3], variables[v][4]);
            } else if (type === "1f") {
                this.gl.uniform1f(program[v], variables[v][1]);
            } else if (type === "2f") {
                this.gl.uniform2f(program[v], variables[v][1], variables[v][2]);
            } else if (type === "3f") {
                this.gl.uniform3f(program[v], variables[v][1], variables[v][2], variables[v][3]);
            } else if (type === "4f") {
                this.gl.uniform3f(program[v], variables[v][1], variables[v][2], variables[v][3], variables[v][4]);
            } else if (type === "mat2") {
                this.gl.uniformMatrix2fv(program[v], variables[v][1], variables[v][2]);
            } else if (type === "mat3") {
                this.gl.uniformMatrix3fv(program[v], variables[v][1], variables[v][2]);
            } else if (type === "mat4") {
                this.gl.uniformMatrix4fv(program[v], variables[v][1], variables[v][2]);
            }
        }
    }

    create() {
        throw new Error("Method 'create()' must be implemented.");
    }

    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.draw();
    }

    init() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.create();
        this.render();
    }
}
