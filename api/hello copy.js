return input => {
    const sum = input.reduce((sum, x) => sum + x, 0.0);
    return {
        sum,
        avg: sum / input.length,
        max: Math.max(...input),
        min: Math.min(...input),
        asc: input.sort((a, b) => a - b)
    };
};