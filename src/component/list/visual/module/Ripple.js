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
            if (!extensions.OES_texture_float) {
                return null;
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
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                    config = configs[i];
                    break;
                }
            }

            return {
                config,
                gl
            };
        },
        createImageData(width, height) {
            try {
                return new ImageData(width, height);
            } catch(e) {
                // Fallback for IE
                //let canvas = document.createElement('canvas');
                let canvas = this.canvas;
                return canvas.getContext('2d').createImageData(width, height);
            }
        },
        transparentPixels() {
            return fn.createImageData(32, 32);
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
        createProgram(vertexSource, fragmentSource, uniformValues) {
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
        isPercentage(str) {
            return str[str.length - 1] === '%';
        }
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
        this.imageUrl = options.imageUrl;

        // init WebGL canvas & init rendertargets for ripple data
        this.ctx = this.gl = gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.textures = [];
        this.framebuffers = [];
        this.bufferWriteIndex = 0;
        this.bufferReadIndex = 1;

        this.config = config = cs.config;

        config.extensions.forEach(function(name) {
           gl.getExtension(name);
        });

        for(let i = 0; i < 2; i++) {
            let texture = gl.createTexture();
            let framebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            framebuffer.width = this.resolution;
            framebuffer.height = this.resolution;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
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
        this.loadImage();

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
                vec2 dy = vec2(0.0, delta.y);
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
             varying vec2 backgroundCoord;
             void main() {
                backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
                backgroundCoord.y = 1.0 - backgroundCoord.y;
                ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
                gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
             }`
        ], [
            `precision highp float;
             uniform sampler2D samplerBackground;
             uniform sampler2D samplerRipples;
             uniform vec2 delta;
             uniform float perturbance;
             varying vec2 ripplesCoord;
             varying vec2 backgroundCoord;
             void main() {
                float height = texture2D(samplerRipples, ripplesCoord).r;
                float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;
                float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;
                vec3 dx = vec3(delta.x, heightX - height, 0.0);
                vec3 dy = vec3(0.0, heightY - height, delta.y);
                vec2 offset = -normalize(cross(dy, dx)).xz;
                float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);
                gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;
             }`
        ]);
        gl.uniform2fv(this.renderProgram.locations.delta, this.textureDelta);
    }
    initTexture() {
        let gl = this.gl;
        this.backgroundTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
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
    setTransparentTexture() {
        let gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, configSetting.transparentPixels());
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
        let gl = this.gl;
        let bindTexture = configSetting.bindTexture;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.enable(gl.BLEND);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.renderProgram.id); // this.renderProgram은 this.initShaders() 에서 선언함

        bindTexture(this.backgroundTexture, 0);
        bindTexture(this.textures[0], 1);

        gl.uniform1f(this.renderProgram.locations.perturbance, this.perturbance);
        gl.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft);
        gl.uniform2fv(this.renderProgram.locations.bottomRight, this.renderProgram.uniforms.bottomRight);
        gl.uniform2fv(this.renderProgram.locations.containerRatio, this.renderProgram.uniforms.containerRatio);
        gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
        gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);

        this.drawQuad();
        gl.disable(gl.BLEND);
    }
    update() {
        let gl = this.gl;
        gl.viewport(0, 0, this.resolution, this.resolution);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]);
        configSetting.bindTexture(this.textures[this.bufferReadIndex]);
        gl.useProgram(this.updateProgram.id);

        this.drawQuad();
        this.swapBufferIndices();
    }
    swapBufferIndices() {
        this.bufferWriteIndex = 1 - this.bufferWriteIndex;
        this.bufferReadIndex = 1 - this.bufferReadIndex;
    }
    computeTextureBoundaries() {
        let backgroundSize = this.canvas.style.backgroundSize;
        let backgroundAttachment = this.canvas.style.backgroundAttachment;
        let backgroundPosition = configSetting.translateBackgroundPosition(this.canvas.style.backgroundPosition);

        let container = {};
        if(backgroundAttachment === 'fixed') {
            container = { left: window.pageXOffset, top: window.pageYOffset};
            container.width = window.clientWidth;
            container.height = window.clientHeight;
        } else {
            container.width = this.canvas.clientWidth;
            container.height = this.canvas.clientHeight;
        }

        if(backgroundSize === 'cover') {
            let scale = Math.max(container.width / this.backgroundWidth, container.height / this.backgroundHeight);
            let backgroundWidth = this.backgroundWidth * scale;
            let backgroundHeight = this.backgroundHeight * scale;
        } else if(backgroundSize === 'contain') {
            let scale = Math.min(container.width / this.backgroundWidth, container.height/ this.backgroundHeight);
            let backgroundWidth = this.backgroundWidth * scale;
            let backgroundHeight = this.backgroundHeight * scale;
        } else {
            backgroundSize = backgroundSize.split(' ');
            let backgroundWidth = backgroundSize[0];
            let backgroundHeight = backgroundSize[1] || backgroundWidth;

            if(configSetting.isPercentage(backgroundWidth)) {
                backgroundWidth = container.width * parseFloat(backgroundWidth) / 100;
            } else if(backgroundWidth !== 'auto') {
                backgroundWidth = parseFloat(backgroundWidth);
            }

            if(configSetting.isPercentage(backgroundHeight)) {
                backgroundHeight = container.height * parseFloat(backgroundHeight) / 100;
            } else if(backgroundHeight !== 'auto') {
                backgroundHeight = parseFloat(backgroundHeight);
            }

            if(backgroundWidth === 'auto' && backgroundHeight === 'auto') {
                backgroundWidth = this.backgroundWidth;
                backgroundHeight = this.backgroundHeight;
            } else {
                if(backgroundWidth === 'auto') backgroundWidth = this.backgroundWidth * (backgroundHeight / this.backgroundHeight);
                if(backgroundHeight === 'auto') backgroundHeight = this.backgroundHeight * (backgroundWidth / this.backgroundWidth);
            }
        }

        let backgroundX = backgroundPosition[0];
        let backgroundY = backgroundPosition[1];

        if(configSetting.isPercentage(backgroundX)) {
            backgroundX = container.left + (container.width - this.backgroundWidth) * parseFloat(backgroundX) / 100;
        } else {
            backgroundX = container.left + parseFloat(backgroundX);
        }

        if(configSetting.isPercentage(backgroundY)) {
            backgroundY = container.top + (container.height - this.backgroundHeight) * parseFloat(backgroundY) / 100;
        } else {
            backgroundY = container.top + parseFloat(backgroundY);
        }

        this.renderProgram.uniforms.topLeft = new Float32Array([
            backgroundX / this.backgroundWidth,
            backgroundY / this.backgroundHeight
        ]);
        this.renderProgram.uniforms.bottomRight = new Float32Array([
           this.renderProgram.uniforms.topLeft[0] + this.canvas.clientWidth / this.backgroundWidth,
           this.renderProgram.uniforms.topLeft[1] + this.canvas.clientHeight / this.backgroundHeight
        ]);

        let maxSide = Math.max(this.canvas.width, this.canvas.height);
        this.renderProgram.uniforms.containerRatio = new Float32Array([
            this.canvas.width / maxSide,
            this.canvas.height / maxSide
        ]);
    }
    loadImage() {
        let _ = this;
        let gl = this.ctx;
        let newImageSource = this.imageUrl ||
            configSetting.extractUrl(this.originalCssBackgroundImage) ||
            configSetting.extractUrl(this.canvas.style.backgroundImage);
        let image, wrapping;

        // If image source is unchanges, don't reload it
        if(newImageSource === this.imageSource) return;

        this.imageSource = newImageSource;
        // Falsy source means no background
        if(!this.imageSource) {
            this.setTransparentTexture();
            return;
        }

        // Load the texture from a new Image
        image = new Image;
        image.onload = function() {
            gl = _.ctx;

            // Only textures width dimensions of powers of two can have repeat wrapping
            function isPowerOfTwo(x) {
                return (x&(x-1)) === 0;
            }

            wrapping = (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) ? gl.REPEAT: gl.CLAMP_TO_EDGE;
            gl.bindTexture(gl.TEXTURE_2D, _.backgroundTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGEND_BYTE, image);

            _.backgroundWidth = image.width;
            _.backgroundHeight = image.height;

            _.hideCssBackground();
        };
        image.onerror = function() {
            gl = _.ctx;
            _.setTransparentTexture();
        };

        image.crossOrigin = configSetting.isDataUri(this.imageSource) ? null : this.crossOrigin;
        image.src = this.imageSource;
    }
    hideCssBackground() {
        // check whether we're changing inline css or overriding a global css rule
        let inlineCss = this.canvas.style.backgroundImage;
        if(inlineCss === 'none') return;

        this.originalInlineCss = inlineCss;
        this.originalCssBackgroundImage = this.canvas.css('backgroundImage');
        this.canvas.css('backgroundImage', 'none');
    }
    restoreCssBackground() {
        this.canvas.css('backgroundImage', this.originalInlineCss || '');
    }
    dropAtPointer(pointer, radius, strength) {
        this.drop(
            pointer.pageX,
            pointer.pageY,
            radius,
            strength
        );
    }
    /*  Public Methods  */
    drop(x, y, radius, strength) {
        let gl = this.gl;
        let elWidth = this.canvas.width;
        let elHeight = this.canvas.height;
        let longestSide = Math.max(elWidth, elHeight);
        let dropPosition;

        radius = radius / longestSide;
        dropPosition = new Float32Array([
            (2 * x - elWidth) / longestSide,
            (elHeight - 2 * y) / longestSide
        ]);
        console.log(gl)
        gl.viewport(0, 0, this.resolution, this.resolution);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]);
        configSetting.bindTexture(this.textures[this.bufferReadIndex]);

        gl.useProgram(this.dropProgram.id);
        gl.uniform2fv(this.dropProgram.locations.center, dropPosition);
        gl.uniform1f(this.dropProgram.locations.radius, radius);
        gl.uniform1f(this.dropProgram.locations.strength, strength);

        this.drawQuad();
        this.swapBufferIndices();
    }
    pause() {
        this.running = false;
    }
    play() {
        this.running = true;
    }
    set(property, value) {
        switch(property) {
            case 'dropRadius':
            case 'perturbance':
            case 'interactive':
            case 'crossOrigin':
                this[property] = value;
                break;
        }
    }
}

export default Ripple;