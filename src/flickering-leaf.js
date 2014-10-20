(function () {
    "use strict";

    fluid.registerNamespace("colin");

    fluid.defaults("colin.flickeringLeaf", {
        gradeNames: ["aconite.videoCompositor", "autoInit"],

        stageBackgroundColor: {
            r: 0.0,
            g: 1.0,
            b: 1.0,
            a: 1.0
        },

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
            static: {
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
                    value: 0.01
                },
                textureSize: {
                    type: "f",
                    value: [
                        "{top}.layer.source.element.videoWidth",
                        "{bottom}.layer.source.element.videoHeight"
                    ]
                }

            }
        }
    });

}());
