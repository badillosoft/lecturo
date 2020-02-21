return async container => {
    const logo = await loadComponent("logo", container);
    const finger = await loadComponent("finger", container);

    finger.addEventListener("#login", async () => {
        logo.dispatchEvent(new CustomEvent(":login"));

        const pagar = await loadComponent("pagar");
        container.append(pagar);
    });

    logo.addEventListener("#tick", () => {
        finger.classList.toggle("active");
    });
};