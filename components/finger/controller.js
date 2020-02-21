return async container => {
    // const loginApi = await loadApi("login");

    function pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const nombres = ["Pedro", "Alfredo", "Juan", "María", "Karla"];
    const apellidos = ["Pérez", "Gómez", "Juaréz", "Sánchez", "Hernández"];

    function randomName() {
        const nombre = pick(nombres);
        const apellido = pick(apellidos);
        return `${nombre} ${apellido}`;
    }

    container.addEventListener("click", async () => {
        if (container.dataset.lock === "true") return;

        container.dataset.lock = "true";

        // const result = await loginApi({
        //     name: randomName()
        // }).catch(error => {
        //     delete container.dataset.lock;
        //     console.warn(error);
        // });

        // if (result) console.log(result);

        container.classList.add("hide");

        container.dispatchEvent(new CustomEvent("#login"));
    });
};