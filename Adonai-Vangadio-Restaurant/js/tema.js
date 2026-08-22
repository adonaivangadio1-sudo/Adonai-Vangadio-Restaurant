/* =========================================================
   ADONAI VANGADI RESTAURANT
   THEME SYSTEM
========================================================= */

(function () {

    "use strict";


    const STORAGE_KEY = "avr-theme";


    const themeButton =
        document.getElementById("themeButton");

    const themePopover =
        document.getElementById("themePopover");

    const menuThemeButton =
        document.getElementById("menuThemeButton");

    const currentThemeLabel =
        document.getElementById("currentThemeLabel");

    const themeOptions =
        document.querySelectorAll("[data-theme-choice]");


    const themeNames = {
        light: "Claro",
        system: "Automático",
        dark: "Escuro"
    };


    /* =====================================================
       GET SAVED THEME
    ===================================================== */

    function getSavedTheme() {

        return (
            localStorage.getItem(STORAGE_KEY)
            || "system"
        );

    }


    /* =====================================================
       APPLY THEME
    ===================================================== */

    function applyTheme(theme) {

        if (theme === "system") {

            document.documentElement.removeAttribute(
                "data-theme"
            );

        } else {

            document.documentElement.setAttribute(
                "data-theme",
                theme
            );

        }


        updateThemeUI(theme);

        localStorage.setItem(
            STORAGE_KEY,
            theme
        );

    }


    /* =====================================================
       UPDATE UI
    ===================================================== */

    function updateThemeUI(theme) {

        if (currentThemeLabel) {

            currentThemeLabel.textContent =
                themeNames[theme];

        }


        themeOptions.forEach(option => {

            const isSelected =
                option.dataset.themeChoice === theme;

            option.classList.toggle(
                "selected",
                isSelected
            );

        });

    }


    /* =====================================================
       TOGGLE POPOVER
    ===================================================== */

    function toggleThemePopover() {

        if (!themePopover) return;

        const isOpen =
            themePopover.classList.toggle("open");

        themeButton?.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        document.body.classList.toggle(
            "theme-open",
            isOpen
        );

    }


    /* =====================================================
       CLOSE POPOVER
    ===================================================== */

    function closeThemePopover() {

        if (!themePopover) return;

        themePopover.classList.remove("open");

        themeButton?.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "theme-open"
        );

    }


    /* =====================================================
       THEME BUTTON
    ===================================================== */

    themeButton?.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleThemePopover();

        }
    );


    /* =====================================================
       MENU THEME BUTTON
    ===================================================== */

    menuThemeButton?.addEventListener(
        "click",
        function () {

            closeThemePopover();

            document.dispatchEvent(
                new CustomEvent("avr:open-theme")
            );

        }
    );


    /* =====================================================
       THEME OPTIONS
    ===================================================== */

    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            function () {

                const selectedTheme =
                    this.dataset.themeChoice;

                applyTheme(selectedTheme);

                closeThemePopover();

            }
        );

    });


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                themePopover &&
                !themePopover.contains(event.target) &&
                !themeButton?.contains(event.target)
            ) {

                closeThemePopover();

            }

        }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeThemePopover();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    applyTheme(getSavedTheme());


    /* =====================================================
       EXPOSE
    ===================================================== */

    window.AVRTheme = {
        apply: applyTheme,
        get: getSavedTheme,
        open: function () {
            themePopover?.classList.add("open");
        }
    };


})();