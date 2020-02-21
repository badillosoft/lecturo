return async input => {
    const { url, type, encoding } = input;

    const https = require("https");
    
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            response.setEncoding(encoding || "utf8");
            
            let content = "";
            
            response.on("data", data => {
                content += data;
            });
            
            response.on("end", () => {
                if (type === "json") {
                    resolve(JSON.parse(content));
                    return;
                }
                resolve(content);
            });
        });
    });
};