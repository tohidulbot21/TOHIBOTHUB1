declare const ImageAdjust: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly brightness: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly contrast: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly clarity: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly saturation: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly hue: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly shadows: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly highlights: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly temperature: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Enter an integer value from -100 to +100.";
                readonly default: 0;
            };
            readonly sharpen: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Enter an integer value from 0 to +100.";
                readonly default: 0;
            };
            readonly noise: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Enter an integer value from 0 to +100.";
                readonly default: 0;
            };
            readonly vignette: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Enter an integer value from 0 to +100.";
                readonly default: 0;
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats. Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageApplyAiEffect: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["effect_name"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly effect_name: {
                readonly type: "string";
                readonly enum: readonly ["winterblues", "wispy", "geode", 744, "sketchy", "dystopia", "libtest2", "pastel", "moonlight", "rainbow", "money", "popsketch", "hintofyellow", "badlands", "letitsnow", "flora", "staygold", "holidayparty", "galaxy", "crushedmarble", "pow", "shades_of_gray", "haze", "shamrock", 815, "flare", "prettyinpink", "rosegold", "wonderland", "whiteice", "nightcore", "pleinair34_120", "soul", "rosequartz", "animation", "feast", "undead", "highlight", "neopop", "midnight", "colorbright", "cartoon1", "cartoon2"];
                readonly description: "Choose an effect from the dropdown menu. The list of effects are as follows\n  * winterblues\n  * wispy\n  * geode\n  * 744\n  * sketchy\n  * dystopia\n  * libtest2\n  * pastel\n  * moonlight\n  * rainbow\n  * money\n  * popsketch\n  * hintofyellow\n  * badlands\n  * letitsnow\n  * flora\n  * staygold\n  * holidayparty\n  * galaxy\n  * crushedmarble\n  * pow\n  * shades_of_gray\n  * haze\n  * shamrock\n  * 815\n  * flare\n  * prettyinpink\n  * rosegold\n  * wonderland\n  * whiteice\n  * nightcore\n  * pleinair34_120\n  * soul\n  * rosequartz\n  * animation\n  * feast\n  * undead\n  * highlight\n  * neopop\n  * midnight\n  * colorbright\n  * cartoon1\n  * cartoon2\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the output image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageApplyEffect: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["effect_name"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly effect_name: {
                readonly type: "string";
                readonly enum: readonly [1972, "apr1", "apr2", "apr3", "blur", "gblur", "lensblur", "motionblur", "smartblur", "pixelize", "brl1", "brnz1", "brnz2", "brnz3", "brnz4", "cyber1", "cyber2", "dodger", "food1", "food2", "icy1", "icy2", "icy3", "mnch1", "mnch2", "mnch3", "nature1", "nature2", "noise", "ntrl1", "ntrl2", "popart", "saturation", "sft1", "sft2", "sft3", "sft4", "shadow1", "shadow2", "sketch1", "sketch2", "sketch3", "sketcher1", "sketcher2", "spc1", "tl1", "tl2", "urban1", "urban2", "water1", "water2"];
                readonly description: "Choose an effect from the dropdown menu. The list of effects are as follows\n  * 1972\n  * apr1\n  * apr2\n  * apr3\n  * blur\n  * gblur\n  * lensblur\n  * motionblur\n  * smartblur\n  * pixelize\n  * brl1\n  * brnz1\n  * brnz2\n  * brnz3\n  * brnz4\n  * cyber1\n  * cyber2\n  * dodger\n  * food1\n  * food2\n  * icy1\n  * icy2\n  * icy3\n  * mnch1\n  * mnch2\n  * mnch3\n  * nature1\n  * nature2\n  * noise\n  * ntrl1\n  * ntrl2\n  * popart\n  * saturation\n  * sft1\n  * sft2\n  * sft3\n  * sft4\n  * shadow1\n  * shadow2\n  * sketch1\n  * sketch2\n  * sketch3\n  * sketcher1\n  * sketcher2\n  * spc1\n  * tl1\n  * tl2\n  * urban1\n  * urban2\n  * water1\n  * water2\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the output image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageApplyLaserEngravingEffect: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly engrave_color: {
                readonly type: "string";
                readonly description: "Can be a hexcolor code (e.g., #82d5fa, #fff) or a color name (e.g., blue). For semi-transparency, 4-/8-digit hexcodes are also supported (e.g., #18d4ff87). (If this parameter is present, the other bg_ parameters must be empty).\n";
                readonly default: "black";
            };
            readonly background_color: {
                readonly type: "string";
                readonly description: "Can be a hexcolor code (e.g., #82d5fa, #fff) or a color name (e.g., blue). For semi-transparency, 4-/8-digit hexcodes are also supported (e.g., #18d4ff87). (If this parameter is present, the other bg_ parameters must be empty).\n";
                readonly default: "white";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP", "SVG"];
                readonly description: "Optionally select one of the output image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n  * SVG\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageApplyMask: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["mask"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "PNG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats. Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly blend: {
                readonly type: "string";
                readonly enum: readonly ["normal", "screen", "overlay", "multiply", "darken", "lighten", "add"];
                readonly default: "screen";
                readonly description: "Select one of the appearance types from the list (_screen_ is chosen if left blank). The options are as follows:\n  * normal\n  * screen\n  * overlay\n  * multiply\n  * darken\n  * lighten\n  * add\n";
            };
            readonly mask: {
                readonly type: "string";
                readonly enum: readonly ["lace1", "lace2", "lace3", "lace4", "shdw2", "shdw17", "rpl3", "rpl5", "prsm3", "prsm9", "prsm10"];
                readonly description: "Select one of the mask types from the list. The options are as follows:\n  * lace1\n  * lace2\n  * lace3\n  * lace4\n  * shdw2\n  * shdw17\n  * rpl3\n  * rpl5\n  * prsm3\n  * prsm9\n  * prsm10\n";
            };
            readonly opacity: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly default: 100;
                readonly description: "Enter an integer value from 0 to +100. The larger the number, the greater the opacity. Default is 100.";
            };
            readonly hue: {
                readonly type: "integer";
                readonly minimum: -180;
                readonly maximum: 180;
                readonly default: 0;
                readonly description: "Enter an integer value from -180 to +180. Default is 0.";
            };
            readonly mask_flip: {
                readonly type: "string";
                readonly enum: readonly ["left", "right", "mirror horizontal", "mirror vertical", "turnaround"];
                readonly description: "Choose a mask flip option. The choices are as follows.\n  * left\n  * right\n  * mirror horizontal\n  * mirror vertical\n  * turnaround\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageBlend: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly overlay_image: {
                readonly description: "Overlay image file (binary). (If this parameter is present, the other image source parameters must be empty.) This only has an effect when output=cutout.";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly overlay_image_url: {
                readonly type: "string";
                readonly description: "Overlay image URL. (If this parameter is present, the other image source parameters must be empty.) If this has a value, the output value is dismissed.";
            };
            readonly overlay_image_id: {
                readonly type: "string";
                readonly description: "Overlay image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.) See /upload method. If this has a value, the output value is dismissed.";
            };
            readonly opacity: {
                readonly type: "integer";
                readonly default: 100;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Define the opacity of the overlay added to the main image.\n  Takes values from 0 to 100. Default is 100 (opaque). Set to 0 to make it transparent.\n";
            };
            readonly blend_mode: {
                readonly type: "string";
                readonly enum: readonly ["normal", "darken", "multiply", "lighten", "screen", "color_dodge", "overlay", "soft_light", "hard_light", "hue", "saturation", "color", "luminosity"];
                readonly default: "normal";
                readonly description: "The blend mode. Choose one of normal, darken, multiply, lighten, screen, color_dodge, overlay, soft_light, hard_light, hue, saturation, color, luminosity.  Defaults to normal.\n";
            };
            readonly format: {
                readonly type: "string";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly default: "PNG";
                readonly description: "Optionally select one of the image formats (PNG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageCarsClassifier: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly class: {
                            readonly type: "string";
                            readonly enum: readonly ["exterior", "interior", "engine", "undercarriage", "other"];
                            readonly description: "`exterior` `interior` `engine` `undercarriage` `other`";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageCreateEffectPreviews: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["effect_names"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly effect_names: {
                readonly description: "Select up to 10 effects. The list of effects are as follows:\n  * 1972\n  * apr1\n  * apr2\n  * apr3\n  * blur\n  * gblur\n  * lensblur\n  * motionblur\n  * smartblur\n  * pixelize\n  * brl1\n  * brnz1\n  * brnz2\n  * brnz3\n  * brnz4\n  * cyber1\n  * cyber2\n  * dodger\n  * food1\n  * food2\n  * icy1\n  * icy2\n  * icy3\n  * mnch1\n  * mnch2\n  * mnch3\n  * nature1\n  * nature2\n  * noise\n  * ntrl1\n  * ntrl2\n  * popart\n  * saturation\n  * sft1\n  * sft2\n  * sft3\n  * sft4\n  * shadow1\n  * shadow2\n  * sketch1\n  * sketch2\n  * sketch3\n  * sketcher1\n  * sketcher2\n  * spc1\n  * tl1\n  * tl2\n  * urban1\n  * urban2\n  * water1\n  * water2\nYou can provide the values as a list, but also as a comma separated string, e.g. \"apr1, apr2\".\n";
                readonly type: "array";
                readonly minItems: 1;
                readonly uniqueItems: true;
                readonly items: {
                    readonly type: "string";
                    readonly enum: readonly [1972, "apr1", "apr2", "apr3", "blur", "gblur", "lensblur", "motionblur", "smartblur", "pixelize", "brl1", "brnz1", "brnz2", "brnz3", "brnz4", "cyber1", "cyber2", "dodger", "food1", "food2", "icy1", "icy2", "icy3", "mnch1", "mnch2", "mnch3", "nature1", "nature2", "noise", "ntrl1", "ntrl2", "popart", "saturation", "sft1", "sft2", "sft3", "sft4", "shadow1", "shadow2", "sketch1", "sketch2", "sketch3", "sketcher1", "sketcher2", "spc1", "tl1", "tl2", "urban1", "urban2", "water1", "water2"];
                };
            };
            readonly preview_size: {
                readonly type: "integer";
                readonly description: "Enter the width of the preview image. The max value is 240px. The default is 120px.";
                readonly default: 120;
                readonly maximum: 240;
                readonly minimum: 50;
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats. Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                            };
                            readonly url: {
                                readonly type: "string";
                            };
                            readonly effect_name: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageCreateMaskPreviews: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["mask"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "PNG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly blend: {
                readonly type: "string";
                readonly enum: readonly ["normal", "screen", "overlay", "multiply", "darken", "lighten", "add"];
                readonly default: "screen";
                readonly description: "Select one of the appearance types from the list (it will be _screen_ if left blank). The options are as follows.\n  * normal\n  * screen\n  * overlay\n  * multiply\n  * darken\n  * lighten\n  * add\n";
            };
            readonly mask: {
                readonly type: "array";
                readonly minItems: 1;
                readonly description: "Select up to 10 mask types from the list. The options are as follows\n  * lace1\n  * lace2\n  * lace3\n  * lace4\n  * shdw2\n  * shdw17\n  * rpl3\n  * rpl5\n  * prsm3\n  * prsm9\n  * prsm10\n";
                readonly items: {
                    readonly type: "string";
                    readonly enum: readonly ["lace1", "lace2", "lace3", "lace4", "shdw2", "shdw17", "rpl3", "rpl5", "prsm3", "prsm9", "prsm10"];
                };
            };
            readonly opacity: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly default: 100;
                readonly description: "Enter an integer value from 0 to +100. The larger the number, the greater the opacity.";
            };
            readonly hue: {
                readonly type: "integer";
                readonly minimum: -180;
                readonly maximum: 180;
                readonly default: 0;
                readonly description: "Enter an integer value from -180 to +180.";
            };
            readonly mask_flip: {
                readonly type: "string";
                readonly enum: readonly ["left", "right", "mirror horizontal", "mirror vertical", "turnaround"];
                readonly description: "Choose a mask flip option. The choices are as follows.\n  * left\n  * right\n  * mirror horizontal\n  * mirror vertical\n  * turnaround\n";
            };
            readonly preview_size: {
                readonly type: "integer";
                readonly default: 120;
                readonly description: "Enter the max size for the width or height of the preview image. The max value is 240px. If left blank it's 120px.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                            };
                            readonly url: {
                                readonly type: "string";
                            };
                            readonly mask_name: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageCreditsBalance: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly credits: {
                    readonly type: "integer";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageDescriber: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly description: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageDesignImport: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly file: {
                readonly description: "Source file (binary). (If this parameter is present, the other source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly file_url: {
                readonly type: "string";
                readonly description: "Source file URL. (If this parameter is present, the other source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "202": {
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageDesignImportGetresult: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                    readonly examples: readonly ["1116b57cb-1999-4bfd-8c42-c739a006a111"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The ID returned from the POST method.";
                };
            };
            readonly required: readonly ["transaction_id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "202": {
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageEdit: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly mode: {
                readonly type: "string";
                readonly enum: readonly ["resize", "crop"];
                readonly description: "For *crop* mode, the outcome image will be center-cropped with the given size (width, height). For the *resize* mode, the smallest size will be fitted to preserve the original proportion of the image. When the outcome size is not provided with width and height, no cropping or resizing will be applied (see alternative options such as rotate, flip and perspective).";
            };
            readonly size: {
                readonly type: "integer";
                readonly description: "When defined, this parameter overrides and applies the value for both width and height.";
            };
            readonly width: {
                readonly type: "integer";
                readonly description: "Width of outcome image. If the provided width is larger than the original width of the file, the original size of the image will be selected. When crop size is defined, but the x,y starting position is not provided, the crop will be a center-crop (i.e., equally cutting from each side).";
            };
            readonly height: {
                readonly type: "integer";
                readonly description: "Height of outcome image. If the provided height is larger than the original width of the file, the original size of the image will be selected. When crop size is defined, but the x,y starting position is not provided, the crop will be a center-crop (i.e, equally cutting from each side).";
            };
            readonly flip: {
                readonly type: "string";
                readonly enum: readonly ["horizontal", "vertical"];
                readonly description: "Choose a way to flip the image.";
            };
            readonly rotate: {
                readonly type: "number";
                readonly format: "float";
                readonly default: 0;
                readonly minimum: -180;
                readonly maximum: 180;
                readonly description: "Enter a float value to rotate the image from -180 to +180. Default is 0.";
            };
            readonly perspective_horizontal: {
                readonly type: "integer";
                readonly default: 0;
                readonly minimum: -45;
                readonly maximum: 45;
                readonly description: "The horizontal perspective after edits.";
            };
            readonly perspective_vertical: {
                readonly type: "integer";
                readonly default: 0;
                readonly minimum: -45;
                readonly maximum: 45;
                readonly description: "The vertical perspective after edits.";
            };
            readonly quality: {
                readonly type: "integer";
                readonly default: 90;
                readonly minimum: 10;
                readonly maximum: 100;
                readonly description: "This refers to the level of accuracy of the image processing. The greater the quality (i.e., the larger the number), the larger the image file size. The default value is 90, which is a good compromise between quality and file size.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageFaceEnhance: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is the default). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageGeneratePattern: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly width: {
                readonly type: "integer";
                readonly description: "Specify the width of the output image in pixels. The default is 1024 and the maximum acceptable value is 8000.";
                readonly default: 1024;
                readonly maximum: 8000;
            };
            readonly height: {
                readonly type: "integer";
                readonly description: "Specify the width of the output image in pixels. The default is 1024 and the maximum acceptable value is 8000.";
                readonly default: 1024;
                readonly maximum: 8000;
            };
            readonly offset_x: {
                readonly type: "integer";
                readonly description: "Specify the pattern location, with x(width). Calculation starts from the center of the image. Default is 0.";
                readonly default: 0;
            };
            readonly offset_y: {
                readonly type: "integer";
                readonly description: "Specify the pattern location  with y(height). Calculation starts from the center of the image. Default is 0.";
                readonly default: 0;
            };
            readonly pattern: {
                readonly type: "string";
                readonly enum: readonly ["hex", "mirror", "diamond", "hex2", "tile"];
                readonly default: "hex";
                readonly description: "Choose a pattern for the background texture. Default is hex.";
            };
            readonly rotate: {
                readonly type: "integer";
                readonly minimum: -180;
                readonly maximum: 180;
                readonly default: 0;
                readonly description: "Enter an integer value to rotate the texture pattern from -180 to +180. Default is 0.";
            };
            readonly scale: {
                readonly type: "number";
                readonly format: "float";
                readonly minimum: 0.5;
                readonly maximum: 10;
                readonly default: 1;
                readonly description: "Enter a floating point number between 0.5 - 10.0 to scale the background texture. Default is 1.0.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageGenerateTexture: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly width: {
                readonly type: "integer";
                readonly description: "Specify the width of the output image in pixels. The default is 1024 and the maximum acceptable value is 8000.";
                readonly default: 1024;
                readonly maximum: 8000;
            };
            readonly height: {
                readonly type: "integer";
                readonly description: "Specify the width of the output image in pixels. The default is 1024 and the maximum acceptable value is 8000.";
                readonly default: 1024;
                readonly maximum: 8000;
            };
            readonly offset_x: {
                readonly type: "integer";
                readonly description: "Specify the pattern location, with x(width). Calculation starts from the center of the image. Default is 0.";
                readonly default: 0;
            };
            readonly offset_y: {
                readonly type: "integer";
                readonly description: "Specify the pattern location  with y(height). Calculation starts from the center of the image. Default is 0.";
                readonly default: 0;
            };
            readonly pattern: {
                readonly type: "string";
                readonly enum: readonly ["hex", "mirror", "diamond", "hex2", "tile"];
                readonly default: "hex";
                readonly description: "Choose a pattern for the background texture. Default is hex.";
            };
            readonly rotate: {
                readonly type: "integer";
                readonly minimum: -180;
                readonly maximum: 180;
                readonly default: 0;
                readonly description: "Enter an integer value to rotate the texture pattern from -180 to +180. Default is 0.";
            };
            readonly scale: {
                readonly type: "number";
                readonly format: "float";
                readonly minimum: 0.5;
                readonly maximum: 10;
                readonly default: 1;
                readonly description: "Enter a floating point number between 0.5 - 10.0 to scale the background texture. Default is 1.0.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageListAiEffectNames: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageListEffectNames: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageRemoveBackground: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly output_type: {
                readonly type: "string";
                readonly default: "cutout";
                readonly enum: readonly ["mask", "cutout"];
                readonly description: "Select one of the two output options. If you submit a photo of a person, **cutout** returns the person as a sticker while **mask** returns a mask photo of the person.\n";
            };
            readonly bg_image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.) This only has an effect when output=cutout.";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly bg_image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.) If this has a value, the output value is dismissed.";
            };
            readonly bg_image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.) See /upload method. If this has a value, the output value is dismissed.";
            };
            readonly bg_color: {
                readonly type: "string";
                readonly description: "Can be a hexcolor code (e.g., #82d5fa, #fff) or a color name (e.g., blue). For semi-transparency, 4-/8-digit hexcodes are also supported (e.g., #18d4ff87). (If this parameter is present, the other bg_ parameters must be empty).\n";
            };
            readonly bg_blur: {
                readonly type: "integer";
                readonly default: 0;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Enter an integer value from 0 to +100.";
            };
            readonly bg_width: {
                readonly type: "integer";
                readonly description: "Size, in pixels, for the width. If left blank, the background is left at its original width.\n";
            };
            readonly bg_height: {
                readonly type: "integer";
                readonly description: "Size, in pixels, for the height. If left blank, the background is left at its original height.\n";
            };
            readonly scale: {
                readonly type: "string";
                readonly enum: readonly ["fit", "fill"];
                readonly default: "fit";
                readonly description: "Fit is where the longer side (width/height) fits the background. Fill is where the shorter side fits the background. Fit is the default.\n";
            };
            readonly auto_center: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Automatically center the object. Works only, when output_type=cutout.\n  We don't recommend using this flag when the object is visible only partially (e.g. half-cup or half-shoe is in the image).\n";
            };
            readonly stroke_size: {
                readonly type: "integer";
                readonly default: 0;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Add a solid stroke (border) around the cutout result. Works when output_type=cutout. Set 0 to remove. Takes values from 0 to 100.\n";
            };
            readonly stroke_color: {
                readonly type: "string";
                readonly default: "FFFFFF";
                readonly description: "Define the color of the stroke. \n  Can be a hexcolor code (e.g., #82d5fa, #fff; with or without #) or a color name (e.g., blue; in English).\n  For semi-transparency, 4-/8-digit hexcodes are also supported (e.g., #18d4ff87).\n  Gets applied if the stroke_size is 1 and above.\n";
            };
            readonly stroke_opacity: {
                readonly type: "integer";
                readonly default: 100;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Define the opacity of the stroke added to the cutout result. Works when output_type=cutout and stroke_size is 1 and above.\n  Takes values from 0 to 100. Default is 100 (opaque). Set to 0 to make it transparent.\n";
            };
            readonly shadow: {
                readonly type: "string";
                readonly enum: readonly ["disabled", "custom", "bottom-right", "bottom", "bottom-left", "left", "right", "top-left", "top", "top-right"];
                readonly default: "disabled";
                readonly description: "A universal parameter to configure the shadow. The default value is \"disabled\" and it will make sure that the shadow is not rendered. The \"custom\" value allows to define custom position for the shadow, when this value is chosen, the shadow_offset_x and the shadow_offset_y will get applied. Other values are shadow directions with preset shadow setup (10px).\n";
            };
            readonly shadow_opacity: {
                readonly type: "integer";
                readonly default: 20;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Shadow Opacity. Works when shadow is enabled (a non-disabled value).";
            };
            readonly shadow_blur: {
                readonly type: "integer";
                readonly default: 50;
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Shadow Blur. Works when shadow is enabled.";
            };
            readonly shadow_offset_x: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Shadow Offset X. This is mandatory to specify when shadow=custom.";
            };
            readonly shadow_offset_y: {
                readonly type: "integer";
                readonly minimum: -100;
                readonly maximum: 100;
                readonly description: "Shadow Offset Y. This is mandatory to specify when shadow=custom.";
            };
            readonly format: {
                readonly type: "string";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly default: "PNG";
                readonly description: "Optionally select one of the image formats (PNG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageSurfacemap: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly mask: {
                readonly description: "Source mask file (binary). (If this parameter is present, the other mask source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly mask_url: {
                readonly type: "string";
                readonly description: "Source mask URL. (If this parameter is present, the other mask source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly mask_id: {
                readonly type: "string";
                readonly description: "Source mask ID of an mask previously uploaded to Picsart or result mask ID from a different API. (If this parameter is present, the other mask source parameters must be empty.)";
            };
            readonly sticker: {
                readonly description: "Source sticker file (binary). (If this parameter is present, the other sticker source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly sticker_url: {
                readonly type: "string";
                readonly description: "Source sticker URL. (If this parameter is present, the other sticker source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly sticker_id: {
                readonly type: "string";
                readonly description: "Source sticker ID of an sticker previously uploaded to Picsart or result sticker ID from a different API. (If this parameter is present, the other sticker source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageTagging: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageTransferColor: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly reference_image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly reference_image_id: {
                readonly type: "string";
                readonly description: "Enter the Picsart image ID if you previously uploaded the image.";
            };
            readonly reference_image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageTransferStyle: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly level: {
                readonly type: "string";
                readonly default: "l1";
                readonly enum: readonly ["l1", "l2", "l3", "l4", "l5"];
                readonly description: "Select a level from the dropdown menu. Smaller numbers preserve more from the original image, bigger numbers make the original image look closer to the reference image. The level options are as follows.\n  * l1\n  * l2\n  * l3\n  * l4\n  * l5\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly reference_image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly reference_image_id: {
                readonly type: "string";
                readonly description: "Enter the Picsart image ID if you previously uploaded the image.";
            };
            readonly reference_image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageUltraEnhance: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly upscale_factor: {
                readonly type: "integer";
                readonly default: 2;
                readonly enum: readonly [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
                readonly description: "Upscale an image with a given upscale factor. The upscale factor increases the image’s resolution without increasing its size. Upscale factor can be between 2 - 16 (default is 2).\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageUltraUpscale: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly upscale_factor: {
                readonly type: "integer";
                readonly default: 2;
                readonly enum: readonly [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
                readonly description: "Upscale an image with a given upscale factor. The upscale factor increases the image’s resolution without increasing its size. Upscale factor can be between 2 - 16 (default is 2).\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the image formats. Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
            readonly mode: {
                readonly type: "string";
                readonly default: "sync";
                readonly enum: readonly ["sync", "async", "auto"];
                readonly description: "Use this query parameter to establish the processing mode. Acceptable values are sync, async and auto:\n  * sync: issues a synchronous request, response is given when the result is ready.\n  * async: forces an asynchronous request, the response, which is instantaneous, contains a \"transaction_id\" which is used to poll for the result.\n  * auto: the processing mode decision is made by the service, which depends upon the expected processing time.\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "202": {
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageUltraUpscaleGetresult: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The ID returned from the POST method when it's done asynchronously.";
                };
            };
            readonly required: readonly ["transaction_id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "202": {
            readonly type: "object";
            readonly properties: {
                readonly transaction_id: {
                    readonly type: "string";
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageUpload: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageUpscale: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["upscale_factor"];
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly upscale_factor: {
                readonly type: "integer";
                readonly default: 2;
                readonly enum: readonly [2, 4, 6, 8];
                readonly description: "Choose one of the upscale factors. The options are as follows\n  * 2\n  * 4\n  * 6\n  * 8\n";
            };
            readonly format: {
                readonly type: "string";
                readonly default: "JPG";
                readonly enum: readonly ["JPG", "PNG", "WEBP"];
                readonly description: "Optionally select one of the output image formats (JPG is chosen if left blank). Options are as follows:\n  * JPG\n  * PNG\n  * WEBP\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ImageVectorizeRasterToSvg: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly image: {
                readonly description: "Source image file (binary). (If this parameter is present, the other image source parameters must be empty.)";
                readonly type: "string";
                readonly format: "binary";
            };
            readonly image_url: {
                readonly type: "string";
                readonly description: "Source image URL. (If this parameter is present, the other image source parameters must be empty.)";
                readonly maxLength: 2083;
                readonly minLength: 1;
                readonly format: "uri";
            };
            readonly image_id: {
                readonly type: "string";
                readonly description: "Source image ID of an image previously uploaded to Picsart or result image ID from a different API. (If this parameter is present, the other image source parameters must be empty.)";
            };
            readonly downscale_to: {
                readonly type: "integer";
                readonly default: 2048;
                readonly description: "Large images can be downscaled. Use -1 to turn off downscaling. Otherwise the image is downscaled by 0.5 until max(width, height) < downscale_to. When downscale_to is disabled with -1, the image width and height should be less than 4000px.\n";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly url: {
                            readonly type: "string";
                        };
                    };
                };
                readonly status: {
                    readonly type: "string";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Unauthorized"];
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "402": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "405": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "413": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "415": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "429": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "431": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                };
                readonly detail: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["detail"];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { ImageAdjust, ImageApplyAiEffect, ImageApplyEffect, ImageApplyLaserEngravingEffect, ImageApplyMask, ImageBlend, ImageCarsClassifier, ImageCreateEffectPreviews, ImageCreateMaskPreviews, ImageCreditsBalance, ImageDescriber, ImageDesignImport, ImageDesignImportGetresult, ImageEdit, ImageFaceEnhance, ImageGeneratePattern, ImageGenerateTexture, ImageListAiEffectNames, ImageListEffectNames, ImageRemoveBackground, ImageSurfacemap, ImageTagging, ImageTransferColor, ImageTransferStyle, ImageUltraEnhance, ImageUltraUpscale, ImageUltraUpscaleGetresult, ImageUpload, ImageUpscale, ImageVectorizeRasterToSvg };
