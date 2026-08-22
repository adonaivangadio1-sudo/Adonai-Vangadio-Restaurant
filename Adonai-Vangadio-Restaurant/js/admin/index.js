/* =========================================================
   AVR ADMIN
   index.js
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEYS = {

        order:
            "avr-order",

        orders:
            "avr-orders",

        adminSession:
            "avr-admin-session",

        theme:
            "avr-theme",

        tables:
            "avr-tables"

    };



    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const menuButton =
        document.getElementById(
            "adminMenuButton"
        );


    const closeMenuButton =
        document.getElementById(
            "adminCloseMenu"
        );


    const menuOverlay =
        document.getElementById(
            "adminMenuOverlay"
        );


    const sidebar =
        document.getElementById(
            "adminSidebar"
        );


    const bottomMore =
        document.getElementById(
            "adminBottomMore"
        );


    const logoutButton =
        document.getElementById(
            "adminLogoutButton"
        );


    const themeButton =
        document.getElementById(
            "adminThemeButton"
        );


    const themeMenuButton =
        document.getElementById(
            "adminThemeMenuButton"
        );


    const themeLabel =
        document.getElementById(
            "adminThemeLabel"
        );



    /* =====================================================
       MENU ADMIN
    ===================================================== */

    function openMenu() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        menuOverlay?.classList.add(
            "open"
        );

        document.body.classList.add(
            "admin-menu-open"
        );

        menuButton?.setAttribute(
            "aria-expanded",
            "true"
        );

        sidebar.setAttribute(
            "aria-hidden",
            "false"
        );

    }



    function closeMenu() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove(
            "open"
        );

        menuOverlay?.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "admin-menu-open"
        );

        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

        sidebar.setAttribute(
            "aria-hidden",
            "true"
        );

    }



    function toggleMenu() {

        if (
            sidebar?.classList.contains(
                "open"
            )
        ) {

            closeMenu();

        } else {

            openMenu();

        }

    }



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


    bottomMore?.addEventListener(
        "click",
        openMenu
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

            }

        }
    );



    /* =====================================================
       FECHAR MENU AO CLICAR NUM LINK
    ===================================================== */

    document
        .querySelectorAll(
            ".admin-side-link:not(.admin-side-button)"
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );


/* =====================================================
   TEMA
===================================================== */

const themeOptions = {
    auto: {
        label: "Automático",
        icon: "◐"
    },

    light: {
        label: "Claro",
        icon: "☀"
    },

    dark: {
        label: "Escuro",
        icon: "☾"
    }
};


let systemThemeMediaQuery = null;


/* =====================================================
   LER TEMA GUARDADO
===================================================== */

function getStoredTheme() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.theme
        )
        || "auto"
    );

}


/* =====================================================
   DETECTAR TEMA DO SISTEMA
===================================================== */

function getSystemTheme() {

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {

        return "dark";

    }

    return "light";

}


/* =====================================================
   APLICAR TEMA VISUAL
===================================================== */

function applyTheme(theme) {

    const root =
        document.documentElement;


    let visualTheme =
        theme;


    /*
     * No modo automático,
     * usamos o tema atual do sistema.
     */

    if (theme === "auto") {

        visualTheme =
            getSystemTheme();

    }


    root.setAttribute(
        "data-theme",
        visualTheme
    );


    /*
     * Compatibilidade com sistemas
     * que utilizam classes no body.
     */

    document.body.classList.toggle(
        "dark-theme",
        visualTheme === "dark"
    );

    document.body.classList.toggle(
        "dark",
        visualTheme === "dark"
    );

}


/* =====================================================
   GUARDAR E APLICAR TEMA
===================================================== */

function setTheme(theme) {

    if (
        !themeOptions[theme]
    ) {

        theme = "auto";

    }


    localStorage.setItem(
        STORAGE_KEYS.theme,
        theme
    );


    applyTheme(
        theme
    );


    updateThemeLabel(
        theme
    );


    updateThemeMenu(
        theme
    );

}


/* =====================================================
   LABEL DO BOTÃO
===================================================== */

function updateThemeLabel(theme) {

    if (!themeLabel) {
        return;
    }


    const option =
        themeOptions[theme]
        || themeOptions.auto;


    themeLabel.textContent =
        option.label;


    if (themeButton) {

        themeButton.setAttribute(
            "aria-label",
            `Tema: ${option.label}`
        );

        themeButton.setAttribute(
            "title",
            `Tema: ${option.label}`
        );

    }


    if (themeMenuButton) {

        themeMenuButton.setAttribute(
            "aria-label",
            `Tema: ${option.label}`
        );

    }

}


/* =====================================================
   CRIAR MENU DE TEMAS
===================================================== */

let themeMenu = null;


/* =====================================================
   CRIAR MENU
===================================================== */

function createThemeMenu() {

    if (themeMenu) {
        return themeMenu;
    }


    themeMenu =
        document.createElement(
            "div"
        );


    themeMenu.className =
        "admin-theme-menu";


    themeMenu.setAttribute(
        "role",
        "menu"
    );


    themeMenu.setAttribute(
        "aria-hidden",
        "true"
    );


    themeMenu.innerHTML = `

        <button
            type="button"
            class="admin-theme-option"
            data-theme-option="auto"
            role="menuitem"
        >

            <span
                class="admin-theme-option-icon"
                aria-hidden="true"
            >
                ◐
            </span>

            <span
                class="admin-theme-option-content"
            >

                <strong>
                    Automático
                </strong>

                <small>
                    Seguir o tema do dispositivo
                </small>

            </span>

            <span
                class="admin-theme-option-check"
                aria-hidden="true"
            >
                ✓
            </span>

        </button>


        <button
            type="button"
            class="admin-theme-option"
            data-theme-option="light"
            role="menuitem"
        >

            <span
                class="admin-theme-option-icon"
                aria-hidden="true"
            >
                ☀
            </span>

            <span
                class="admin-theme-option-content"
            >

                <strong>
                    Claro
                </strong>

                <small>
                    Usar sempre o modo claro
                </small>

            </span>

            <span
                class="admin-theme-option-check"
                aria-hidden="true"
            >
                ✓
            </span>

        </button>


        <button
            type="button"
            class="admin-theme-option"
            data-theme-option="dark"
            role="menuitem"
        >

            <span
                class="admin-theme-option-icon"
                aria-hidden="true"
            >
                ☾
            </span>

            <span
                class="admin-theme-option-content"
            >

                <strong>
                    Escuro
                </strong>

                <small>
                    Usar sempre o modo escuro
                </small>

            </span>

            <span
                class="admin-theme-option-check"
                aria-hidden="true"
            >
                ✓
            </span>

        </button>

    `;


    document.body.appendChild(
        themeMenu
    );


    /*
     * Escolha do tema
     */

    themeMenu
        .querySelectorAll(
            "[data-theme-option]"
        )
        .forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const selectedTheme =
                            option.getAttribute(
                                "data-theme-option"
                            );


                        setTheme(
                            selectedTheme
                        );


                        closeThemeMenu();

                    }
                );

            }
        );


    return themeMenu;

}


/* =====================================================
   POSICIONAR MENU
===================================================== */

function positionThemeMenu() {

    if (
        !themeMenu ||
        !themeMenuButton
    ) {

        return;

    }


    const buttonRect =
        themeMenuButton.getBoundingClientRect();


    const menuWidth =
        245;


    let left =
        buttonRect.right
        - menuWidth;


    let top =
        buttonRect.bottom
        + 10;


    /*
     * Evitar sair da tela pela esquerda.
     */

    if (left < 12) {

        left = 12;

    }


    /*
     * Evitar sair da tela pela direita.
     */

    if (
        left + menuWidth
        > window.innerWidth - 12
    ) {

        left =
            window.innerWidth
            - menuWidth
            - 12;

    }


    /*
     * Se não houver espaço abaixo,
     * abrir acima do botão.
     */

    const menuHeight =
        themeMenu.offsetHeight;


    if (
        top + menuHeight
        > window.innerHeight - 12
    ) {

        top =
            buttonRect.top
            - menuHeight
            - 10;

    }


    themeMenu.style.left =
        `${left}px`;


    themeMenu.style.top =
        `${top}px`;

}


/* =====================================================
   ABRIR MENU DE TEMA
===================================================== */

function openThemeMenu() {

    createThemeMenu();


    updateThemeMenu(
        getStoredTheme()
    );


    themeMenu.classList.add(
        "open"
    );


    themeMenu.setAttribute(
        "aria-hidden",
        "false"
    );


    if (themeMenuButton) {

        themeMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    if (themeButton) {

        themeButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    /*
     * Precisamos aguardar o elemento
     * aparecer para calcular a posição.
     */

    requestAnimationFrame(
        function () {

            positionThemeMenu();

        }
    );

}


/* =====================================================
   FECHAR MENU DE TEMA
===================================================== */

function closeThemeMenu() {

    if (!themeMenu) {
        return;
    }


    themeMenu.classList.remove(
        "open"
    );


    themeMenu.setAttribute(
        "aria-hidden",
        "true"
    );


    if (themeMenuButton) {

        themeMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (themeButton) {

        themeButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =====================================================
   ALTERNAR MENU
===================================================== */

function toggleThemeMenu(event) {

    event?.stopPropagation();


    createThemeMenu();


    if (
        themeMenu.classList.contains(
            "open"
        )
    ) {

        closeThemeMenu();

    } else {

        openThemeMenu();

    }

}


/* =====================================================
   ATUALIZAR OPÇÃO ATIVA
===================================================== */

function updateThemeMenu(theme) {

    if (!themeMenu) {
        return;
    }


    themeMenu
        .querySelectorAll(
            "[data-theme-option]"
        )
        .forEach(
            function (option) {

                const optionTheme =
                    option.getAttribute(
                        "data-theme-option"
                    );


                const active =
                    optionTheme === theme;


                option.classList.toggle(
                    "active",
                    active
                );


                option.setAttribute(
                    "aria-checked",
                    active
                        ? "true"
                        : "false"
                );

            }
        );

}


/* =====================================================
   BOTÕES DE TEMA
===================================================== */

themeButton?.addEventListener(
    "click",
    toggleThemeMenu
);


themeMenuButton?.addEventListener(
    "click",
    toggleThemeMenu
);


/* =====================================================
   FECHAR AO CLICAR FORA
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (!themeMenu) {
            return;
        }


        const clickedInsideMenu =
            themeMenu.contains(
                event.target
            );


        const clickedButton =
            themeButton?.contains(
                event.target
            )
            ||
            themeMenuButton?.contains(
                event.target
            );


        if (
            !clickedInsideMenu &&
            !clickedButton
        ) {

            closeThemeMenu();

        }

    }
);


/* =====================================================
   FECHAR COM ESC
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeThemeMenu();

        }

    }
);


/* =====================================================
   REPOSICIONAR MENU
===================================================== */

window.addEventListener(
    "resize",
    function () {

        if (
            themeMenu?.classList.contains(
                "open"
            )
        ) {

            positionThemeMenu();

        }

    }
);


window.addEventListener(
    "scroll",
    function () {

        if (
            themeMenu?.classList.contains(
                "open"
            )
        ) {

            positionThemeMenu();

        }

    },
    true
);


/* =====================================================
   TEMA AUTOMÁTICO — SISTEMA
===================================================== */

function setupSystemThemeListener() {

    if (
        !window.matchMedia
    ) {

        return;

    }


    systemThemeMediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    const handleSystemThemeChange =
        function () {

            const currentTheme =
                getStoredTheme();


            /*
             * Só reage automaticamente
             * quando o utilizador escolheu
             * "Automático".
             */

            if (
                currentTheme !== "auto"
            ) {

                return;

            }


            applyTheme(
                "auto"
            );


            updateThemeLabel(
                "auto"
            );

        };


    if (
        typeof systemThemeMediaQuery.addEventListener
        === "function"
    ) {

        systemThemeMediaQuery.addEventListener(
            "change",
            handleSystemThemeChange
        );

    } else {

        /*
         * Compatibilidade com browsers antigos.
         */

        systemThemeMediaQuery.addListener(
            handleSystemThemeChange
        );

    }

}


/* =====================================================
   INICIALIZAR TEMA
===================================================== */

function initializeTheme() {

    const storedTheme =
        getStoredTheme();


    /*
     * Aplicar imediatamente.
     */

    applyTheme(
        storedTheme
    );


    updateThemeLabel(
        storedTheme
    );


    createThemeMenu();


    updateThemeMenu(
        storedTheme
    );


    setupSystemThemeListener();

}


initializeTheme();


    /* =====================================================
       DATA ATUAL
    ===================================================== */

    function updateCurrentDate() {

        const element =
            document.getElementById(
                "adminCurrentDate"
            );


        if (!element) {
            return;
        }


        const now =
            new Date();


        const formatter =
            new Intl.DateTimeFormat(
                "pt-AO",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long"
                }
            );


        const date =
            formatter.format(
                now
            );


        element.textContent =
            date.charAt(0).toUpperCase()
            + date.slice(1);

    }



    updateCurrentDate();



    /* =====================================================
       LER PEDIDO ATUAL DO SITE
    ===================================================== */

    function readCurrentOrder() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEYS.order
                );


            if (!raw) {
                return [];
            }


            const parsed =
                JSON.parse(raw);


            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "AVR Admin: não foi possível ler avr-order.",
                error
            );

            return [];

        }

    }



    /* =====================================================
       LER HISTÓRICO DE PEDIDOS
    ===================================================== */

    function readOrders() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEYS.orders
                );


            if (!raw) {

                return [];

            }


            const parsed =
                JSON.parse(raw);


            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "AVR Admin: erro ao ler histórico de pedidos.",
                error
            );

            return [];

        }

    }



    /* =====================================================
       GUARDAR PEDIDO NO HISTÓRICO ADMIN
    ===================================================== */

    function syncCurrentOrder() {

        const currentOrder =
            readCurrentOrder();


        if (
            !currentOrder.length
        ) {

            return;

        }


        const orders =
            readOrders();


        const signature =
            JSON.stringify(
                currentOrder
            );


        const alreadyExists =
            orders.some(
                function (order) {

                    return (
                        order.signature ===
                        signature
                    );

                }
            );


        if (
            alreadyExists
        ) {

            return;

        }


        const newOrder = {

            id:
                generateOrderId(),

            createdAt:
                new Date().toISOString(),

            status:
                "new",

            items:
                currentOrder,

            signature:
                signature

        };


        orders.unshift(
            newOrder
        );


        localStorage.setItem(
            STORAGE_KEYS.orders,
            JSON.stringify(
                orders
            )
        );

    }



    /* =====================================================
       ID DO PEDIDO
    ===================================================== */

    function generateOrderId() {

        const timestamp =
            Date.now()
                .toString()
                .slice(-5);


        return (
            "#"
            + timestamp
        );

    }



    /* =====================================================
       TOTAL DO PEDIDO
    ===================================================== */

    function calculateOrderTotal(
        items
    ) {

        if (
            !Array.isArray(items)
        ) {

            return 0;

        }


        return items.reduce(
            function (
                total,
                item
            ) {

                const price =
                    Number(
                        item.price
                    ) || 0;


                const quantity =
                    Number(
                        item.quantity
                    ) || 1;


                return (
                    total
                    + (
                        price
                        * quantity
                    )
                );

            },
            0
        );

    }



    /* =====================================================
       FORMATAR MOEDA
    ===================================================== */

    function formatCurrency(
        value
    ) {

        const number =
            Number(value) || 0;


        return (
            new Intl.NumberFormat(
                "pt-AO"
            ).format(number)
            + " Kz"
        );

    }



    /* =====================================================
       FORMATAR HORA
    ===================================================== */

    function formatTime(
        date
    ) {

        try {

            return new Intl.DateTimeFormat(
                "pt-AO",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ).format(
                new Date(date)
            );

        } catch {

            return "--:--";

        }

    }



    /* =====================================================
       RENDER PEDIDOS RECENTES
    ===================================================== */

    function renderRecentOrders() {

        const container =
            document.getElementById(
                "recentOrders"
            );


        if (!container) {
            return;
        }


        const orders =
            readOrders();


        if (
            !orders.length
        ) {

            container.innerHTML = `

                <div class="admin-empty-state">

                    <span class="admin-empty-icon">
                        ◇
                    </span>

                    <h3>
                        Nenhum pedido ainda
                    </h3>

                    <p>
                        Os pedidos realizados no site
                        aparecerão aqui automaticamente.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        orders
            .slice(0, 6)
            .forEach(
                function (order) {

                    const total =
                        calculateOrderTotal(
                            order.items
                        );


                    const itemsCount =
                        Array.isArray(
                            order.items
                        )
                            ? order.items.reduce(
                                function (
                                    total,
                                    item
                                ) {

                                    return (
                                        total
                                        + (
                                            Number(
                                                item.quantity
                                            ) || 1
                                        )
                                    );

                                },
                                0
                            )
                            : 0;


                    const status =
                        order.status ||
                        "new";


                    const statusLabels = {

                        new:
                            "Novo",

                        preparing:
                            "Preparação",

                        ready:
                            "Pronto",

                        delivered:
                            "Entregue",

                        cancelled:
                            "Cancelado"

                    };


                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "admin-order-row";


                    row.innerHTML = `

                        <span class="admin-order-number">
                            ${escapeHtml(
                                order.id || "#-----"
                            )}
                        </span>

                        <div class="admin-order-info">

                            <strong>
                                Pedido do cliente
                            </strong>

                            <small>
                                ${itemsCount}
                                ${itemsCount === 1 ? "item" : "itens"}
                                ·
                                ${formatTime(
                                    order.createdAt
                                )}
                            </small>

                        </div>

                        <strong class="admin-order-price">
                            ${formatCurrency(total)}
                        </strong>

                        <span class="admin-order-status ${status}">
                            ${statusLabels[status] || "Novo"}
                        </span>

                    `;


                    container.appendChild(
                        row
                    );

                }
            );

    }



    /* =====================================================
       ESCAPAR HTML
    ===================================================== */

    function escapeHtml(
        value
    ) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }



    /* =====================================================
       ESTATÍSTICAS
    ===================================================== */

    function renderStatistics() {

        const orders =
            readOrders();


        const statOrders =
            document.getElementById(
                "statOrders"
            );


        const statRevenue =
            document.getElementById(
                "statRevenue"
            );


        const statKitchen =
            document.getElementById(
                "statKitchen"
            );


        const sidebarCount =
            document.getElementById(
                "sidebarOrderCount"
            );


        const bottomCount =
            document.getElementById(
                "bottomOrderCount"
            );


        if (statOrders) {

            statOrders.textContent =
                orders.length;

        }


        let revenue =
            0;


        let kitchenOrders =
            0;


        orders.forEach(
            function (order) {

                revenue +=
                    calculateOrderTotal(
                        order.items
                    );


                if (
                    order.status ===
                        "preparing"
                    ||
                    order.status ===
                        "new"
                ) {

                    kitchenOrders++;

                }

            }
        );


        if (statRevenue) {

            statRevenue.textContent =
                formatCurrency(
                    revenue
                );

        }


        if (statKitchen) {

            statKitchen.textContent =
                kitchenOrders;

        }


        if (sidebarCount) {

            sidebarCount.textContent =
                orders.length;

        }


        if (bottomCount) {

            bottomCount.textContent =
                orders.length;

        }

    }



    /* =====================================================
       MESAS
    ===================================================== */

    const defaultTables = [

        {
            id: 1,
            state: "free"
        },

        {
            id: 2,
            state: "occupied"
        },

        {
            id: 3,
            state: "free"
        },

        {
            id: 4,
            state: "waiting"
        },

        {
            id: 5,
            state: "free"
        },

        {
            id: 6,
            state: "occupied"
        },

        {
            id: 7,
            state: "free"
        },

        {
            id: 8,
            state: "free"
        },

        {
            id: 9,
            state: "occupied"
        },

        {
            id: 10,
            state: "free"
        },

        {
            id: 11,
            state: "free"
        },

        {
            id: 12,
            state: "free"
        }

    ];



    function readTables() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEYS.tables
                );


            if (!raw) {

                localStorage.setItem(
                    STORAGE_KEYS.tables,
                    JSON.stringify(
                        defaultTables
                    )
                );


                return defaultTables;

            }


            const parsed =
                JSON.parse(raw);


            if (
                Array.isArray(parsed)
            ) {

                return parsed;

            }

        } catch (error) {

            console.warn(
                "AVR Admin: erro nas mesas.",
                error
            );

        }


        return defaultTables;

    }



    function renderTables() {

        const container =
            document.getElementById(
                "tableStatusGrid"
            );


        const statTables =
            document.getElementById(
                "statTables"
            );


        if (!container) {
            return;
        }


        const tables =
            readTables();


        const stateLabels = {

            free:
                "Livre",

            occupied:
                "Ocupada",

            waiting:
                "Pedido"

        };


        const occupied =
            tables.filter(
                function (table) {

                    return (
                        table.state ===
                        "occupied"
                    );

                }
            ).length;


        if (statTables) {

            statTables.textContent =
                `${occupied}/${tables.length}`;

        }


        container.innerHTML = "";


        tables.forEach(
            function (table) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-table-card "
                    + (
                        table.state !== "free"
                            ? table.state
                            : ""
                    );


                card.innerHTML = `

                    <span class="admin-table-number">
                        Mesa ${table.id}
                    </span>

                    <span class="admin-table-state">
                        ${
                            stateLabels[
                                table.state
                            ]
                            || "Livre"
                        }
                    </span>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }



    /* =====================================================
       GRÁFICO
    ===================================================== */

    function renderChart() {

        const container =
            document.getElementById(
                "adminChartBars"
            );


        if (!container) {
            return;
        }


        const orders =
            readOrders();


        if (
            !orders.length
        ) {

            container.innerHTML = `

                <div class="admin-chart-empty">
                    Ainda não existem dados
                    suficientes para o gráfico.
                </div>

            `;

            return;

        }


        const hours = {

            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0

        };


        orders.forEach(
            function (order) {

                const date =
                    new Date(
                        order.createdAt
                    );


                const hour =
                    String(
                        date.getHours()
                    );


                if (
                    Object.prototype.hasOwnProperty.call(
                        hours,
                        hour
                    )
                ) {

                    hours[hour] +=
                        calculateOrderTotal(
                            order.items
                        );

                }

            }
        );


        const values =
            Object.values(
                hours
            );


        const max =
            Math.max(
                ...values,
                1
            );


        container.innerHTML = "";


        Object.entries(
            hours
        ).forEach(
            function (
                [
                    hour,
                    value
                ],
                index
            ) {

                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.style.position =
                    "relative";


                wrapper.style.height =
                    "100%";


                wrapper.style.display =
                    "flex";


                wrapper.style.alignItems =
                    "flex-end";


                const bar =
                    document.createElement(
                        "div"
                    );


                bar.className =
                    "admin-chart-bar";


                bar.style.setProperty(
                    "--bar-height",
                    `${Math.max(
                        (value / max) * 90,
                        value > 0
                            ? 7
                            : 3
                    )}%`
                );


                bar.style.animationDelay =
                    `${index * 35}ms`;


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "admin-chart-label";


                label.textContent =
                    `${hour}h`;


                wrapper.appendChild(
                    bar
                );


                wrapper.appendChild(
                    label
                );


                container.appendChild(
                    wrapper
                );

            }
        );

    }



    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton?.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Deseja terminar a sessão administrativa?"
                );


            if (!confirmed) {
                return;
            }


            sessionStorage.removeItem(
                STORAGE_KEYS.adminSession
            );


            window.location.href =
                "login.html";

        }
    );



    /* =====================================================
       ATUALIZAÇÃO
    ===================================================== */

    function updateLastUpdate() {

        const element =
            document.getElementById(
                "adminLastUpdate"
            );


        if (!element) {
            return;
        }


        element.textContent =
            new Intl.DateTimeFormat(
                "pt-AO",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            ).format(
                new Date()
            );

    }



    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function initialize() {

        /*
         * Por enquanto não bloqueamos
         * o dashboard durante o desenvolvimento.
         *
         * A autenticação Admin será adicionada
         * como camada própria na próxima etapa.
         */


        syncCurrentOrder();

        renderStatistics();

        renderRecentOrders();

        renderTables();

        renderChart();

        updateLastUpdate();

    }



    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );



    /* =====================================================
       ATUALIZAÇÃO ENTRE ABAS
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                STORAGE_KEYS.order
                ||
                event.key ===
                STORAGE_KEYS.orders
                ||
                event.key ===
                STORAGE_KEYS.tables
            ) {

                renderStatistics();

                renderRecentOrders();

                renderTables();

                renderChart();

                updateLastUpdate();

            }

        }
    );



    /* =====================================================
       API ADMIN
    ===================================================== */

    window.AVRAdmin = {

        openMenu,

        closeMenu,

        toggleMenu,

        readOrders,

        readCurrentOrder,

        readTables,

        renderStatistics,

        renderRecentOrders,

        renderTables,

        renderChart

    };


})();