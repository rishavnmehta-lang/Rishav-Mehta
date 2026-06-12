import { tobase64, uploadFile, uploadfile } from "./aicamp_day3/ai_camp_day3.js"
async function query(data) {
	const response = await fetch(
		"https://router.huggingface.co/nscale/v1/images/generations",
		{
			headers: {
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}


query({     response_format: "b64_json",
    prompt: "\"Astronaut riding a horse\"",
    model: "stabilityai/stable-diffusion-xl-base-1.0", }).then((response) => {
    // Use image
let imageURl = await uploadFile(response)
console.log(imageURl)
});