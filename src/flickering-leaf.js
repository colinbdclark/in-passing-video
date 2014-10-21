(function () {
    "use strict";

    fluid.registerNamespace("colin");

    fluid.defaults("colin.flickeringLeaf", {
        gradeNames: ["aconite.videoCompositor", "autoInit"],

        model: {
            time: Date.now(),
            sparkThreshold: "{thresholdSynth}.options.synthDef.start"
        },

        uniformModelMap: {
            time: "time",
            sparkThreshold: "sparkThreshold"
        },

        invokers: {
            updateModel: "colin.flickeringLeaf.updateModel({that}.applier, {thresholdSynth}, {seedSynth})"
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
            },

            thresholdSynth: {
                type: "flock.synth.frameRate",
                options: {
                    synthDef: {
                        ugen: "flock.ugen.line",
                        start: -0.0293,
                        end: 1.0,
                        duration: (12 * 60) + 30
                    },

                    fps: 60
                }
            },

            // TODO: Slow this down somewhat over the course of the video.
            seedSynth: {
                type: "flock.synth.frameRate",
                options: {
                    synthDef: {
                        id: "seedSine",
                        ugen: "flock.ugen.lfNoise",
                        freq: {
                            ugen: "flock.ugen.sinOsc",
                            phase: -0.5,
                            freq: {
                                ugen: "flock.ugen.lfNoise",
                                options: {
                                    interpolation: "linear",
                                },
                                mul: 1/30,
                                add: 1/30
                            },
                            mul: 20,
                            add: 40
                        },
                        mul: 0.5,
                        add: 0.5,
                    },

                    fps: 60
                }
            },

            playButton: {
                options: {
                    selectors: {
                        fullScreen: "{flickeringLeaf}.options.selectors.stage"
                    }
                }
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.topLayer", {
        gradeNames: ["aconite.videoCompositor.topLayer", "autoInit"],

        components: {
            source: {
                options: {
                    url: "videos/720-h264/1.m4v#t=00:01:55,00:14:53"
                }
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.bottomLayer", {
        gradeNames: ["aconite.videoCompositor.bottomLayer", "autoInit"],

        components: {
            source: {
                options: {
                    url: "videos/720-h264/2.m4v#t=00:01:55,00:14:53"
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
            sparkThreshold: {
                type: "f",
                value: 0.04
            },
            textureSize: {
                type: "f",
                value: [
                    "{flickeringLeaf}.dom.stage.0.width", "{flickeringLeaf}.dom.stage.0.height"
                ]
            },
            time: {
                type: "f",
                value: Date.now()
            }
        }
    });

    colin.flickeringLeaf.updateModel = function (applier, thresholdSynth, seedSynth) {
        applier.change("time", seedSynth.value());
        applier.change("sparkThreshold", thresholdSynth.value());
    };
}());
