require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found");
        return;
    }
    const cleanKey = key.trim();
    console.log(`Checking models for key: ${cleanKey.substring(0, 5)}...`);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ERROR ${response.status}: ${errorText}`);
            return;
        }
        const data = await response.json();
        console.log("\n--- Available Models ---");
        const models = data.models;
        if (models && models.length > 0) {
            models.forEach(model => {
                if (model.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${model.name.replace('models/', '')} (${model.version})`);
                }
            });
        } else {
            console.log("No models found.");
        }
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

listModels();
