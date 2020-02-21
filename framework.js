/**
 * framework.js - Simple Javascript Framework
 * Alan Badillo Salas (C) 2020 (badillo.soft@hotmai.com)
 */

async function requestText(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        console.warn(`invalid ${url}`);
        return "";
    }

    return await response.text();
}

async function loadComponent(name, root, before) {

    window.framework = window.framework || {};
    window.framework.controllers = window.framework.controllers || {};
    window.framework.views = window.framework.views || {};

    const view = await requestText(`components/${name}/view.html`);
    const controller = await requestText(`components/${name}/controller.js`);

    const template = document.createElement("template");

    template.innerHTML = view;

    const node = document.importNode(template.content, true);

    const container = zen([...node.children].filter(element => element.tagName !== "STYLE")[0]);

    node.querySelectorAll("style").forEach(style => {
        document.body.append(style);
    });

    const scripts = [...node.querySelectorAll("script[src]")];

    for (let $script of scripts) {
        await new Promise((resolve, reject) => {
            let script = document.createElement("script");
            script.addEventListener("load", resolve);
            script.addEventListener("error", reject);
            script.src = $script.src;
            document.body.append(script);
        }).catch(console.warn);
        console.log($script.src);
    }

    const apply = await new Function(controller || "return container => {}")();

    await apply(container);

    if (root) {
        if (before) await before(root);
        root.append(container);
    }

    return container;
}