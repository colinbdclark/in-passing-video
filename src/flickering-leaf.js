(function () {
    "use strict";

    fluid.registerNamespace("colin");

    fluid.defaults("colin.flickeringLeaf", {
        gradeNames: ["aconite.videoSequenceCompositor", "autoInit"],

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
            // TODO: Remove when not debugging.
            frameCounter: {
                type: "aconite.animationClock.frameCounter",
                container: "{that}.options.selectors.fpsCounter"
            },

            glRenderer: {
                type: "colin.flickeringLeaf.glRenderer"
            },

            top: {
                type: "colin.flickeringLeaf.topSequencer"
            },

            bottom: {
                type: "colin.flickeringLeaf.bottomSequencer"
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
                            mul: {
                                ugen: "flock.ugen.line",
                                duration: (12 * 60) + 30,
                                start: 20,
                                end: 7.5
                            },
                            add: {
                                ugen: "flock.ugen.line",
                                duration: (12 * 60) + 30,
                                start: 40,
                                end: 7.5
                            }
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
        },

        selectors: {
            fpsCounter: ".aconite-fps-display"
        }
    });

    fluid.defaults("colin.flickeringLeaf.topSequencer", {
        gradeNames: ["aconite.clipSequencer.static", "autoInit"],

        model: {
            clipSequence: [
                {
                    url: "videos/1080-h264/1.m4v",
                    inTime: (1 * 60) + 55,
                    duration: (12 * 60) + 58
                }
            ]
        },

        components: {
            layer: {
                type: "aconite.videoCompositor.topLayer"
            }
        }
    });

    fluid.defaults("colin.flickeringLeaf.bottomSequencer", {
        gradeNames: ["aconite.clipSequencer.static", "autoInit"],

        model: {
            clipSequence: [
                {
                    url: "videos/1080-h264/2.m4v",
                    inTime: (1 * 60) + 55,
                    duration: (12 * 60) + 58
                }
            ]
        },

        components: {
            layer: {
                type: "aconite.videoCompositor.bottomLayer"
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
        // TODO: With the refactoring of flock.synth, this can now be done declaratively.
        applier.change("time", seedSynth.value());
        applier.change("sparkThreshold", thresholdSynth.value());
    };
}());
