return async container => {
    while (!QRCode) await new Promise(resolve => setTimeout(resolve, 100));

    const video = container.querySelector("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const qrcontainer = document.createElement("div");

    const code = new QRCode(qrcontainer, {
        text: "http://badillosoft.com",
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    code.clear();

    qrcode.callback = result => {
        if (result instanceof Error) return;

        console.log(result);

        code.makeCode(result);

        container.dispatchEvent(new CustomEvent("#code", {
            detail: {
                target: qrcontainer,
                source: code,
                url: result
            }
        }));
    };

    video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });

    let lock = false;

    video.addEventListener("timeupdate", () => {
        if (lock) return;

        lock = true;

        context.drawImage(video, 0, 0);

        const url = canvas.toDataURL("image/png");

        qrcode.decode(url);

        setTimeout(() => {
            lock = false
        }, 1000);
    });

    const { devicesSelector } = container.ref.id;

    devicesSelector.bind.change = async () => {
        video.pause();
        devicesSelector.disabled = true;
        alert(devicesSelector.value || "Por defecto");
        await setStream(devicesSelector.value);
        devicesSelector.disabled = false;
    };

    async function setStream(deviceId) {
        let stream = null;

        try {
            const options = { video: true };

            if (deviceId) options.deviceId = { exact: deviceId };

            stream = await navigator.mediaDevices.getUserMedia(options);

            video.srcObject = stream;
            video.play();
        } catch (error) {
            console.warn(error);
        }
    }

    await setStream();

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        for (let device of [{}, ...videoDevices]) {
            let option = document.createElement("option");
            option.value = device.deviceId;
            option.textContent = device.label || "Por defecto";
            devicesSelector.append(option);
        }
    } catch (error) {
        console.warn(error);
    }
};