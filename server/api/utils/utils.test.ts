import {removeBearerFromTokenHeader} from "./utils";

describe("removeBearerFromTokenHeader", () => {
	test("it should remove bearer from x-token string", () => {
		const token =
			"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM5LCJ1c2VybmFtZSI6IkRhd2lkIiwiZW1haWwiOiJkYXdpZGRhaGxAZ21haWwuY29tIiwiYWRtaW4iOjEsImlhdCI6MTU4NjcxODMwMSwiZXhwIjoxNTg2NzE4MzExfQ.kiYK7xP4rcctsv2IeSf0rAznY0D3u0sEs4zLg-IZuNZjJQ-Yfdk21zBdW2ealriwW_vrw4I8OirqAYRf5jSjXhE-jZsVuadO5UO4YRywyVUvNPrT-vZheo-hryBqFF3UdGNXVgxF3HrbtNLq9sQFV65h8_k6TGU-DsSu-qpoGbBBwocqhmgV2J6wL3qKHOiK6QYOOPq0flnNwIhoxRmRG4yZewXSLQ4Hxm3NosQkp9gFaxxpNrezWdGTtwYd6R01Zi1J1DRrlH9WOgBmvhfy5r5HLfIeo7p0WsjXQsz9YAUF78sbwJZG8gC251DGxk2zB3aBY3tntfwH6eCIZ8_yYTbGVElfZJ_dMGBF8aFjjW1wzeZooWW6lvYVLkoMd4ELJbSdkBYa7CbAIarCm2-koY1ulZFhfgk7XHjo4qhFSkigNVGHzIYx5uFvUa-xjD3pJQ_tFTrtVHNt2rOwptI4ivIVL9IK-QgsXyc-KwDSzdrH0GPASepO6kHczhiXvwHikxsq0JtuCzuEdpsrjw66hcHpHAzwG8qrRp3LZpTjNHfio5WyunaoWBqWwr2YKafRYXDyDUsNEXrGyQ8lv5nXMzCf1wGvjEfsO88-q7Rc8jWy7ePviSx1ewcFCjx6lWuuLMpzQaTsMutxqA6QJ_1XJynuHhbiceo2HHHSRTSnneo";
		const processedToken = removeBearerFromTokenHeader(token);
		expect(processedToken).not.toMatch(/Bearer|\s/gi);
	});
	test("it should return undefined if token is undefined", () => {
		const token = undefined;
		const processedToken = removeBearerFromTokenHeader(token);
		expect(processedToken).toEqual(undefined);
	});
});
