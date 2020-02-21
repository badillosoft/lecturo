return async container => {
    while (!getMyRandomQuote) await new Promise(resolve => setTimeout(resolve, 100));

    getMyRandomQuote();

    const {
        audio,
        startButton,
        jumbotron,
        qrScannerMain,
        qrScannerInfo,
        qrScannerContainer,
        qrTarget,
        qrInfoStatus,
        quoteContainer,
        quoteText,
        quoteAutor
    } = container.ref.id;


    startButton.bind.click = async () => {
        jumbotron.hidden = true;
        qrScannerMain.hidden = false;
        qrScannerInfo.hidden = false;

        const qrScannerContainer = container.querySelector(".scanner");

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

            const audios = {
                L001: "audios/corazon_01.m4a",
                L002: "audios/corazon_16.mp3",
                L003: "audios/florentino_01.m4a",
                L004: "audios/principito.m4a",
                L005: "audios/sueños.m4a",
            };

            const textos = {
                L001: {
                    titulo: "Corazón: Diario de un niño - Capítulo 1",
                    autor: "Edmundo de Amicis"
                },
                L002: {
                    titulo: "Corazón: Diario de un niño - Capítulo 16",
                    autor: "Edmundo de Amicis"
                },
                L003: {
                    titulo: "El pequeño escribiente florentino - Capítulo 1",
                    autor: "Edmundo de Amicis"
                },
                L004: {
                    titulo: "El principito",
                    autor: "Antoine de Saint-Exupéry"
                },
                L005: {
                    titulo: "Sueños rotos - Novela Corta",
                    autor: "Desconocido"
                }
            };

            const keys = Object.keys(audios);

            const randomKey = keys[Math.floor(Math.random() * keys.length)];

            audio.src = audios[url.trim()] || audios[randomKey];

            while (audio.readyState !== 4) await new Promise(resolve => setTimeout(resolve, 100));

            audio.play();

            qrInfoStatus.textContent = "Encontrado :D";

            setTimeout(() => {
                qrInfoStatus.innerHTML = `Escaneando... <i class="fas fa-spinner fa-spin ml-2"></i>`;
            }, 1000);

            quoteContainer.hidden = false;

            const texto = textos[url.trim()] || textos[randomKey];

            quoteText.textContent = texto.titulo;
            quoteAutor.textContent = texto.autor;

            // const autores = [
            //     "Mercedes Sosa",
            //     "Atahualpa Yupanqui",
            //     "León Gieco",
            //     "Charly García",
            //     "Alí Primera",
            //     "Facundo Cabral"
            // ];

            // const myRandomIndexArtist = randomRange(0, autores.length - 1);//myRandomArtistArray.length - 1

            // const autor = autores[Math.floor(Math.random() * autores.length)];

            // const next = () => {
            //     WikiquoteApi.getRandomQuote(autor,
            //         function (quoteResult) {
            //             if (!quoteResult.quote) {
            //                 next();
            //                 return;
            //             }

            //             console.log(quoteResult);

            //             quoteText.textContent = quoteResult.quote;
            //             quoteAutor.textContent = quoteResult.titles;

            //             qrScannerMain.hidden = true;
            //             qrScannerInfo.hidden = true;
            //             quoteContainer.hidden = false;
            //         },
            //         function (msg) {
            //             alert(msg);
            //         }
            //     );
            // };

            // next();
        });
    };


};