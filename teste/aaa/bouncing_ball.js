class MyWebGLMainApp extends WebGLMainApp {
    constructor() {
        super();
        this.program = null;
        this.ballModel = null;
        this.lastTime = 0;
        this.ballPosition = [0, 0.5];
        this.ballVelocity = [0.5, -1];
        this.ballSize = 0.1;
        this.gravity = -9.8;
        this.bounce = 0.8;
        this.damping = 0.99;
    }

    create() {
        this.program = this.createProgram("vertex-shader", "fragment-shader");
        this.attribShaderVariables = ["aVertexPosition"];
        this.uniformShaderVariables = ["uModelViewMatrix"];
        this.setProgramAttribShaderVariablesLocation(this.program, this.attribShaderVariables);
        this.setProgramUniformShaderVariablesLocation(this.program, this.uniformShaderVariables);

        const numSegments = 100;
        const positions = [];
        for (let i = 0; i <= numSegments; i++) {
            const angle = 2 * Math.PI * i / numSegments;
            positions.push(Math.cos(angle), Math.sin(angle));
        }
        const indices = [];
        for (let i = 1; i < numSegments; i++) {
            indices.push(0, i, i + 1);
        }
        indices.push(0, numSegments, 1); // Fechar o círculo

        this.ballModel = new WebGLModel(this.gl, this.program, 2, this.gl.TRIANGLES, positions, indices);
        this.ballModel.initBuffers();
    }

    draw() {
        const now = Date.now() * 0.001;
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        this.ballVelocity[1] += this.gravity * deltaTime;
        this.ballPosition[0] += this.ballVelocity[0] * deltaTime;
        this.ballPosition[1] += this.ballVelocity[1] * deltaTime;

        if (this.ballPosition[0] + this.ballSize > 1 || this.ballPosition[0] - this.ballSize < -1) {
            this.ballVelocity[0] = -this.ballVelocity[0];
        }

        if (this.ballPosition[1] - this.ballSize < -1) {
            this.ballVelocity[1] = -this.ballVelocity[1] * this.bounce;
            this.ballPosition[1] = -1 + this.ballSize;
            this.ballVelocity[0] *= this.damping;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.ballPosition[0], this.ballPosition[1], 0.0]);
        mat4.scale(modelViewMatrix, modelViewMatrix, [this.ballSize, this.ballSize * (1 - Math.abs(this.ballVelocity[1]) / 10), this.ballSize]);

        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'uModelViewMatrix'), false, modelViewMatrix);

        this.ballModel.draw();
    }

    init() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        super.init();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new MyWebGLMainApp();
    app.init();
});
