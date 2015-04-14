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
                type: "colin.flickeringLeaf.thresholdSynth"
            },

            seedSynth: {
                type: "colin.flickeringLeaf.seedSynth"
            },

            playButton: {
                options: {
                    selectors: {
                        fullScreen: "{flickeringLeaf}.options.selectors.stage"
                    }
                }
            }
        },

        listeners: {
            onPlay: "colin.flickeringLeaf.scheduleChanges({top}, {thresholdSynth})"
        },

        selectors: {
            fpsCounter: ".aconite-fps-display"
        }
    });


    colin.flickeringLeaf.scheduleChanges = function (top, thresholdSynth) {
        var clipSequence = top.model.clipSequence;

        top.scheduler.once(clipSequence[0].duration, function () {
            thresholdSynth.set({
                "threshold.start": -1,
                "threshold.end": -1,
                "threshold.duration": clipSequence[1].duration
            });
        });

        top.scheduler.once(clipSequence[0].duration + clipSequence[1].duration, function () {
            thresholdSynth.set({
                "threshold.start": -0.0293,
                "threshold.end": 1.0,
                "threshold.duration": clipSequence[2].duration - 20
            });
        });
    };


    fluid.defaults("colin.flickeringLeaf.thresholdSynth", {
        gradeNames: ["flock.synth.frameRate", "autoInit"],

        fps: 60,

        synthDef: {
            id: "threshold",
            ugen: "flock.ugen.line",
            start: -0.0293,
            end: 1.0,
            duration: (14 * 60)
        }
    });


    fluid.defaults("colin.flickeringLeaf.seedSynth", {
        gradeNames: ["flock.synth.frameRate", "autoInit"],

        fps: 60,

        synthDef: {
            id: "seedSine",
            ugen: "flock.ugen.lfNoise",
            freq: {
                ugen: "flock.ugen.triOsc",
                phase: -0.5,
                freq: {
                    // TODO: Slow this down somewhat over the course of the video.
                    ugen: "flock.ugen.lfNoise",
                    options: {
                        interpolation: "linear",
                    },
                    mul: {
                        ugen: "flock.ugen.line",
                        start: 1/30,
                        end: 1/60
                    },
                    add: {
                        ugen: "flock.ugen.line",
                        start: 1/30,
                        end: 1/60
                    }
                },
                mul: {
                    ugen: "flock.ugen.line",
                    duration: (14 * 60) + 53,
                    start: 20,
                    end: 7.5
                },
                add: {
                    ugen: "flock.ugen.line",
                    duration: (14 * 60) + 53,
                    start: 40,
                    end: 7.5
                }
            },
            mul: 0.5,
            add: 0.5
        }
    });


    fluid.defaults("colin.flickeringLeaf.topSequencer", {
        gradeNames: ["aconite.clipSequencer.static", "autoInit"],

        model: {
            clipSequence: [
                {
                    url: "videos/1080-h264/1.m4v",
                    inTime: "00:01:55",
                    outTime: "00:14:53"
                },
                {
                    url: "videos/1080-h264/3.m4v",
                    inTime: "00:00:01",
                    outTime: "00:03:32"
                },
                {
                    url: "videos/1080-h264/4.m4v",
                    inTime: "00:00:01",
                    outTime: "00:02:47"
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
                    inTime: "00:01:55",
                    outTime: "00:14:53"
                },
                {
                    url: "videos/1080-h264/3.m4v",
                    inTime: "00:00:01",
                    outTime: "00:03:32"
                },
                {
                    url: "videos/1080-h264/5.m4v",
                    inTime: "00:00:01",
                    outTime: "00:02:47"
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
