return async container => {
    let saldo = Number(sessionStorage.getItem("saldo") || "8000");

    const img = container.querySelector('.imgProfile > img');
    const name = container.querySelector('.name');
    const payButton = container.querySelector(".pay-button");
    const payText = container.querySelector(".pay-text");
    const saldoText = container.querySelector(".saldo");

    saldoText.textContent = `$ ${saldo.toFixed(2)}`;

    let quantity = 0;

    const qrScannerContainer = container.querySelector(".scanner");

    const qrTarget = container.querySelector(".qr-target");

    payButton.addEventListener("click", async () => {
        await Swal.fire(
            'Pago Realizado!',
            'Tu pago se ha realizado correctamente :)',
            'success'
        )

        img.src = "images/smile_1.jpg";
        name.innerHTML = `<small>Escanea el código de algún amigo</small>`;
        payButton.disabled = true;
        payText.textContent = "$ 0.00";

        saldo -= quantity;

        sessionStorage.setItem("saldo", saldo);

        saldoText.textContent = `$ ${saldo.toFixed(2)}`;
    });

    (async () => {
        const qrScanner = await loadComponent("qrscan", qrScannerContainer, () => {
            while (qrScannerContainer.firstChild) {
                qrScannerContainer.removeChild(qrScannerContainer.firstChild);
            }
        });

        qrScanner.addEventListener("#code", async ({ detail }) => {
            const { url, target } = detail;

            console.log(url, target);

            qrTarget.textContent = "";
            qrTarget.append(target);

            // const fetchApi = await loadApi("fetch");

            const seed = `${url.replace(/[^\w]/g, "")}x`;

            console.log(seed);

            // const data = (await fetchApi({
            //     type: "json",
            //     url: `https://randomuser.me/api/?seed=${seed}`
            // })).output;

            const response = await fetch(`https://randomuser.me/api/?seed=${seed}`);

            const data = await response.json();

            console.log("data", data);

            img.src = data.results[0].picture.large;

            name.textContent = `
                ${data.results[0].name.title} 
                ${data.results[0].name.first} 
                ${data.results[0].name.last}
            `;

            payButton.disabled = false;

            const amount = seed.split("").reverse().join("").charCodeAt(2) * 10 - 500;

            quantity = amount;

            payText.textContent = `$ ${amount}.00`;
        });
    })();

    // async function cargarApi() {
    //     const fetchApi = await loadApi("fetch");

    //     const data = (await fetchApi({
    //         type: "json",
    //         url: `https://randomuser.me/api/?seed=${Math.floor(Math.random() * 4)}`
    //     })).output;

    //     img.src = data.results[0].picture.large;

    //     name.textContent = `
    //         ${data.results[0].name.title} 
    //         ${data.results[0].name.first} 
    //         ${data.results[0].name.last}
    //     `;
    // }

    // cargarApi();
};