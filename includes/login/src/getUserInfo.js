"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatData(data) {
	const retObj = {};

	for (const prop in data) {
		// eslint-disable-next-line no-prototype-builtins
		if (data.hasOwnProperty(prop)) {
			const innerObj = data[prop];
			retObj[prop] = {
				name: innerObj.name,
				firstName: innerObj.firstName,
				vanity: innerObj.vanity,
				thumbSrc: innerObj.thumbSrc,
				profileUrl: innerObj.uri,
				gender: innerObj.gender,
				type: innerObj.type,
				isFriend: innerObj.is_friend,
				isBirthday: !!innerObj.is_birthday,
				searchTokens: innerObj.searchTokens,
				alternateName: innerObj.alternateName
			};
		}
	}

	return retObj;
}

module.exports = function (defaultFuncs, api, ctx) {
	// Enhanced rate limiting with longer delays and better caching
	const userInfoCache = new Map();
	const rateLimitState = {
		lastRequestTime: 0,
		requestCount: 0,
		isBlocked: false,
		blockUntil: 0,
		resetTime: Date.now() + 3600000, // Reset hourly
		consecutiveErrors: 0
	};

	const CONFIG = {
		MIN_DELAY: 2000, // 2 seconds minimum between requests
		CACHE_DURATION: 300000, // 5 minutes cache
		MAX_RETRIES: 0, // No retries to prevent spam
		RETRY_DELAYS: [], // No retry delays
		BATCH_SIZE: 3, // Very small batch size
		MAX_REQUESTS_PER_HOUR: 100, // Much lower hourly limit
		BLOCK_DURATION: 60000, // 1 minute block after rate limit
		EXPONENTIAL_BACKOFF_BASE: 1.5
	};

	return function getUserInfo(id, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, friendList) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(friendList);
			};
		}

		if (utils.getType(id) !== "Array") {
			id = [id];
		}

		// Check cache first
		const now = Date.now();
		const cachedResults = {};
		const uncachedIds = [];

		// Reset hourly counter
		if (now > rateLimitState.resetTime) {
			rateLimitState.requestCount = 0;
			rateLimitState.resetTime = now + 3600000;
			rateLimitState.consecutiveErrors = 0;
		}

		// Check if we're in a blocked state
		if (rateLimitState.isBlocked && now < rateLimitState.blockUntil) {
			// Return cached data or fallback
			const fallbackData = {};
			id.forEach(userId => {
				const cached = userInfoCache.get(`user_${userId}`);
				if (cached && (now - cached.timestamp) < CONFIG.CACHE_DURATION * 2) {
					fallbackData[userId] = cached.data;
				} else {
					const shortId = userId.slice(-6);
					fallbackData[userId] = {
						name: `FB_User_${shortId}`,
						firstName: `User_${shortId}`,
						vanity: "",
						thumbSrc: `https://graph.facebook.com/${userId}/picture?type=large`,
						profileUrl: `https://facebook.com/${userId}`,
						gender: 0,
						type: "user",
						isFriend: false,
						isBirthday: false,
						searchTokens: [],
						alternateName: ""
					};
				}
			});
			return callback(null, fallbackData);
		}

		// Check cache and hourly limits
		for (const userId of id) {
			const cacheKey = `user_${userId}`;
			const cached = userInfoCache.get(cacheKey);
			if (cached && (now - cached.timestamp) < CONFIG.CACHE_DURATION) {
				cachedResults[userId] = cached.data;
			} else {
				uncachedIds.push(userId);
			}
		}

		// Return cached data if all is available
		if (uncachedIds.length === 0) {
			return callback(null, cachedResults);
		}

		// Check hourly rate limit
		if (rateLimitState.requestCount >= CONFIG.MAX_REQUESTS_PER_HOUR) {
			const waitTime = rateLimitState.resetTime - now;
			if (waitTime > 0) {
				// Return cached + fallback data
				const combinedData = { ...cachedResults };
				uncachedIds.forEach(userId => {
					combinedData[userId] = {
						name: `User-${userId.slice(-6)}`,
						firstName: "Unknown",
						vanity: "",
						thumbSrc: `https://graph.facebook.com/${userId}/picture?type=large`,
						profileUrl: `https://facebook.com/${userId}`,
						gender: 0,
						type: "user",
						isFriend: false,
						isBirthday: false,
						searchTokens: [],
						alternateName: ""
					};
				});
				return callback(null, combinedData);
			}
		}

		// Limit batch size
		const batchedIds = uncachedIds.slice(0, CONFIG.BATCH_SIZE);

		async function makeRequestWithRetry(retryCount = 0) {
			try {
				// Enhanced rate limiting with exponential backoff
				const timeSinceLastRequest = now - rateLimitState.lastRequestTime;
				const requiredDelay = CONFIG.MIN_DELAY * Math.pow(CONFIG.EXPONENTIAL_BACKOFF_BASE, rateLimitState.consecutiveErrors);

				if (timeSinceLastRequest < requiredDelay) {
					const waitTime = requiredDelay - timeSinceLastRequest;
					await new Promise(resolve => setTimeout(resolve, waitTime));
				}

				rateLimitState.lastRequestTime = Date.now();
				rateLimitState.requestCount++;

				const form = {};
				batchedIds.map(function (v, i) {
					form["ids[" + i + "]"] = v;
				});

				const response = await defaultFuncs
					.post("https://www.facebook.com/chat/user_info/", ctx.jar, form)
					.then(utils.parseAndCheckLogin(ctx, defaultFuncs));

				// Handle null response
				if (!response || response === null) {
					console.log(`[getUserInfo] Received null response for users: ${batchedIds.join(', ')}`);
					
					// Return fallback data for null response
					const fallbackData = {};
					batchedIds.forEach(userId => {
						const shortId = userId.slice(-6);
						fallbackData[userId] = {
							name: `User_${shortId}`,
							firstName: `User_${shortId}`,
							vanity: "",
							thumbSrc: `https://graph.facebook.com/${userId}/picture?type=large`,
							profileUrl: `https://facebook.com/${userId}`,
							gender: 0,
							type: "user",
							isFriend: false,
							isBirthday: false,
							searchTokens: [],
							alternateName: ""
						};
					});

					return callback(null, { ...cachedResults, ...fallbackData });
				}

				// Handle rate limiting errors
				if (response.error) {
					if (response.error === 3252001) {
						rateLimitState.consecutiveErrors++;
						rateLimitState.isBlocked = true;
						rateLimitState.blockUntil = Date.now() + CONFIG.BLOCK_DURATION;

						if (retryCount < CONFIG.MAX_RETRIES) {
							const delay = CONFIG.RETRY_DELAYS[retryCount] || CONFIG.RETRY_DELAYS[CONFIG.RETRY_DELAYS.length - 1];
							await new Promise(resolve => setTimeout(resolve, delay));
							return await makeRequestWithRetry(retryCount + 1);
						}

						// Return fallback data after max retries
						const fallbackData = {};
						batchedIds.forEach(userId => {
							fallbackData[userId] = {
								name: `User-${userId.slice(-6)}`,
								firstName: "Unknown",
								vanity: "",
								thumbSrc: `https://graph.facebook.com/${userId}/picture?type=large`,
								profileUrl: `https://facebook.com/${userId}`,
								gender: 0,
								type: "user",
								isFriend: false,
								isBirthday: false,
								searchTokens: [],
								alternateName: ""
							};
						});

						return callback(null, { ...cachedResults, ...fallbackData });
					}

					throw response;
				}

				// Reset error count on success
				rateLimitState.consecutiveErrors = 0;
				rateLimitState.isBlocked = false;

				const formattedData = formatData(response.payload.profiles);

				// Cache the results with extended duration on success
				for (const userId in formattedData) {
					const cacheKey = `user_${userId}`;
					userInfoCache.set(cacheKey, {
						data: formattedData[userId],
						timestamp: Date.now()
					});
				}

				// Combine cached and new results
				const finalResults = { ...cachedResults, ...formattedData };
				return callback(null, finalResults);

			} catch (err) {
				// Handle specific Facebook errors gracefully
				if (err.error === 3252001) {
					rateLimitState.consecutiveErrors++;
					rateLimitState.isBlocked = true;
					rateLimitState.blockUntil = Date.now() + CONFIG.BLOCK_DURATION;

					const fallbackData = {};
					batchedIds.forEach(userId => {
						fallbackData[userId] = {
							name: `User-${userId.slice(-6)}`,
							firstName: "Unknown",
							vanity: "",
							thumbSrc: `https://graph.facebook.com/${userId}/picture?type=large`,
							profileUrl: `https://facebook.com/${userId}`,
							gender: 0,
							type: "user",
							isFriend: false,
							isBirthday: false,
							searchTokens: [],
							alternateName: ""
						};
					});

					return callback(null, { ...cachedResults, ...fallbackData });
				}

				// Don't log rate limit errors to reduce console spam
				if (err.error !== 3252001) {
					log.error("getUserInfo", err);
				}

				return callback(err);
			}
		}

		makeRequestWithRetry();
		return returnPromise;
	};
};