return input => {
    const uuid = (size = 16, radix = 32) => {
        let token = "";
        while (token.length < size) token += Math.random().toString(radix).slice(2);
        return token.slice(0, size);
    };

    const fs = require("fs");
    // fs.writeFileSync("codi-go/state.json", "{}", "utf-8")
    const state = JSON.parse(fs.readFileSync("codi-go/state.json", "utf-8"));

    state.users = state.users || {};

    const { name } = input;

    const token = uuid();

    state.users[name] = {
        name,
        token
    };

    return {
        name,
        token
    };
};