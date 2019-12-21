let configSetting = (function() {
    let fn, gl;
    fn = {
        init(canvas) {
            let extensions = {};
            let configs = [], config = null;
            let texture, framebuffer;

            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if(!gl) return null; // Browswer does not support WebGL
            [
                'OES_texture_float', 'OES_texture_half_float',
                'OES_texture_float_linear', 'OES_texture_half_float_linear'
            ].forEach((name) => {
                let extension = gl.getExtension(name);
                if(extension) extensions[name] = extension;
            });

            configs.push(createConfig('float', gl.FLOAT));
            if(extensions.OES_texture_half_float) configs.push(createConfig('half_float', extensions.OES_texture_half_float.HALF_FLOAT_OES));

            texture = gl.createTexture(); // 텍스쳐 생성
            framebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.bindTexture(gl.TEXTURE_2D, texture); // 텍스처 객체를 gl.TEXTURE_2D에 바인딩해야 함
            // 아래의 코드들은 WebGL 지원 디바이스는 어떤 해상도의 텍스쳐든 처리할 수 있는 최대한의 해상도까지 자동으로 처리하도록 함
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            for(let i = 0; i < configs.length; i++) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, configs[i].type, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENTO, gl.TEXTURE_2D, texture, 0);
                /*if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                    config = configs[i];
                    break;
                }*/
                config = configs[i];
            }

            function createConfig(type, glType) {
                let name = `OES_texture_${type}`;
                let nameLinear = `${name}_linear`;
                let linearSupport = nameLinear in extensions;
                let configExtensions = [name];

                if(linearSupport) configExtensions.push(nameLinear);

                return {
                    type: glType,
                    linearSupport: linearSupport,
                    extensions: configExtensions
                }
            }

            return {
                config,
                gl,
                transparentPixels: fn.createImageData(32, 32)
            };
        },
        createImageData(width, height) {
            try {
                return new ImageData(width, height);
            } catch(e) {
                // Fallback for IE
                let canvas = document.createElement('canvas');
                return canvas.getContext('2d').createImageData(width, height);
            }
        },
        translateBackgroundPosition(value) {
            let parts = value.split(' ');

            if(parts.length === 1) {
                switch(value) {
                    case 'center':
                        return ['50%', '50%'];
                    case 'top':
                        return ['50%', '0'];
                    case 'bottom':
                        return ['0', '50%'];
                    case 'left':
                        return ['0', '50%'];
                    case 'right':
                        return ['100%', '50%'];
                    default:
                        return [value, '50%'];
                }
            } else {
                return parts.map(function(part) {
                    switch(value) {
                        case 'center':
                            return '50%';
                        case 'top':
                        case 'left':
                            return '0';
                        case 'right':
                        case 'bottom':
                            return '100%';
                        default:
                            return part;
                    }
                });
            }
        },
        createProgram(vertexSource, fragmentSource, uiformValues) {
            let program = {};
            let match, name,
                regex = /uniform (\w+) (\w+)/g,
                shaderCode = vertexSource + fragmentSource;

            program.id = gl.createProgram();
            gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource));
            gl.attachShader(program.id, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
            gl.linkProgram(program.id);
            if(!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
                throw new Error(`link error: ${gl.getProgramInfoLog(program.id)}`);
            }

            // Fetch the uniform and attribute locations
            program.uniforms = {};
            program.locations = {};
            gl.useProgram(program.id);
            gl.enableVertexAttribArray(0);
            while((match = regex.exec(shaderCode)) !== null) {
                name = match[2];
                program.locations[name] = gl.getUniformLocation(program.id, name);
            }

            function compileSource(type, source) {
                let shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    throw new Error(`compile error: ${gl.getShaderInfoLog(shader)}`);
                }
                return shader;
            }

            return program;
        },
        bindTexture(texture, unit) {
            gl.activeTexture(gl.TEXTURE0 + (unit || 0));
            gl.bindTexture(gl.TEXTURE_2D, texture);
        },
        extractUrl(value) {
            let urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
            if(urlMatch === null) return null;
            return urlMatch[1];
        },
        isDataUri(url) {
            return url.match(/^data:/);
        },
    };
    //return fn.loadConfig;

    return fn;
})();

class Ripple {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.options = options;
    }
    init() {
        let _ = this;
        let options = this.options;
        let cs = configSetting.init(this.canvas);
        let config, gl; // this.config, this.gl caching

        this.resize();
        window.onresize = () => { this.resize(); }

        // init properties from options
        this.interactive = options.interactive;
        this.resolution = options.resolution || 256;
        this.textureDelta = new Float32Array([1 / this.resolution, 1 / this.resolution]);
        this.perturbance = options.perturbance || 0.03;
        this.dropRadius = options.dropRadius || 20;
        this.crossOrigin = options.crossOrigin || '';
        this.imageUrl = options.imageUrl || null;

        // init WebGL canvas & init rendertargets for ripple data
        this.ctx = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.textures = [];
        this.framebuffers = [];
        this.buffetWriteIndex = 0;
        this.bufferReadIndex = 1;

        this.config = config = cs.config;
        this.gl = gl = cs.gl;

        for(let i = 0; i < 2; i++) {
            let texture = gl.createTexture();
            let framebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            framebuffer.width = this.resolution;
            framebuffer.height = this.resolution;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, config.linearSupport ? gl.LINEAR: gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.resolution, this.resolution, 0, gl.RGBA, config.type, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            this.textures.push(texture);
            this.framebuffers.push(framebuffer);
        }

        // init GL stuff
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            +1, -1,
            +1, +1,
            -1, +1
        ]), gl.STATIC_DRAW);
        this.initShaders();
        this.initTexture();
        this.setTransparentTexture();

        // Load the image either from the options or css rules
        //this.loadImage();

        // Set correct clear color and blend mode (regular alpha blending)
        gl.clearColor(0, 0, 0, 0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Plugin is successfully initialized!
        this.visible = true;
        this.running = true;
        this.inited = true;
        this.setupPointerEvents();

        // init animation
        function step() {
            _.step();
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    resize() {
        let canvas = this.canvas;
        if((canvas.width !== canvas.clientWidth) || (canvas.height !== canvas.clientHeight)) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }
    initShaders() {
        let gl = this.gl;
        let createProgram = configSetting.createProgram;
        let vertexShader = [
            `attribute vec2 vertex;
             varying vec2 coord;
             void main() {
                coord = vertex * 0.5 + 0.5;
                gl_Position = vec4(vertex, 0.0, 1.0);
             }`
        ];

        this.dropProgram = createProgram(vertexShader, [
            `precision highp float;
             const float PI = 3.141592653589793;
             uniform sampler2D texture;
             uniform vec2 center;
             uniform float radius;
             uniform float strength;
             varying vec2 coord;
             void main() {
                vec4 info = texture2D(texture, coord);
                float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
                drop = 0.5 - cos(drop * PI) * 0.5;
                info.r += drop * strength;
                gl_FragColor = info;
             }`
        ]);
        this.updateProgram = createProgram(vertexShader, [
           `precision highp float;
            uniform sampler2D texture;
            uniform vec2 delta;
            varying vec2 coord;
            void main() {
                vec4 info = texture2D(texture, coord);
                vec2 dx = vec2(delta.x, 0.0);
                vec2 dy - vec2(0.0, delta.y);
                float average = (
                    texture2D(texture, coord - dx).r +
                    texture2D(texture, coord - dy).r +
                    texture2D(texture, coord + dx).r +
                    texture2D(texture, coord + dy).r
                ) * 0.25;
                info.g += (average - info.r) * 2.0;
                info.g *= 0.995;
                info.r += info.g;
                gl_FragColor = info;
            }`
        ]);
        gl.uniform2fv(this.updateProgram.locations.delta, this.textureDelta);

        this.renderProgram = createProgram([
            `precision highp float;
             attribute vec2 vertex;
             uniform vec2 topLeft;
             uniform vec2 bottomRight;
             uniform vec2 containerRatio;
             varying vec2 ripplesCoord;
             varying vec2 backgroundCoords;
             void main() {
                backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
                backgroundCoord.y = 1.0 - backgroundCoord.y;
                ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
                gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
             }`
        ], [
            `precision highp float;
             uniform sampler2D sampleBackground;
             uniform sampler2D samplerRipples;
             uniform vec2 delta;
             uniform float perturbance;
             varying vec2 ripplesCoord;
             varying vec2 backgroundCoord;
             void main() {
                float height = texture2D(samplerRipples, ripplesCoord).r;
                float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;
                float heightY = texture2D(samplerRipples, vec2(ripplesCoord.xm ripplesCoord.y, delta.y)).r;
                vec3 dx = vec3(delta.x, heightX - height, 0.0);
             }`
        ])
    }
    setupPointerEvents() { // set up pointer (mouse + touch) events
        let _ = this;
        let pointerEventsEnabled = this.visible && this.running && this.interactive;

        this.canvas.onmousemove = function(e) {
            dropAtPointer(e);
        }
        this.canvas.ontouchmove = function(e) {
            let touches = e.originEvent.changedTouches;
            for(let i = 0; i < touches.length; i++) {
                dropAtPointer(touches[i]);
            }
        }
        this.canvas.onmousedown = function(e) {
            dropAtPointer(e, true);
        }

        function dropAtPointer(pointer, big) {
            if(pointerEventsEnabled) {
                _.dropAtPointer(pointer, _.dropRadius * (big ? 1.5 : 1), (big ? 0.14 : 0.01));
            }
        }
    }
    step() { // animation
        let gl = this.ctx;
        if(!this.visible) return;

        this.computeTextureBoundaries();
        if(this.running) this.update();
        this.render();
    }
    drawQuad() {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    render() {
        /*let gl = this.gl;
        let bindTexture = configSetting.bindTexture;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.quad);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.enable(gl.BLEND);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.renderProgram.id); // this.renderProgram은 this.initShaders() 에서 선언함

        bindTexture(this.backgroundTexture, 0);*/
    }

    initTexture() {}
    setTransparentTexture() {}
    //loadImage() {}
    dropAtPointer() {}
    computeTextureBoundaries() {}
    update() {}

}

export default Ripple;