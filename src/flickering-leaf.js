(function () {
    "use strict";

    fluid.registerNamespace("colin");

    fluid.defaults("colin.flickeringLeaf", {
        gradeNames: ["aconite.videoCompositor", "autoInit"],

        components: {
            glRenderer: {
                type: "colin.flickeringLeaf.glRenderer"
            },

            top: {
                type: "colin.flickeringLeaf.topLayer"
            },

            bottom: {
                type: "colin.flickeringLeaf.bottomLayer"
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.topLayer", {
        gradeNames: ["aconite.videoCompositor.topLayer", "autoInit"],

        components: {
            source: {
                options: {
                    url: "videos/1.webm"
                }
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.bottomLayer", {
        gradeNames: ["aconite.videoCompositor.bottomLayer", "autoInit"],

        components: {
            source: {
                options: {
                    url: "videos/2.webm"
                }
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.glRenderer", {
        gradeNames: ["aconite.glComponent", "autoInit"],

        shaders: {
            fragment: "src/shaders/fragmentShader.frag",
            vertex: "src/shaders/vertexShader.vert"
        },

        attributes: {
            aVertexPosition: {
                type: "vertexAttribArray"
            }
        },

        uniforms: {
            topSampler: {
                type: "i",
                value: 0
            },
            bottomSampler: {
                type: "i",
                value: 1
            },
            threshold: {
                type: "f",
                value: 0.9
            },
            textureSize: {
                type: "f",
                value: [
                    1280, 720
                ]
            }
        }
    });

}());
