import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Discover the magic of seamless background removal with our removebg service, powered by
     * cutting-edge AI technology. Our sophisticated algorithm effortlessly identifies and
     * isolates the foreground,  ensuring every detail from the delicate intricacies of jewelry
     * to the finest strands of hair is captured with unparalleled precision.  Designed to
     * excel across a vast array of use cases, our service guarantees immaculate cutouts,
     * whether for professional product photos, dynamic campaign graphics, or personal images
     * meant for creative exploration.  Experience flawless edges and exceptional detail
     * preservation every time, elevating your images beyond the ordinary.
     *
     * **Limitations:**
     *
     *   The recommended composition of an Image, in order to be optimally processed using the
     * "removebg" service, is:
     *   * less busy background
     *   * high contrast (background/foreground)
     *   * background/foreground is distinguishable by naked eye
     *
     *
     *   The foreground should be visually clear, high contrast with relatively sharp edges.
     * The foreground should also be comparably big in the photo. Supported source image
     * formats are JPG, PNG, TIFF, WEBP, and MPO.
     *
     * **Examples:**
     *
     *   Examples of where the remove background service can be utilized include the following:
     *   * Animals
     *   * Products
     *   * Apparel
     *   * Person
     *   * Cars
     *   * Furniture
     *
     * **Options:**
     *   * You have two options for removing the background, either "cutout" or "mask"
     *   * You can control background color
     *   * You can control background blur
     *   * You can control background height and width
     *   * You have two scaling options, either "fit" or "fill"
     *
     * **Source Image:**
     *
     *    If you plan to remove the background several times using different parameters from
     * the list below, we recommend you first upload the source image using the *Upload* method
     * and then use the reference image ID. Otherwise, you can source the image by providing a
     * file or a URL to an online image.
     *
     *    For more details on supported image types for the Remove Background API, visit our
     * [Supported Image Types
     * Documentation](https://docs.picsart.io/reference/supported-image-types-for-remove-background)
     *
     * **Authorization:**
     *
     *    Start transforming your images today! Just remember, accessing our powerful API
     * requires an API key.
     *    Make sure it's included in your request header **X-Picsart-API-Key** for smooth
     * authorization.
     *    This key unlocks the full potential of our remove background service,
     *    ensuring you can seamlessly integrate these capabilities into your own platform.
     *
     * Discover the possibilities with Picsart and transform the way you work with images.
     * Whether it's for a product for sale, graphical materials for your best campaign, or just
     * personal images for fun editing, you'll get clear edges with awesome detail preservation
     * with our remove background service.
     *
     * @summary Remove & Change Background
     * @throws FetchError<400, types.ImageRemoveBackgroundResponse400> Bad Request
     * @throws FetchError<401, types.ImageRemoveBackgroundResponse401> Unauthorized
     * @throws FetchError<402, types.ImageRemoveBackgroundResponse402> Payment Required
     * @throws FetchError<403, types.ImageRemoveBackgroundResponse403> Forbidden
     * @throws FetchError<404, types.ImageRemoveBackgroundResponse404> Not Found
     * @throws FetchError<405, types.ImageRemoveBackgroundResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageRemoveBackgroundResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageRemoveBackgroundResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageRemoveBackgroundResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageRemoveBackgroundResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageRemoveBackgroundResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageRemoveBackgroundResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageRemoveBackgroundResponse503> Service Unavailable
     */
    imageRemoveBackground(body?: types.ImageRemoveBackgroundBodyParam): Promise<FetchResponse<200, types.ImageRemoveBackgroundResponse200>>;
    /**
     * **Service Description:**
     *
     *   The *upscale* service increases the resolutions of an image by a given upscale factor,
     * without increasing its file size. Upscale increases the quality and resolution of your
     * photos by leveraging predictive and generative AI to add pixels to your image. It works
     * especially well on images without noise.
     *
     * **Limitations:**
     *
     *   Images can be upscaled up to 8 times. Images can be upscaled with outputs up to
     * 4800x4800 (16 Mpx). Supported source image formats are JPG, PNG, TIFF and WEBP.
     *
     * **Minimums/Maximums:**
     *    Upscale Factor    | Input Image Maximum Recommended Resolution (width x height)
     *    ------------------| ----------------------------------------
     *    2                 | 2000x2000
     *    4                 | 1024x1024
     *    6                 | 800x800
     *    8                 | 600x600
     *
     * **Examples:**
     *
     *   Examples of where the upscale service can be utilized include the following:
     *   * High resolution images
     *
     *
     * **Rules:**
     *
     *   The image should have sharp details.
     *
     * **Source Image:**
     *
     *   If you plan to upscale an image several times, we recommend you first upload the
     * source image using the *Upload* method and then use the reference image ID. Otherwise,
     * you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *
     *   Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Upscale
     * @throws FetchError<400, types.ImageUpscaleResponse400> Bad Request
     * @throws FetchError<401, types.ImageUpscaleResponse401> Unauthorized
     * @throws FetchError<402, types.ImageUpscaleResponse402> Payment Required
     * @throws FetchError<403, types.ImageUpscaleResponse403> Forbidden
     * @throws FetchError<404, types.ImageUpscaleResponse404> Not Found
     * @throws FetchError<405, types.ImageUpscaleResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageUpscaleResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageUpscaleResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageUpscaleResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageUpscaleResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageUpscaleResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageUpscaleResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageUpscaleResponse503> Service Unavailable
     */
    imageUpscale(body: types.ImageUpscaleBodyParam): Promise<FetchResponse<200, types.ImageUpscaleResponse200>>;
    /**
     * **Service Description:** *Upscale Ultra* is a new upscaling technique which does
     * upscaling with noise suppression. It works well on images with faces, small resolution
     * images, stickers and objects with geometric shapes and clear edges. Upscale ultra
     * increases the quality and resolution of low quality photos by leveraging predictive and
     * generative AI technology in order to "complete" missing pixels for a best in class
     * smoothing and enhancement effect. It works especially good on small resolution images
     * with faces.
     *
     * **Limitations:**
     *   Images can be upscaled up to 16 times. Supported source image formats are JPG, PNG,
     * TIFF and WEBP.
     *
     * **Minimums/Maximums:**
     *   * Up to 4Mpx (2048x2048) input images
     *   * Up to 64Mpx output images
     *
     * **Examples:**
     *   Examples of where the upscale ultra service can be utilized include the following:
     *    * Low resolution images
     *    * Images that need smoothing
     *
     * **Options:**
     *   This service allows users to choose from *synchronous*, *asynchronous* and *auto-mode*
     * type of processing. The asynchronous service is preferred when processing large final
     * size image files or when using high upscaling factors. When done asynchronously, rather
     * than receiving a URL to the finished image, you will receive a transaction_id to use
     * with the GET method to retrieve the transformed image. Options are detailed below:
     *   * **Sync**: issues a synchronous request, response is given when the result is ready.
     * In case of processes which take too long (>55 seconds), the request returns an error
     * after timeout. Based on the estimated (calculated by the algorithm) final size of an
     * image, there is also an auto-switching mechanism which automatically switches the
     * processing mode to the async mode, if the estimated final size of the respective image
     * is larger than 4Mpx.
     *   * **Async**: forces an asynchronous request, and the response, which is instantaneous,
     * contains a "transaction_id" which is used to poll for the result. For async processing,
     * the request runs in async mode either until it returns a result or stops after 24 hours.
     *   * **Auto**: the processing mode decision is made automatically by the service,
     * depending upon image size (estimated final size of an image should exceed 4Mpx to choose
     * async automatically).
     *
     *   **Source Image:**
     *     If you plan to upscale ultra an image several times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     *   **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Ultra Upscale
     * @throws FetchError<400, types.ImageUltraUpscaleResponse400> Bad Request
     * @throws FetchError<401, types.ImageUltraUpscaleResponse401> Unauthorized
     * @throws FetchError<402, types.ImageUltraUpscaleResponse402> Payment Required
     * @throws FetchError<403, types.ImageUltraUpscaleResponse403> Forbidden
     * @throws FetchError<404, types.ImageUltraUpscaleResponse404> Not Found
     * @throws FetchError<405, types.ImageUltraUpscaleResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageUltraUpscaleResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageUltraUpscaleResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageUltraUpscaleResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageUltraUpscaleResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageUltraUpscaleResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageUltraUpscaleResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageUltraUpscaleResponse503> Service Unavailable
     */
    imageUltraUpscale(body?: types.ImageUltraUpscaleBodyParam): Promise<FetchResponse<200, types.ImageUltraUpscaleResponse200> | FetchResponse<202, types.ImageUltraUpscaleResponse202>>;
    /**
     * **Service Description:** Use this method, along with transaction_id, to retrieve the
     * upscale ultra finished image if the transformation was done asynchronously.
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Get the Ultra Upscale result
     * @throws FetchError<400, types.ImageUltraUpscaleGetresultResponse400> Bad Request
     * @throws FetchError<401, types.ImageUltraUpscaleGetresultResponse401> Unauthorized
     * @throws FetchError<402, types.ImageUltraUpscaleGetresultResponse402> Payment Required
     * @throws FetchError<403, types.ImageUltraUpscaleGetresultResponse403> Forbidden
     * @throws FetchError<404, types.ImageUltraUpscaleGetresultResponse404> Not Found
     * @throws FetchError<405, types.ImageUltraUpscaleGetresultResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageUltraUpscaleGetresultResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageUltraUpscaleGetresultResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageUltraUpscaleGetresultResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageUltraUpscaleGetresultResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageUltraUpscaleGetresultResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageUltraUpscaleGetresultResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageUltraUpscaleGetresultResponse503> Service Unavailable
     */
    imageUltraUpscaleGetresult(metadata: types.ImageUltraUpscaleGetresultMetadataParam): Promise<FetchResponse<200, types.ImageUltraUpscaleGetresultResponse200> | FetchResponse<202, types.ImageUltraUpscaleGetresultResponse202>>;
    /**
     * **Service Description:**
     *   *Ultra enhance* is a new upscaling technique with a generative model which provides
     * high frequency detail. It works well on images without noise and preserves details in a
     * superior way.
     *
     *  **Limitations:** Up to 16 times upscaling on input images. Supported source image
     * formats are JPG, PNG, TIFF and WEBP.
     *
     *  **Minimums/Maximums:**
     *    * Up to 64Mpx output images
     *
     *  **Examples:**
     *    Examples of where ultra enhance can be utilized include the following:
     *    * Low resolution images
     *    * Images that need smoothing and realistic details
     *    * To de-noise an image
     *    * Works best with the Face Enhance service
     *
     *  **Source Image:**
     *    If you plan to upscale enhance an image several times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     *  **Authorization:**
     *      Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Ultra Enhance
     * @throws FetchError<400, types.ImageUltraEnhanceResponse400> Bad Request
     * @throws FetchError<401, types.ImageUltraEnhanceResponse401> Unauthorized
     * @throws FetchError<402, types.ImageUltraEnhanceResponse402> Payment Required
     * @throws FetchError<403, types.ImageUltraEnhanceResponse403> Forbidden
     * @throws FetchError<404, types.ImageUltraEnhanceResponse404> Not Found
     * @throws FetchError<405, types.ImageUltraEnhanceResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageUltraEnhanceResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageUltraEnhanceResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageUltraEnhanceResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageUltraEnhanceResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageUltraEnhanceResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageUltraEnhanceResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageUltraEnhanceResponse503> Service Unavailable
     */
    imageUltraEnhance(body?: types.ImageUltraEnhanceBodyParam): Promise<FetchResponse<200, types.ImageUltraEnhanceResponse200>>;
    /**
     * **Service Description:**
     *   With our *enhance face* tool, you can turn your old, blurry photos into clear
     * portraits and selfies.
     *   Our AI technology will find faces, perform restoration and do color enhancement
     * simultaneously.
     *   It will improve the skin texture and sharpen details while keeping a good balance of
     * realness and fidelity with much less artifacts.
     *
     *  **Limitations:** Supported image formats are JPG, PNG, TIFF and WEBP.
     *
     *  **Examples:**
     *    Examples of where the face enhancement tool can be utilized include the following:
     *    * Selfies
     *    * Face macros (close up)
     *    * Images with multiple faces
     *    * Images with mid-range faces
     *    * Results of professional photo shoots
     *
     *  **Source Image:**
     *    If you plan to apply a mask to an image multiple times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     *  **Authorization:**
     *      Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Face Enhancement
     * @throws FetchError<400, types.ImageFaceEnhanceResponse400> Bad Request
     * @throws FetchError<401, types.ImageFaceEnhanceResponse401> Unauthorized
     * @throws FetchError<402, types.ImageFaceEnhanceResponse402> Payment Required
     * @throws FetchError<403, types.ImageFaceEnhanceResponse403> Forbidden
     * @throws FetchError<404, types.ImageFaceEnhanceResponse404> Not Found
     * @throws FetchError<405, types.ImageFaceEnhanceResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageFaceEnhanceResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageFaceEnhanceResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageFaceEnhanceResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageFaceEnhanceResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageFaceEnhanceResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageFaceEnhanceResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageFaceEnhanceResponse503> Service Unavailable
     */
    imageFaceEnhance(body?: types.ImageFaceEnhanceBodyParam): Promise<FetchResponse<200, types.ImageFaceEnhanceResponse200>>;
    /**
     * **Service Description:**
     *   This service retrieves a list of supported effects.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Effect Names
     * @throws FetchError<400, types.ImageListEffectNamesResponse400> Bad Request
     * @throws FetchError<401, types.ImageListEffectNamesResponse401> Unauthorized
     * @throws FetchError<402, types.ImageListEffectNamesResponse402> Payment Required
     * @throws FetchError<403, types.ImageListEffectNamesResponse403> Forbidden
     * @throws FetchError<404, types.ImageListEffectNamesResponse404> Not Found
     * @throws FetchError<405, types.ImageListEffectNamesResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageListEffectNamesResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageListEffectNamesResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageListEffectNamesResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageListEffectNamesResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageListEffectNamesResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageListEffectNamesResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageListEffectNamesResponse503> Service Unavailable
     */
    imageListEffectNames(): Promise<FetchResponse<200, types.ImageListEffectNamesResponse200>>;
    /**
     * **Service Description:**
     *   With the *effects* service you can apply up to 24 different effects to an image.
     *
     * **Limitations:** Works best with color-rich photos. Supported source image formats are
     * JPG, PNG, TIFF and WEBP. The effects are fixed, and in case you need to get a different
     * style, please, check out the [Color
     * Transfer](https://docs.picsart.io/reference/image-transfer-color) service.
     *
     * **Examples:**
     *   Examples of where effects can be used include the following:
     *   * Works with all photo types
     *   * Makes any photo stand out
     *   * Helps with branding
     *   * Great with look up tables (LUT)
     *
     * **Options:** Choose the effect to apply
     *
     * **Source Image:**
     *   If you plan to apply effects to an image several times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Effects
     * @throws FetchError<400, types.ImageApplyEffectResponse400> Bad Request
     * @throws FetchError<401, types.ImageApplyEffectResponse401> Unauthorized
     * @throws FetchError<402, types.ImageApplyEffectResponse402> Payment Required
     * @throws FetchError<403, types.ImageApplyEffectResponse403> Forbidden
     * @throws FetchError<404, types.ImageApplyEffectResponse404> Not Found
     * @throws FetchError<405, types.ImageApplyEffectResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageApplyEffectResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageApplyEffectResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageApplyEffectResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageApplyEffectResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageApplyEffectResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageApplyEffectResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageApplyEffectResponse503> Service Unavailable
     */
    imageApplyEffect(body: types.ImageApplyEffectBodyParam): Promise<FetchResponse<200, types.ImageApplyEffectResponse200>>;
    /**
     * **Service Description:**
     *   The *effects previews* service applies an effect to a given input image and returns a
     * preview (i.e., thumbnail) of the effect.
     *
     * **Limitations:** Can apply up to 10 effects to an image in one call. To minimize the
     * networking and processing loads, use the same input image size as the desired preview
     * size. Supported source image formats are JPG, PNG, TIFF and WEBP.
     *
     * **Minimums/Maximums:**
     *   * Maximum height or width of preview image is 240px
     *
     * **Options:**
     *   * You can set the size of the preview image
     *   * There are 24 different effects to choose from
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Effect Previews
     * @throws FetchError<400, types.ImageCreateEffectPreviewsResponse400> Bad Request
     * @throws FetchError<401, types.ImageCreateEffectPreviewsResponse401> Unauthorized
     * @throws FetchError<402, types.ImageCreateEffectPreviewsResponse402> Payment Required
     * @throws FetchError<403, types.ImageCreateEffectPreviewsResponse403> Forbidden
     * @throws FetchError<404, types.ImageCreateEffectPreviewsResponse404> Not Found
     * @throws FetchError<405, types.ImageCreateEffectPreviewsResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageCreateEffectPreviewsResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageCreateEffectPreviewsResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageCreateEffectPreviewsResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageCreateEffectPreviewsResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageCreateEffectPreviewsResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageCreateEffectPreviewsResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageCreateEffectPreviewsResponse503> Service Unavailable
     */
    imageCreateEffectPreviews(body: types.ImageCreateEffectPreviewsBodyParam): Promise<FetchResponse<200, types.ImageCreateEffectPreviewsResponse200>>;
    /**
     * **Service Description:**
     *   Apply a laser engraving effect to your stickers.
     *
     * **Source Image:**
     *   the input image should already be a sticker,
     *   e.g. have a transparent background. If the source image still has a background, or
     * needs a better background cut,
     *   consider using the [Remove
     * Background](https://docs.picsart.io/reference/image-remove-background) service before
     * using this service.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Laser Engraving Effect
     * @throws FetchError<400, types.ImageApplyLaserEngravingEffectResponse400> Bad Request
     * @throws FetchError<401, types.ImageApplyLaserEngravingEffectResponse401> Unauthorized
     * @throws FetchError<402, types.ImageApplyLaserEngravingEffectResponse402> Payment Required
     * @throws FetchError<403, types.ImageApplyLaserEngravingEffectResponse403> Forbidden
     * @throws FetchError<404, types.ImageApplyLaserEngravingEffectResponse404> Not Found
     * @throws FetchError<405, types.ImageApplyLaserEngravingEffectResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageApplyLaserEngravingEffectResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageApplyLaserEngravingEffectResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageApplyLaserEngravingEffectResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageApplyLaserEngravingEffectResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageApplyLaserEngravingEffectResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageApplyLaserEngravingEffectResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageApplyLaserEngravingEffectResponse503> Service Unavailable
     */
    imageApplyLaserEngravingEffect(body?: types.ImageApplyLaserEngravingEffectBodyParam): Promise<FetchResponse<200, types.ImageApplyLaserEngravingEffectResponse200>>;
    /**
     * **Service Description:**
     *   This service retrieves the list of supported AI effects.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary AI Effect Names
     * @throws FetchError<400, types.ImageListAiEffectNamesResponse400> Bad Request
     * @throws FetchError<401, types.ImageListAiEffectNamesResponse401> Unauthorized
     * @throws FetchError<402, types.ImageListAiEffectNamesResponse402> Payment Required
     * @throws FetchError<403, types.ImageListAiEffectNamesResponse403> Forbidden
     * @throws FetchError<404, types.ImageListAiEffectNamesResponse404> Not Found
     * @throws FetchError<405, types.ImageListAiEffectNamesResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageListAiEffectNamesResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageListAiEffectNamesResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageListAiEffectNamesResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageListAiEffectNamesResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageListAiEffectNamesResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageListAiEffectNamesResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageListAiEffectNamesResponse503> Service Unavailable
     */
    imageListAiEffectNames(): Promise<FetchResponse<200, types.ImageListAiEffectNamesResponse200>>;
    /**
     * **Service Description:**
     *   With the *AI Effects* service you can apply up to 40+ different AI effects to an
     * image.
     *
     * **Limitations:** Supported source image formats are JPG, PNG, TIFF and WEBP. The styles
     * are fixed, and in case you need to get a different style, please, check out the [Style
     * Transfer](https://docs.picsart.io/reference/image-transfer-style) service.
     * **Examples:**
     *   Examples of where effects can be used include the following:
     *   * Works with all photo types
     *   * Makes any photo stand out
     *   * Helps with creating engaging scenes
     *
     * **Options:** Choose the effect to apply
     * **Source Image:**
     *   If you plan to apply effects to an image several times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary AI Effects
     * @throws FetchError<400, types.ImageApplyAiEffectResponse400> Bad Request
     * @throws FetchError<401, types.ImageApplyAiEffectResponse401> Unauthorized
     * @throws FetchError<402, types.ImageApplyAiEffectResponse402> Payment Required
     * @throws FetchError<403, types.ImageApplyAiEffectResponse403> Forbidden
     * @throws FetchError<404, types.ImageApplyAiEffectResponse404> Not Found
     * @throws FetchError<405, types.ImageApplyAiEffectResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageApplyAiEffectResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageApplyAiEffectResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageApplyAiEffectResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageApplyAiEffectResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageApplyAiEffectResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageApplyAiEffectResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageApplyAiEffectResponse503> Service Unavailable
     */
    imageApplyAiEffect(body: types.ImageApplyAiEffectBodyParam): Promise<FetchResponse<200, types.ImageApplyAiEffectResponse200>>;
    /**
     * **Service Description:**
     *   The *adjust* service applies adjustments to an input image. There are 11 different
     * adjustments in all available. The adjust service can be used with all photo types.
     *
     * **Limitations:** Supported source image formats are JPG, PNG, TIFF and WEBP.
     *
     * **Options:** Adjustment options include the following:
     *   * Adjust brightness and/or contrast
     *   * Adjust clarity and/or saturation
     *   * Adjust hue and/or shadows
     *   * Adjust highlights and/or temperature
     *   * Adjust noise or sharpen the image
     *
     * **Rules:**
     *   * At least one adjustment setting must be chosen
     *   * If you choose an adjustment setting value out of the allowed range, the default
     * value of 0 is used instead.
     *
     * **Source Image:**
     *   If you plan to apply adjustments multiple times to an image, we recommend you first
     * upload the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Adjust
     * @throws FetchError<400, types.ImageAdjustResponse400> Bad Request
     * @throws FetchError<401, types.ImageAdjustResponse401> Unauthorized
     * @throws FetchError<402, types.ImageAdjustResponse402> Payment Required
     * @throws FetchError<403, types.ImageAdjustResponse403> Forbidden
     * @throws FetchError<404, types.ImageAdjustResponse404> Not Found
     * @throws FetchError<405, types.ImageAdjustResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageAdjustResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageAdjustResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageAdjustResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageAdjustResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageAdjustResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageAdjustResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageAdjustResponse503> Service Unavailable
     */
    imageAdjust(body?: types.ImageAdjustBodyParam): Promise<FetchResponse<200, types.ImageAdjustResponse200>>;
    /**
     * **Service Description:**
     *   The *color transfer* tool transfers the color style from a reference image to the
     * target image.
     *
     * **Limitations:** Works best with photos. Supported source image formats are JPG, PNG,
     * TIFF and WEBP.
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Color Transfer
     * @throws FetchError<400, types.ImageTransferColorResponse400> Bad Request
     * @throws FetchError<401, types.ImageTransferColorResponse401> Unauthorized
     * @throws FetchError<402, types.ImageTransferColorResponse402> Payment Required
     * @throws FetchError<403, types.ImageTransferColorResponse403> Forbidden
     * @throws FetchError<404, types.ImageTransferColorResponse404> Not Found
     * @throws FetchError<405, types.ImageTransferColorResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageTransferColorResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageTransferColorResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageTransferColorResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageTransferColorResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageTransferColorResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageTransferColorResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageTransferColorResponse503> Service Unavailable
     */
    imageTransferColor(body?: types.ImageTransferColorBodyParam): Promise<FetchResponse<200, types.ImageTransferColorResponse200>>;
    /**
     * **Service Description:**
     *   The *style transfer* tool transfers a style from a reference image to a content image.
     * The smart algorithm blends the two images together so the output looks like the content
     * image, but "painted" in the style of the reference image.
     *
     * **Limitations:** Works best with graphics reference images. Works best with nature
     * content images. Supported source image formats are JPG, PNG, TIFF and WEBP.
     * **Examples:**
     *   Examples of where the style transfer tool can be used include the following:
     *   * Magic filters
     *   * To convert an image to a piece of art
     *   * To generate unique results
     *   * To recreate the style of a famous painting
     *
     * **Options:**
     *   * You can choose from five different levels of transfer
     *
     * **Source Image:**
     *   If you plan to transfer styles to an image multiple times, we recommend you first
     * upload the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Style Transfer
     * @throws FetchError<400, types.ImageTransferStyleResponse400> Bad Request
     * @throws FetchError<401, types.ImageTransferStyleResponse401> Unauthorized
     * @throws FetchError<402, types.ImageTransferStyleResponse402> Payment Required
     * @throws FetchError<403, types.ImageTransferStyleResponse403> Forbidden
     * @throws FetchError<404, types.ImageTransferStyleResponse404> Not Found
     * @throws FetchError<405, types.ImageTransferStyleResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageTransferStyleResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageTransferStyleResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageTransferStyleResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageTransferStyleResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageTransferStyleResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageTransferStyleResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageTransferStyleResponse503> Service Unavailable
     */
    imageTransferStyle(body?: types.ImageTransferStyleBodyParam): Promise<FetchResponse<200, types.ImageTransferStyleResponse200>>;
    /**
     * **Description:**
     *   The *masks previews* service applies mask effects to a given input image and returns a
     * preview (i.e., thumbnail) of the effect.
     *
     * **Limitations:** To minimize the networking and processing loads, use the same input
     * image size as the desired preview size. Supported source image formats are JPG, PNG,
     * TIFF and WEBP.
     *
     * **Minimums/Maximums:**
     *   * Maximum height or width of preview image is 240px
     *
     * **Options:**
     *   * You can set the size of the preview image
     *   * You can choose blend which determines the appearance of the mask
     *   * You can choose mask type
     *   * You can set the mask's opacity
     *   * You can set the mask's hue
     *   * You can choose a mask flip
     *
     * **Source Image:**
     *   If you want to preview multiple effects of the same image, we recommend you first
     * upload the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Mask Previews
     * @throws FetchError<400, types.ImageCreateMaskPreviewsResponse400> Bad Request
     * @throws FetchError<401, types.ImageCreateMaskPreviewsResponse401> Unauthorized
     * @throws FetchError<402, types.ImageCreateMaskPreviewsResponse402> Payment Required
     * @throws FetchError<403, types.ImageCreateMaskPreviewsResponse403> Forbidden
     * @throws FetchError<404, types.ImageCreateMaskPreviewsResponse404> Not Found
     * @throws FetchError<405, types.ImageCreateMaskPreviewsResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageCreateMaskPreviewsResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageCreateMaskPreviewsResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageCreateMaskPreviewsResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageCreateMaskPreviewsResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageCreateMaskPreviewsResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageCreateMaskPreviewsResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageCreateMaskPreviewsResponse503> Service Unavailable
     */
    imageCreateMaskPreviews(body: types.ImageCreateMaskPreviewsBodyParam): Promise<FetchResponse<200, types.ImageCreateMaskPreviewsResponse200>>;
    /**
     * **Service Description:**
     *   The *masks* service applies a mask to an image.
     *
     * **Limitations:** Supported source image formats are JPG, PNG, TIFF and WEBP.
     *
     * **Options:** Each mask application offers five options:
     *  * Blend: determines the appearance of the mask (7 choices)
     *  * Mask type: determines the mask type (11 choices)
     *  * Opacity: determines the opaqueness of the mask (0 to 100)
     *  * Hue: determines the hue of the mask (-180 to 180)
     *  * Mask flip: gives options to flip the mask (5 choices)
     *
     * **Source Image:**
     *   If you plan to apply a mask to an image multiple times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Masks
     * @throws FetchError<400, types.ImageApplyMaskResponse400> Bad Request
     * @throws FetchError<401, types.ImageApplyMaskResponse401> Unauthorized
     * @throws FetchError<402, types.ImageApplyMaskResponse402> Payment Required
     * @throws FetchError<403, types.ImageApplyMaskResponse403> Forbidden
     * @throws FetchError<404, types.ImageApplyMaskResponse404> Not Found
     * @throws FetchError<405, types.ImageApplyMaskResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageApplyMaskResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageApplyMaskResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageApplyMaskResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageApplyMaskResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageApplyMaskResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageApplyMaskResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageApplyMaskResponse503> Service Unavailable
     */
    imageApplyMask(body: types.ImageApplyMaskBodyParam): Promise<FetchResponse<200, types.ImageApplyMaskResponse200>>;
    /**
     * This service is now renamed to [Pattern
     * Generator](https://docs.picsart.io/reference/image-generate-pattern). This name is now
     * deprecated and we recommend moving all integratings to using the new name.
     * **Service Description:**
     *   The *texture generator* tool generates a background texture pattern for the input
     * image. You can create unlimited textures from the same texture source image.
     *
     * **Limitations:** Works best with colorful source images. Supported source image formats
     * are JPG, PNG, TIFF and WEBP.
     *
     * **Examples:**
     *   Examples of where the texture generator tool can be used include the following:
     *   * Backgrounds
     *   * Patterns
     *   * Tiles
     *
     * **Options:**
     *   * You can control width and height of the output image
     *   * You can control the x and y offset, from the center, of the pattern
     *   * You can choose from five different patterns
     *   * You can scale and/or rotate the pattern
     *
     * **Source Image:**
     *   If you want to apply multiple textures to the same image, we recommend you first
     * upload the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Texture Generator (deprecated)
     * @throws FetchError<400, types.ImageGenerateTextureResponse400> Bad Request
     * @throws FetchError<401, types.ImageGenerateTextureResponse401> Unauthorized
     * @throws FetchError<402, types.ImageGenerateTextureResponse402> Payment Required
     * @throws FetchError<403, types.ImageGenerateTextureResponse403> Forbidden
     * @throws FetchError<404, types.ImageGenerateTextureResponse404> Not Found
     * @throws FetchError<405, types.ImageGenerateTextureResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageGenerateTextureResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageGenerateTextureResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageGenerateTextureResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageGenerateTextureResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageGenerateTextureResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageGenerateTextureResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageGenerateTextureResponse503> Service Unavailable
     */
    imageGenerateTexture(body?: types.ImageGenerateTextureBodyParam): Promise<FetchResponse<200, types.ImageGenerateTextureResponse200>>;
    /**
     * **Service Description:**
     *   The *pattern generator* tool generates a background texture pattern for the input
     * image. You can create unlimited patterns from the same source image.
     *
     * **Limitations:** Works best with colorful source images. Supported source image formats
     * are JPG, PNG, TIFF and WEBP.
     *
     * **Examples:**
     *   Examples of where the pattern generator tool can be used include the following:
     *   * Backgrounds
     *   * Patterns
     *   * Tiles
     *
     * **Options:**
     *   * You can control width and height of the output image
     *   * You can control the x and y offset, from the center, of the pattern
     *   * You can choose from five different patterns
     *   * You can scale and/or rotate the pattern
     *
     * **Source Image:**
     *   If you want to apply multiple patterns to the same image, we recommend you first
     * upload the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Pattern Generator
     * @throws FetchError<400, types.ImageGeneratePatternResponse400> Bad Request
     * @throws FetchError<401, types.ImageGeneratePatternResponse401> Unauthorized
     * @throws FetchError<402, types.ImageGeneratePatternResponse402> Payment Required
     * @throws FetchError<403, types.ImageGeneratePatternResponse403> Forbidden
     * @throws FetchError<404, types.ImageGeneratePatternResponse404> Not Found
     * @throws FetchError<405, types.ImageGeneratePatternResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageGeneratePatternResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageGeneratePatternResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageGeneratePatternResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageGeneratePatternResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageGeneratePatternResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageGeneratePatternResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageGeneratePatternResponse503> Service Unavailable
     */
    imageGeneratePattern(body?: types.ImageGeneratePatternBodyParam): Promise<FetchResponse<200, types.ImageGeneratePatternResponse200>>;
    /**
     * **Service Description:**
     *   With the *vectorizer* tool you can instantly turn your raster image into high quality
     * vector graphic as it converts a PNG image to a SVG image.
     *   Using geometric figures, like curves and lines, the vectorizer converts the pixel
     * information of raster input into vector image, which can be enlarged and edited without
     * quality loss.
     *
     * **Limitations:** We recommend keeping files up to 2048 on each side. Supported source
     * image formats are JPG, PNG, TIFF and WEBP. Output is always SVG.
     *
     * **Examples:** Examples of where the vectorizer can be used include:
     *   * Icons
     *   * Logos
     *   * Illustrations
     *   * Graphics
     *   * Shapes
     *
     * **Options:** If the original does not meet the recommended file size, you can downscale
     * with downscale_to parameter.
     *
     * **Minimums/Maximums:**
     *   * Images up to 8K
     *
     * **Source Image:**
     *   You can source the image by providing a file, a URL to an online image, or a
     * reference_id from a previously uploaded image.
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Image Vectorizer
     * @throws FetchError<400, types.ImageVectorizeRasterToSvgResponse400> Bad Request
     * @throws FetchError<401, types.ImageVectorizeRasterToSvgResponse401> Unauthorized
     * @throws FetchError<402, types.ImageVectorizeRasterToSvgResponse402> Payment Required
     * @throws FetchError<403, types.ImageVectorizeRasterToSvgResponse403> Forbidden
     * @throws FetchError<404, types.ImageVectorizeRasterToSvgResponse404> Not Found
     * @throws FetchError<405, types.ImageVectorizeRasterToSvgResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageVectorizeRasterToSvgResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageVectorizeRasterToSvgResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageVectorizeRasterToSvgResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageVectorizeRasterToSvgResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageVectorizeRasterToSvgResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageVectorizeRasterToSvgResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageVectorizeRasterToSvgResponse503> Service Unavailable
     */
    imageVectorizeRasterToSvg(body?: types.ImageVectorizeRasterToSvgBodyParam): Promise<FetchResponse<200, types.ImageVectorizeRasterToSvgResponse200>>;
    /**
     * **Service Description:**
     *   With the *Design Import* tool you can instantly turn your design files (AI, SVG) into
     * a Replay file (Picsart's proprietary project file format) that can be consumed by the
     * [Photo and Video Editor SDK](https://docs.picsart.io/docs/photo-video-editor-overview).
     *
     *   Use this to import your existing designs and make them resuable in Picsart.
     *
     *
     * **Suported Formats:** Examples of where the vectorizer can be used include:
     *   * AI (Adobe Illustrator)
     *   * SVG (Scalable Vector Graphics)
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Design Import (beta)
     * @throws FetchError<400, types.ImageDesignImportResponse400> Bad Request
     * @throws FetchError<401, types.ImageDesignImportResponse401> Unauthorized
     * @throws FetchError<402, types.ImageDesignImportResponse402> Payment Required
     * @throws FetchError<403, types.ImageDesignImportResponse403> Forbidden
     * @throws FetchError<404, types.ImageDesignImportResponse404> Not Found
     * @throws FetchError<405, types.ImageDesignImportResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageDesignImportResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageDesignImportResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageDesignImportResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageDesignImportResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageDesignImportResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageDesignImportResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageDesignImportResponse503> Service Unavailable
     */
    imageDesignImport(body?: types.ImageDesignImportBodyParam): Promise<FetchResponse<202, types.ImageDesignImportResponse202>>;
    /**
     * **Service Description:**
     *   Get the result of the Design Import. Use the inference identifier from the POST
     * request to fetch the latest status and result here.
     *
     * @summary Get the Design Import Result
     * @throws FetchError<400, types.ImageDesignImportGetresultResponse400> Bad Request
     * @throws FetchError<401, types.ImageDesignImportGetresultResponse401> Unauthorized
     * @throws FetchError<402, types.ImageDesignImportGetresultResponse402> Payment Required
     * @throws FetchError<403, types.ImageDesignImportGetresultResponse403> Forbidden
     * @throws FetchError<404, types.ImageDesignImportGetresultResponse404> Not Found
     * @throws FetchError<405, types.ImageDesignImportGetresultResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageDesignImportGetresultResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageDesignImportGetresultResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageDesignImportGetresultResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageDesignImportGetresultResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageDesignImportGetresultResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageDesignImportGetresultResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageDesignImportGetresultResponse503> Service Unavailable
     */
    imageDesignImportGetresult(metadata: types.ImageDesignImportGetresultMetadataParam): Promise<FetchResponse<200, types.ImageDesignImportGetresultResponse200> | FetchResponse<202, types.ImageDesignImportGetresultResponse202>>;
    /**
     * **Service Description:**
     *   With the *surface map* tool you can "print" a sticker over an (target) image.
     *   Using a mask, the Surfacemap tool maps the sticker pixels using the texture and curves
     * on the target image
     *   thus ultimately giving a live-print-preview effect.
     *
     * **Limitations:** We recommend following these rules when providing image, mask and
     * sticker
     *   * Image, mask and sticker - providing all three is required,
     *   * The size of the mask and the image should be the same,
     *   * The size of the sticker should match the "masked" area's size or proportions.
     *
     * **Examples:** Examples of where the Surfacemap can be used include:
     *   * T-shirt print preview
     *   * Mug print preview
     *   * Pillow print preview
     *
     * **Source Images:**
     *   You can source the image by providing a file, a URL to an online image, or a
     * reference_id from a previously uploaded image.
     *   This also applies to the mask and the sticker provided at the input
     *
     *
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Surfacemap Image
     * @throws FetchError<400, types.ImageSurfacemapResponse400> Bad Request
     * @throws FetchError<401, types.ImageSurfacemapResponse401> Unauthorized
     * @throws FetchError<402, types.ImageSurfacemapResponse402> Payment Required
     * @throws FetchError<403, types.ImageSurfacemapResponse403> Forbidden
     * @throws FetchError<404, types.ImageSurfacemapResponse404> Not Found
     * @throws FetchError<405, types.ImageSurfacemapResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageSurfacemapResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageSurfacemapResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageSurfacemapResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageSurfacemapResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageSurfacemapResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageSurfacemapResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageSurfacemapResponse503> Service Unavailable
     */
    imageSurfacemap(body?: types.ImageSurfacemapBodyParam): Promise<FetchResponse<200, types.ImageSurfacemapResponse200>>;
    /**
     * **Service Description**
     *   The *upload* service is used to upload an image when you want to apply several
     * transformations to it.
     *   By uploading an image first, you'll receive a transaction_id which you can use
     * repeatedly for transformations and thereby avoid having to upload an image for each and
     * every one.
     *   If you're sure you only want to do a single transformation to an image, there's no
     * benefit to using this service. Just jump right to that service.
     *
     *  **Limitations:** Supported source image formats are JPG, PNG, TIFF and WEBP.
     *
     *  **Source Image:**
     *    You can source the image by providing a file or a URL to an online image.
     *
     *  **Authorization:**
     *      Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Upload Image
     * @throws FetchError<400, types.ImageUploadResponse400> Bad Request
     * @throws FetchError<401, types.ImageUploadResponse401> Unauthorized
     * @throws FetchError<402, types.ImageUploadResponse402> Payment Required
     * @throws FetchError<403, types.ImageUploadResponse403> Forbidden
     * @throws FetchError<404, types.ImageUploadResponse404> Not Found
     * @throws FetchError<405, types.ImageUploadResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageUploadResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageUploadResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageUploadResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageUploadResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageUploadResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageUploadResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageUploadResponse503> Service Unavailable
     */
    imageUpload(body?: types.ImageUploadBodyParam): Promise<FetchResponse<200, types.ImageUploadResponse200>>;
    /**
     * Check your balance of credits.
     * **Authorization:**
     *     Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Credits Balance
     * @throws FetchError<400, types.ImageCreditsBalanceResponse400> Bad Request
     * @throws FetchError<401, types.ImageCreditsBalanceResponse401> Unauthorized
     * @throws FetchError<402, types.ImageCreditsBalanceResponse402> Payment Required
     * @throws FetchError<403, types.ImageCreditsBalanceResponse403> Forbidden
     * @throws FetchError<404, types.ImageCreditsBalanceResponse404> Not Found
     * @throws FetchError<405, types.ImageCreditsBalanceResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageCreditsBalanceResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageCreditsBalanceResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageCreditsBalanceResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageCreditsBalanceResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageCreditsBalanceResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageCreditsBalanceResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageCreditsBalanceResponse503> Service Unavailable
     */
    imageCreditsBalance(): Promise<FetchResponse<200, types.ImageCreditsBalanceResponse200>>;
    /**
     * **Service Description:**
     *   The *Edit* service applies basic image editing to an input image.
     *   The basic editing operations are resize, crop, flip, rotate and perspective
     * manipulation.
     *
     *  **Limitations:**
     * Supported image formats are JPG, PNG, TIFF and WEBP. The resultant image cannot be
     * bigger than the original source image. To get greater resolution, see the Upscale
     * services.
     *
     *  **Options:**
     *    * Define the crop dimensions: width and height
     *    * Define the area of the cutout
     *      * If the area is not defined, the cut out will be done with center-crop.
     *    * Rotate the image
     *      * By degrees (+180 to -180)
     *      * The original image, after rotation, may be zoomed to fill in the area
     *    * Flip the image: horizontally or vertically
     *    * Choose the perspective view of the image: horizontal or vertical
     *
     *  **Rules:**
     *    * If you choose an Edit setting value out of the allowed range, the default value of
     * the field will be used instead (see documentation below).
     *
     *  **Source Image:**
     *    If you plan to apply a mask to an image multiple times, we recommend you first upload
     * the source image using the *Upload* method and then use the reference image ID.
     * Otherwise, you can source the image by providing a file or a URL to an online image.
     *
     *  **Authorization:**
     *      Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Basic Editing
     * @throws FetchError<400, types.ImageEditResponse400> Bad Request
     * @throws FetchError<401, types.ImageEditResponse401> Unauthorized
     * @throws FetchError<402, types.ImageEditResponse402> Payment Required
     * @throws FetchError<403, types.ImageEditResponse403> Forbidden
     * @throws FetchError<404, types.ImageEditResponse404> Not Found
     * @throws FetchError<405, types.ImageEditResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageEditResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageEditResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageEditResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageEditResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageEditResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageEditResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageEditResponse503> Service Unavailable
     */
    imageEdit(body?: types.ImageEditBodyParam): Promise<FetchResponse<200, types.ImageEditResponse200>>;
    /**
     * Whether you're adding a custom watermark, layering in a texture,  or composing
     * multi-image layouts for eCommerce or social media,  Blend service turns simple images
     * into sophisticated visuals with just one call.
     * This endpoint lets you seamlessly combine a base image with another visual layer -  like
     * an overlay, mask, or logo - while giving you full control over how the two interact.
     * Think of it as your virtual creative layer engine: the same power you'd expect from a
     * professional design tool,  now embedded into your workflow or platform.
     * No need for manual edits or complex graphic design tools.  With the blend API, your app
     * or service can automate visually rich output that's both fast and fully customizable.
     *
     * **Unlock Creative Use Cases**
     *
     *   From branding consistency to storytelling visuals, here are just a few ways teams and
     * platforms use the blend API:
     *   * Custom Masks for Stylized Photos: Overlay shape masks or frames to give
     * user-uploaded images a consistent look and feel - perfect for seasonal campaigns or
     * photo templates.
     *   * Dynamic Watermarks for Content Protection: Automatically apply branded watermarks to
     * images uploaded by your users or generated by your AI workflows to maintain ownership
     * and brand visibility.
     *   * Texture Layers for Realistic Effects: Add grain, paper, canvas, or grunge overlays
     * on top of your product visuals to simulate physical material or add a tactile feel.
     *   * Social Media Ready Graphics: Pre-build templates that dynamically layer in user data
     * - like quotes, names, or avatars - over backgrounds to generate post-ready, shareable
     * content in seconds.
     *   * eCommerce Visual Personalization: Show product previews with customers’ names,
     * designs, or logos blended directly into product mockups like t-shirts, mugs, or
     * packaging in real time.
     *
     * **Authorization:**
     *
     *    Start transforming your images today! Just remember, accessing our powerful API
     * requires an API key.
     *    Make sure it's included in your request header **X-Picsart-API-Key** for smooth
     * authorization.
     *    This key unlocks the full potential of our remove background service,
     *    ensuring you can seamlessly integrate these capabilities into your own platform.
     *
     * Whether you're creating at scale or giving your users powerful customization tools, the
     * blend service helps you merge images with intention and beauty-automatically, and at any
     * volume.
     * Just bring your images. We'll handle the artistry.
     *
     * @summary Blending
     * @throws FetchError<400, types.ImageBlendResponse400> Bad Request
     * @throws FetchError<401, types.ImageBlendResponse401> Unauthorized
     * @throws FetchError<402, types.ImageBlendResponse402> Payment Required
     * @throws FetchError<403, types.ImageBlendResponse403> Forbidden
     * @throws FetchError<404, types.ImageBlendResponse404> Not Found
     * @throws FetchError<405, types.ImageBlendResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageBlendResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageBlendResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageBlendResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageBlendResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageBlendResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageBlendResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageBlendResponse503> Service Unavailable
     */
    imageBlend(body?: types.ImageBlendBodyParam): Promise<FetchResponse<200, types.ImageBlendResponse200>>;
    /**
     * **Service Description:**
     *   This tagging service analyzes the image and suggests hashtags that are relevant to the
     * content.
     *
     * **Authorization:**
     *   Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Image Tagging
     * @throws FetchError<400, types.ImageTaggingResponse400> Bad Request
     * @throws FetchError<401, types.ImageTaggingResponse401> Unauthorized
     * @throws FetchError<402, types.ImageTaggingResponse402> Payment Required
     * @throws FetchError<403, types.ImageTaggingResponse403> Forbidden
     * @throws FetchError<404, types.ImageTaggingResponse404> Not Found
     * @throws FetchError<405, types.ImageTaggingResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageTaggingResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageTaggingResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageTaggingResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageTaggingResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageTaggingResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageTaggingResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageTaggingResponse503> Service Unavailable
     */
    imageTagging(body?: types.ImageTaggingBodyParam): Promise<FetchResponse<200, types.ImageTaggingResponse200>>;
    /**
     * **Service Description:** The image *Describer* service helps generate a detailed text
     * description for the provided image (image2text).
     * **Authorization:**
     *   Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Describe Image
     * @throws FetchError<400, types.ImageDescriberResponse400> Bad Request
     * @throws FetchError<401, types.ImageDescriberResponse401> Unauthorized
     * @throws FetchError<402, types.ImageDescriberResponse402> Payment Required
     * @throws FetchError<403, types.ImageDescriberResponse403> Forbidden
     * @throws FetchError<404, types.ImageDescriberResponse404> Not Found
     * @throws FetchError<405, types.ImageDescriberResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageDescriberResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageDescriberResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageDescriberResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageDescriberResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageDescriberResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageDescriberResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageDescriberResponse503> Service Unavailable
     */
    imageDescriber(body: types.ImageDescriberBodyParam): Promise<FetchResponse<200, types.ImageDescriberResponse200>>;
    /**
     * The car image *Classifier* service categorizes all provided images. The supported
     * categories are exterior, interior, engine, undercarriage, other.
     * **Source Image:**
     *   It is mandatory that the provided input image is a car image. If the image is not a
     * car image, the service will not generate an error, and the result may not be relevant.
     *
     * **Authorization:**
     *   Requires an API key to be provided in the **X-Picsart-API-Key** request header.
     *
     * @summary Classify the Car Image
     * @throws FetchError<400, types.ImageCarsClassifierResponse400> Bad Request
     * @throws FetchError<401, types.ImageCarsClassifierResponse401> Unauthorized
     * @throws FetchError<402, types.ImageCarsClassifierResponse402> Payment Required
     * @throws FetchError<403, types.ImageCarsClassifierResponse403> Forbidden
     * @throws FetchError<404, types.ImageCarsClassifierResponse404> Not Found
     * @throws FetchError<405, types.ImageCarsClassifierResponse405> Method Not Allowed
     * @throws FetchError<413, types.ImageCarsClassifierResponse413> Request Entity Too Large
     * @throws FetchError<415, types.ImageCarsClassifierResponse415> Unsupported Media Type
     * @throws FetchError<422, types.ImageCarsClassifierResponse422> Unprocessable Entity
     * @throws FetchError<429, types.ImageCarsClassifierResponse429> Too Many Requests
     * @throws FetchError<431, types.ImageCarsClassifierResponse431> Request Header Fields Too Large
     * @throws FetchError<500, types.ImageCarsClassifierResponse500> Internal Server Error
     * @throws FetchError<503, types.ImageCarsClassifierResponse503> Service Unavailable
     */
    imageCarsClassifier(body: types.ImageCarsClassifierBodyParam): Promise<FetchResponse<200, types.ImageCarsClassifierResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
