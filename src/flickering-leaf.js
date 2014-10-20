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
                type: "colin.flickeringLeaf.topSequencer"
            },

            bottom: {
                type: "colin.flickeringLeaf.bottomSequencer"
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.topSequencer", {
        gradeNames: ["aconite.clipSequencer", "autoInit"],

        clipSequence: [
            {
                url: "videos/1.webm",
                inTime: 0,
                duration: (14 * 60) + 56
            },
            {
                url: "videos/4.webm",
                inTime: 0,
                duration: (14 * 60) + 56

            }
        ],

        // TODO: Having to specify this is obviously a bug.
        components: {
            layer: {
                options: {
                    components: {
                        source: {
                            options: {
                                url: "{topSequencer}.options.clipSequence.0.url"
                            }
                        }
                    }
                }
            },

            preRoller: {
                options: {
                    url: "{topSequencer}.options.clipSequence.1.url"
                }
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.bottomSequencer", {
        gradeNames: ["aconite.clipSequencer", "autoInit"],

        clipSequence: [
            {
                url: "videos/2.webm",
                inTime: 0,
                duration: (14 * 60) + 56
            },
            {
                url: "videos/5.webm",
                inTime: 0,
                duration: (14 * 60) + 56
            }
        ],

        components: {
            layer: {
                options: {
                    components: {
                        source: {
                            options: {
                                url: "{bottomSequencer}.options.clipSequence.0.url"
                            }
                        }
                    }
                }
            },
            preRoller: {
                options: {
                    url: "{bottomSequencer}.options.clipSequence.1.url"
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
