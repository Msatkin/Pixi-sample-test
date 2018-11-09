export const fireShader: string = `
    varying vec2 vTextureCoord;

    uniform vec4 filterArea;
    uniform vec4 filterClamp;
    uniform sampler2D image;
    uniform float time;

    /**
     * Normalizes the position so it doesn't go off the texture
     */
    vec2 normalizePosition(vec2 coord) {
        float reps = floor(coord.y / filterClamp.w);
        coord.y = (coord.y / filterClamp.w) - reps;
        return coord;
    }

    void main()
    {
        // Clamps position within bounds
        vec2 pixelCoord = clamp(vTextureCoord, filterClamp.xy, filterClamp.zw);

        // Chooses 3 X positions
        vec2 normalPositionX0 = normalizePosition(vec2(pixelCoord.x * 1.4 + 0.01, pixelCoord.y + time * 0.69));
        vec2 normalPositionX1 = normalizePosition(vec2(pixelCoord.x * 0.5 - 0.033, pixelCoord.y * 2.0 + time * 0.12));
        vec2 normalPositionX2 = normalizePosition(vec2(pixelCoord.x * 0.94 + 0.02, pixelCoord.y * 3.0 + time * 0.61));

        // Gets alphas from X positions
        float alphaX0 = (texture2D(image, normalPositionX0).w - 0.5) * 2.0;
        float alphaX1 = (texture2D(image, normalPositionX1).w - 0.5) * 2.0;
        float alphaX2 = (texture2D(image, normalPositionX2).w - 0.5) * 2.0;

        // Clamps a final X noise value
        float noiseX = clamp(alphaX0 + alphaX1 + alphaX2, -1.0, 1.0);

        // Chooses 3 Y positions
        vec2 normalPositionY0 = normalizePosition(vec2(pixelCoord.x * 0.7 - 0.01, pixelCoord.y + time * 0.27));
        vec2 normalPositionY1 = normalizePosition(vec2(pixelCoord.x * 0.45 + 0.033, pixelCoord.y * 1.9 + time * 0.61));
        vec2 normalPositionY2 = normalizePosition(vec2(pixelCoord.x * 0.8 - 0.02, pixelCoord.y * 2.5 + time * 0.51));

        // Gets alphas from Y positions
        float alphaY0 = (texture2D(image, normalPositionY0).w - 0.5) * 2.0;
        float alphaY1 = (texture2D(image, normalPositionY1).w - 0.5) * 2.0;
        float alphaY2 = (texture2D(image, normalPositionY2).w - 0.5) * 2.0;

        // Clamps a final X noise value
        float noiseY = clamp(alphaY0 + alphaY1 + alphaY2, -1.0, 1.0);

        // Distorts the flame more at higher y values
        float perturb = (1.0 - pixelCoord.y) * 0.45 + 0.02;

        // Gets final coord
        vec2 finalNoise = vec2(noiseX, noiseY);
        finalNoise = (finalNoise * perturb) + pixelCoord - 0.02;

        // Correct color levels
        vec4 color = texture2D(image, finalNoise);
        color = vec4(color.x*2.3, color.y*0.92, (color.y/color.x)*0.1, 1.0);

        finalNoise = clamp(finalNoise, 0.05, 1.0);

        // Set color alpha
        color.w = texture2D(image, finalNoise).z * 3.5;
        color.w = color.w*texture2D(image, pixelCoord).z;

        gl_FragColor = color;
    }
`;
