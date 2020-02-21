return input => {
    const fs = require("fs");

    for (let key in input) {
        let file = input[key];
        console.log(file.data);
        fs.writeFileSync(`test/${Math.random().toString(32).slice(2)}`, file.data);
    }

    return "success";
};