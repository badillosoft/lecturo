return container => {
    function ease(t) {
        return 1 - 4 * ((t - 0.5) ** 2);
    }

    let run = false;

    async function loop() {
        if (!run) return;

        container.dispatchEvent(new CustomEvent("#tick"));

        const spans = [...container.querySelectorAll("span")].filter(span => span.textContent);

        let last_span = null;

        let i = 0;
        const n = spans.length;

        for (let span of spans) {
            if (last_span) last_span.style.fontSize = "24px";
            last_span = span;
            let t = ease(i / (n - 1)) * 80 + 40;
            span.style.fontSize = `28px`;
            await new Promise(resolve => setTimeout(resolve, t));
            i++;
        }

        if (last_span) last_span.style.fontSize = "24px";

        await new Promise(resolve => setTimeout(resolve, 2000));

        loop();
    }

    container.addEventListener(":login", () => {
        container.classList.add("login");
    });

    container.addEventListener("#start", () => {
        run = true;
        loop();
    });

    container.addEventListener("#stop", () => {
        run = false;
    });

    container.dispatchEvent(new CustomEvent("#start"));
};