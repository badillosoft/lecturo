return async container => {
    // const login = await loadComponent("login", container);

    const lecturo = await loadComponent("lecturo-home", container);

    console.log(container, lecturo);
};