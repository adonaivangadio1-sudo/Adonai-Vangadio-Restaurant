/* =========================================================
   ADONAI VANGADI RESTAURANT
   SIDE MENU
========================================================= */

(function () {

    "use strict";


    const menuButton =
        document.getElementById("menuButton");

    const closeMenuButton =
        document.getElementById("closeMenuButton");

    const bottomMoreButton =
        document.getElementById("bottomMoreButton");

    const sideMenu =
        document.getElementById("sideMenu");

    const menuOverlay =
        document.getElementById("menuOverlay");


    /* =====================================================
       OPEN MENU
    ===================================================== */

    function openMenu() {

        if (!sideMenu) return;

        sideMenu.classList.add("open");

        menuOverlay?.classList.add("open");

        document.body.classList.add("menu-open");

        menuButton?.setAttribute(
            "aria-expanded",
            "true"
        );

        sideMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       CLOSE MENU
    ===================================================== */

    function closeMenu() {

        if (!sideMenu) return;

        sideMenu.classList.remove("open");

        menuOverlay?.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

        sideMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       TOGGLE
    ===================================================== */

    function toggleMenu() {

        if (
            sideMenu &&
            sideMenu.classList.contains("open")
        ) {

            closeMenu();

        } else {

            openMenu();

        }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    menuButton?.addEventListener(
        "click",
        toggleMenu
    );


    closeMenuButton?.addEventListener(
        "click",
        closeMenu
    );


    menuOverlay?.addEventListener(
        "click",
        closeMenu
    );


    bottomMoreButton?.addEventListener(
        "click",
        openMenu
    );


    /* =====================================================
       CLOSE MENU AFTER LINK
    ===================================================== */

    document
        .querySelectorAll(".side-link:not(.side-button)")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /* =====================================================
       THEME REQUEST FROM MENU
    ===================================================== */

    document.addEventListener(
        "avr:open-theme",
        function () {

            const themePopover =
                document.getElementById(
                    "themePopover"
                );

            const themeButton =
                document.getElementById(
                    "themeButton"
                );

            themePopover?.classList.add("open");

            themeButton?.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    );


    /* =====================================================
       EXPOSE
    ===================================================== */

    window.AVRMenu = {

        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu

    };


})();
/* =========================================================
   AVR — CARDÁPIO
   cardapio.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(
        ".menu-filter-btn"
    );

    const dishCards = document.querySelectorAll(
        ".menu-dish-card"
    );

    const resultCounter = document.getElementById(
        "menuResults"
    );

    const emptyState = document.getElementById(
        "menuEmpty"
    );


    /*
     * ------------------------------------------------------
     * FILTRO DE CATEGORIAS
     * ------------------------------------------------------
     */

    function filterMenu(category) {

        let visibleItems = 0;


        dishCards.forEach((card) => {

            const cardCategory =
                card.dataset.category;


            const shouldShow =
                category === "all" ||
                cardCategory === category;


            if (shouldShow) {

                card.hidden = false;

                visibleItems++;


                /*
                 * Pequeno atraso para permitir
                 * a animação de entrada.
                 */

                card.style.animation =
                    "none";

                requestAnimationFrame(() => {

                    card.style.animation =
                        "";

                });

            } else {

                card.hidden = true;

            }

        });


        /*
         * Atualizar contador
         */

        if (resultCounter) {

            resultCounter.textContent =
                `${visibleItems} ${
                    visibleItems === 1
                        ? "item"
                        : "itens"
                }`;

        }


        /*
         * Mostrar estado vazio
         */

        if (emptyState) {

            emptyState.hidden =
                visibleItems !== 0;

        }

    }


    /*
     * ------------------------------------------------------
     * CLIQUE NOS FILTROS
     * ------------------------------------------------------
     */

    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach((item) => {

                    item.classList.remove(
                        "active"
                    );

                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );

                });


                button.classList.add(
                    "active"
                );

                button.setAttribute(
                    "aria-selected",
                    "true"
                );


                const category =
                    button.dataset.category;


                filterMenu(category);

            }
        );

    });


    /*
     * ------------------------------------------------------
     * INICIALIZAÇÃO
     * ------------------------------------------------------
     */

    filterMenu("all");


    /*
     * ------------------------------------------------------
     * LINKS DOS PRATOS
     *
     * Garante que cada cartão envie o ID correto
     * para pratos.html.
     * ------------------------------------------------------
     */

    dishCards.forEach((card) => {

        const id =
            card.dataset.id;

        const link =
            card.querySelector(
                ".menu-dish-link"
            );


        if (!id || !link) {
            return;
        }


        link.href =
            `pratos.html?id=${encodeURIComponent(id)}`;

    });


});