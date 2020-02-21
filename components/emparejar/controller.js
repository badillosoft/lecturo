return async container => {
    const img = container.querySelector('.imgProfile > img');
    const name = container.querySelector('.name');

    const qrScannerContainer = container.querySelector(".scanner");

    const qrTarget = container.querySelector(".qr-target");

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

            const fetchApi = await loadApi("fetch");

            const seed = `${url.replace(/[^\w]/g, "")}x`;

            console.log(seed);

            const data = (await fetchApi({
                type: "json",
                url: `https://randomuser.me/api/?seed=${seed}`
            })).output;

            img.src = data.results[0].picture.large;

            name.textContent = `
            ${data.results[0].name.title} 
            ${data.results[0].name.first} 
            ${data.results[0].name.last}
        `;
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