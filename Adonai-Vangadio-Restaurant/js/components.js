document.addEventListener("DOMContentLoaded", async () => {

    const headerContainer = document.getElementById("header-container");

    if (!headerContainer) {
        return;
    }

    try {

        const response = await fetch("../components/header.html");

        if (!response.ok) {
            throw new Error(
                `Erro ao carregar header: ${response.status}`
            );
        }

        const headerHTML = await response.text();

        headerContainer.innerHTML = headerHTML;


        /*
         * Depois de inserir o cabeçalho,
         * avisamos os outros scripts de que
         * os elementos já estão disponíveis.
         */

        document.dispatchEvent(
            new CustomEvent("avrHeaderLoaded")
        );


    } catch (error) {

        console.error(
            "AVR: Não foi possível carregar o cabeçalho.",
            error
        );

    }

});