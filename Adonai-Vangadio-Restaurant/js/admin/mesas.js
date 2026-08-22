/* =========================================================
   AVR ADMIN — MESAS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const menuButton = document.getElementById("adminMenuButton");
    const closeMenuButton = document.getElementById("adminCloseMenu");
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminMenuOverlay");
    const bottomMore = document.getElementById("adminBottomMore");

    const themeButton = document.getElementById("adminThemeButton");
    const themeMenu = document.getElementById("adminThemeMenu");
    const themeMenuButton = document.getElementById("adminThemeMenuButton");
    const themeOptions = document.querySelectorAll(".admin-theme-option");
    const themeLabel = document.getElementById("adminThemeLabel");

    const tablesGrid = document.getElementById("tablesGrid");
    const refreshButton = document.getElementById("tablesRefreshButton");

    const currentDate = document.getElementById("tablesCurrentDate");
    const lastUpdate = document.getElementById("adminLastUpdate");

    const occupiedElement = document.getElementById("tablesOccupied");
    const freeElement = document.getElementById("tablesFree");
    const reservedElement = document.getElementById("tablesReserved");
    const serviceElement = document.getElementById("tablesService");

    const occupationText = document.getElementById("tablesOccupationText");
    const occupationPercent = document.getElementById("tablesOccupationPercent");
    const occupationBar = document.getElementById("tablesOccupationBar");

    const capacityElement = document.getElementById("tablesCapacity");
    const peopleElement = document.getElementById("tablesPeople");
    const activeOrdersElement = document.getElementById("tablesActiveOrders");

    const detailPanel = document.getElementById("tableDetailPanel");

    const summaryTitle = document.getElementById("tablesSummaryTitle");
    const summaryText = document.getElementById("tablesSummaryText");

    const filterButtons = document.querySelectorAll("[data-table-filter]");

    const filterAllCount = document.getElementById("filterAllCount");
    const filterFreeCount = document.getElementById("filterFreeCount");
    const filterOccupiedCount = document.getElementById("filterOccupiedCount");
    const filterReservedCount = document.getElementById("filterReservedCount");
    const filterServiceCount = document.getElementById("filterServiceCount");

    const sidebarOrderCount = document.getElementById("sidebarOrderCount");
    const bottomOrderCount = document.getElementById("bottomOrderCount");


    /* =====================================================
       DADOS DAS MESAS
    ===================================================== */

    const defaultTables = [
        { id: 1, seats: 2, status: "free", people: 0, orders: 0 },
        { id: 2, seats: 2, status: "free", people: 0, orders: 0 },
        { id: 3, seats: 4, status: "free", people: 0, orders: 0 },
        { id: 4, seats: 4, status: "free", people: 0, orders: 0 },

        { id: 5, seats: 4, status: "free", people: 0, orders: 0 },
        { id: 6, seats: 6, status: "free", people: 0, orders: 0 },
        { id: 7, seats: 6, status: "free", people: 0, orders: 0 },
        { id: 8, seats: 4, status: "free", people: 0, orders: 0 },

        { id: 9, seats: 4, status: "free", people: 0, orders: 0 },
        { id: 10, seats: 6, status: "free", people: 0, orders: 0 },
        { id: 11, seats: 2, status: "free", people: 0, orders: 0 },
        { id: 12, seats: 2, status: "free", people: 0, orders: 0 }
    ];


    let tables = loadTables();
    let activeFilter = "all";
    let selectedTableId = null;


    /* =====================================================
       STORAGE
    ===================================================== */

    function loadTables() {

        try {

            const saved = localStorage.getItem("avr_admin_tables");

            if (!saved) {
                return defaultTables.map(table => ({ ...table }));
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed) || parsed.length !== 12) {
                return defaultTables.map(table => ({ ...table }));
            }

            return parsed;

        } catch (error) {

            return defaultTables.map(table => ({ ...table }));

        }

    }


    function saveTables() {

        localStorage.setItem(
            "avr_admin_tables",
            JSON.stringify(tables)
        );

    }


    /* =====================================================
       DATA / DATA ATUAL
    ===================================================== */

    function updateDate() {

        const now = new Date();

        const formatted = new Intl.DateTimeFormat(
            "pt-AO",
            {
                weekday: "long",
                day: "2-digit",
                month: "long"
            }
        ).format(now);

        const cleanDate =
            formatted.charAt(0).toUpperCase() +
            formatted.slice(1);

        if (currentDate) {
            currentDate.textContent = cleanDate;
        }

    }


    function updateLastUpdate() {

        if (!lastUpdate) return;

        lastUpdate.textContent =
            new Intl.DateTimeFormat(
                "pt-AO",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ).format(new Date());

    }


    /* =====================================================
       ESTATÍSTICAS
    ===================================================== */

    function getStats() {

        const occupied =
            tables.filter(table => table.status === "occupied").length;

        const free =
            tables.filter(table => table.status === "free").length;

        const reserved =
            tables.filter(table => table.status === "reserved").length;

        const service =
            tables.filter(table => table.status === "service").length;

        const people =
            tables.reduce(
                (total, table) => total + Number(table.people || 0),
                0
            );

        const activeOrders =
            tables.reduce(
                (total, table) => total + Number(table.orders || 0),
                0
            );

        const capacity =
            tables.reduce(
                (total, table) => total + Number(table.seats || 0),
                0
            );

        const occupationPercent =
            capacity > 0
                ? Math.round((people / capacity) * 100)
                : 0;

        return {
            occupied,
            free,
            reserved,
            service,
            people,
            activeOrders,
            capacity,
            occupationPercent
        };

    }


    function updateStats() {

        const stats = getStats();

        if (occupiedElement) {
            occupiedElement.textContent =
                `${stats.occupied}/${tables.length}`;
        }

        if (freeElement) {
            freeElement.textContent = stats.free;
        }

        if (reservedElement) {
            reservedElement.textContent = stats.reserved;
        }

        if (serviceElement) {
            serviceElement.textContent = stats.service;
        }

        if (occupationText) {

            occupationText.textContent =
                stats.occupied === 1
                    ? "mesa ocupada"
                    : "mesas ocupadas";

        }

        if (occupationPercent) {
            occupationPercent.textContent =
                `${stats.occupationPercent}%`;
        }

        if (occupationBar) {
            occupationBar.style.width =
                `${Math.min(stats.occupationPercent, 100)}%`;
        }

        if (capacityElement) {
            capacityElement.textContent = stats.capacity;
        }

        if (peopleElement) {
            peopleElement.textContent = stats.people;
        }

        if (activeOrdersElement) {
            activeOrdersElement.textContent =
                stats.activeOrders;
        }

        if (filterAllCount) {
            filterAllCount.textContent = tables.length;
        }

        if (filterFreeCount) {
            filterFreeCount.textContent = stats.free;
        }

        if (filterOccupiedCount) {
            filterOccupiedCount.textContent = stats.occupied;
        }

        if (filterReservedCount) {
            filterReservedCount.textContent = stats.reserved;
        }

        if (filterServiceCount) {
            filterServiceCount.textContent = stats.service;
        }


        if (summaryTitle && summaryText) {

            if (stats.occupied === 0 && stats.reserved === 0) {

                summaryTitle.textContent =
                    "Salão pronto para receber clientes";

                summaryText.textContent =
                    "Todas as mesas estão disponíveis para novos atendimentos.";

            } else if (stats.free === 0) {

                summaryTitle.textContent =
                    "Salão completamente ocupado";

                summaryText.textContent =
                    "Todas as mesas estão ocupadas ou reservadas neste momento.";

            } else {

                summaryTitle.textContent =
                    `${stats.free} mesas disponíveis`;

                summaryText.textContent =
                    "O salão apresenta movimento e ainda possui capacidade para novos clientes.";

            }

        }

    }


    /* =====================================================
       MESAS
    ===================================================== */

    function getFilteredTables() {

        if (activeFilter === "all") {
            return tables;
        }

        return tables.filter(
            table => table.status === activeFilter
        );

    }


    function getStatusLabel(status) {

        const labels = {
            free: "Livre",
            occupied: "Ocupada",
            reserved: "Reservada",
            service: "Atendimento"
        };

        return labels[status] || "Livre";

    }


    function renderTables() {

        if (!tablesGrid) return;

        const visibleTables = getFilteredTables();

        tablesGrid.innerHTML = "";

        if (visibleTables.length === 0) {

            tablesGrid.innerHTML = `
                <div class="tables-empty-filter">
                    Nenhuma mesa encontrada neste filtro.
                </div>
            `;

            return;
        }


        visibleTables.forEach(table => {

            const button = document.createElement("button");

            button.type = "button";

            button.className =
                `table-card ${table.status}` +
                (selectedTableId === table.id ? " selected" : "");

            button.dataset.tableId = table.id;

            button.innerHTML = `
                <div class="table-card-top">

                    <span class="table-number">
                        Mesa ${table.id}
                    </span>

                    <span class="table-status-dot"></span>

                </div>

                <span class="table-card-status">

                    <span>
                        ${getStatusLabel(table.status)}
                    </span>

                </span>

                <span class="table-card-capacity">
                    ${table.people || 0}/${table.seats} lugares
                </span>
            `;

            button.addEventListener(
                "click",
                () => selectTable(table.id)
            );

            tablesGrid.appendChild(button);

        });

    }


    /* =====================================================
       DETALHE DA MESA
    ===================================================== */

    function selectTable(id) {

        selectedTableId = id;

        const table =
            tables.find(item => item.id === id);

        if (!table || !detailPanel) return;

        detailPanel.innerHTML = `
            <div class="tables-detail-content">

                <div class="tables-detail-main">

                    <span class="tables-detail-icon">
                        ▣
                    </span>

                    <div>

                        <span class="admin-eyebrow">
                            MESA ${table.id}
                        </span>

                        <h2>
                            Mesa ${table.id}
                        </h2>

                        <p>
                            ${table.people || 0} de ${table.seats}
                            lugares ocupados.
                        </p>

                    </div>

                </div>


                <div class="tables-detail-actions">

                    <div class="tables-detail-status">
                        <span>
                            Estado
                        </span>

                        <strong>
                            ${getStatusLabel(table.status)}
                        </strong>
                    </div>


                    <div class="tables-status-actions">

                        <button
                            type="button"
                            class="table-status-action"
                            data-status="free"
                        >
                            Livre
                        </button>

                        <button
                            type="button"
                            class="table-status-action"
                            data-status="occupied"
                        >
                            Ocupada
                        </button>

                        <button
                            type="button"
                            class="table-status-action"
                            data-status="reserved"
                        >
                            Reservada
                        </button>

                        <button
                            type="button"
                            class="table-status-action"
                            data-status="service"
                        >
                            Atendimento
                        </button>

                    </div>

                </div>

            </div>
        `;


        detailPanel
            .querySelectorAll("[data-status]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateTableStatus(
                            table.id,
                            button.dataset.status
                        );

                    }
                );

            });


        renderTables();

    }


    /* =====================================================
       ALTERAR ESTADO
    ===================================================== */

    function updateTableStatus(id, status) {

        const table =
            tables.find(item => item.id === id);

        if (!table) return;

        table.status = status;

        if (status === "free") {

            table.people = 0;
            table.orders = 0;

        }

        if (status === "reserved") {

            table.people = 0;
            table.orders = 0;

        }

        if (status === "occupied" && table.people === 0) {

            table.people =
                Math.min(2, table.seats);

            table.orders = 1;

        }

        if (status === "service" && table.people === 0) {

            table.people =
                Math.min(2, table.seats);

            table.orders = 1;

        }

        saveTables();

        updateStats();

        renderTables();

        selectTable(id);

        updateLastUpdate();

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                activeFilter =
                    button.dataset.tableFilter;

                filterButtons.forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                renderTables();

            }
        );

    });


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                updateDate();

                updateStats();

                renderTables();

                updateLastUpdate();

            }
        );

    }


    /* =====================================================
       MENU LATERAL
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (overlay) {
            overlay.classList.add("active");
        }

        sidebar.setAttribute(
            "aria-hidden",
            "false"
        );

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        document.body.classList.add(
            "admin-menu-open"
        );

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("active");
        }

        sidebar.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        document.body.classList.remove(
            "admin-menu-open"
        );

    }


    if (menuButton) {
        menuButton.addEventListener(
            "click",
            openSidebar
        );
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener(
            "click",
            closeSidebar
        );
    }

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeSidebar
        );
    }

    if (bottomMore) {
        bottomMore.addEventListener(
            "click",
            openSidebar
        );
    }


    /* =====================================================
       MENU DE APARÊNCIA
    ===================================================== */

    function openThemeMenu() {

        if (!themeMenu) return;

        themeMenu.classList.add("open");

        themeMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        if (themeButton) {

            themeButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeThemeMenu() {

        if (!themeMenu) return;

        themeMenu.classList.remove("open");

        themeMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        if (themeButton) {

            themeButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                if (
                    themeMenu &&
                    themeMenu.classList.contains("open")
                ) {

                    closeThemeMenu();

                } else {

                    openThemeMenu();

                }

            }
        );

    }


    /* =====================================================
       TEMA
    ===================================================== */

    function applyTheme(theme) {

        const root =
            document.documentElement;

        if (theme === "dark") {

            root.setAttribute(
                "data-theme",
                "dark"
            );

        } else if (theme === "light") {

            root.setAttribute(
                "data-theme",
                "light"
            );

        } else {

            root.setAttribute(
                "data-theme",
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches
                    ? "dark"
                    : "light"
            );

        }

        localStorage.setItem(
            "avr-theme",
            theme
        );

        updateThemeLabel(theme);

        updateThemeChecks(theme);

    }


    function updateThemeLabel(theme) {

        if (!themeLabel) return;

        const labels = {
            auto: "Automático",
            light: "Claro",
            dark: "Escuro"
        };

        themeLabel.textContent =
            labels[theme] || "Automático";

    }


    function updateThemeChecks(theme) {

        themeOptions.forEach(option => {

            const active =
                option.dataset.themeOption === theme;

            option.classList.toggle(
                "active",
                active
            );

        });

    }


    function getSavedTheme() {

        return (
            localStorage.getItem("avr-theme") ||
            "auto"
        );

    }


    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const theme =
                    option.dataset.themeOption;

                applyTheme(theme);

                closeThemeMenu();

            }
        );

    });


    if (themeMenuButton) {

        themeMenuButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const current =
                    getSavedTheme();

                const next =
                    current === "auto"
                        ? "light"
                        : current === "light"
                            ? "dark"
                            : "auto";

                applyTheme(next);

            }
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (
                themeMenu &&
                !themeMenu.contains(event.target) &&
                themeButton &&
                !themeButton.contains(event.target)
            ) {

                closeThemeMenu();

            }

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById("adminLogoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Deseja terminar a sessão?"
                    );

                if (!confirmed) return;

                localStorage.removeItem(
                    "avr_admin_session"
                );

                window.location.href =
                    "../../index.html";

            }
        );

    }


    /* =====================================================
       PEDIDOS — CONTADOR
    ===================================================== */

    function updateOrderCount() {

        const count =
            Number(
                localStorage.getItem(
                    "avr_pending_orders"
                ) || 0
            );

        if (sidebarOrderCount) {
            sidebarOrderCount.textContent = count;
        }

        if (bottomOrderCount) {
            bottomOrderCount.textContent = count;
        }

    }


    /* =====================================================
       EVENTOS DO TEMA DO SISTEMA
    ===================================================== */

    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

    mediaQuery.addEventListener(
        "change",
        () => {

            if (getSavedTheme() === "auto") {
                applyTheme("auto");
            }

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateDate();

    updateLastUpdate();

    updateStats();

    renderTables();

    updateOrderCount();

    applyTheme(
        getSavedTheme()
    );

});

/* =====================================================
   AVR ADMIN — AJUSTE FINAL MESAS
   BOTÃO ATUALIZAR
===================================================== */

(function () {

    "use strict";


    function iniciarAtualizacaoMesas() {

        const button =
            document.getElementById("tablesRefreshButton");

        if (!button) {
            return;
        }


        /*
         * Evita registrar o evento duas vezes.
         */

        if (button.dataset.refreshBound === "true") {
            return;
        }

        button.dataset.refreshBound = "true";


        button.addEventListener("click", function () {

            if (
                button.classList.contains("is-loading")
            ) {
                return;
            }


            button.classList.add("is-loading");


            const icon =
                button.querySelector("span");


            /*
             * Atualiza imediatamente a indicação
             * visual do botão.
             */

            if (icon) {
                icon.textContent = "↻";
            }


            /*
             * Tenta utilizar as funções existentes
             * no mesas.js principal.
             */

            let updateFunction = null;


            if (
                typeof window.renderTables === "function"
            ) {

                updateFunction =
                    window.renderTables;

            } else if (
                typeof window.renderMesas === "function"
            ) {

                updateFunction =
                    window.renderMesas;

            } else if (
                typeof window.loadMesas === "function"
            ) {

                updateFunction =
                    window.loadMesas;

            } else if (
                typeof window.carregarMesas === "function"
            ) {

                updateFunction =
                    window.carregarMesas;

            } else if (
                typeof window.updateMesas === "function"
            ) {

                updateFunction =
                    window.updateMesas;

            }


            /*
             * Se existir uma função de atualização,
             * utiliza a função original.
             */

            if (updateFunction) {

                try {

                    const result =
                        updateFunction();


                    /*
                     * Caso a função seja assíncrona,
                     * aguardamos a Promise.
                     */

                    if (
                        result &&
                        typeof result.then === "function"
                    ) {

                        result
                            .catch(function (error) {

                                console.error(
                                    "Erro ao atualizar mesas:",
                                    error
                                );

                            })
                            .finally(function () {

                                finalizarAtualizacao(
                                    button,
                                    icon
                                );

                            });

                    } else {

                        finalizarAtualizacao(
                            button,
                            icon
                        );

                    }

                } catch (error) {

                    console.error(
                        "Erro ao atualizar mesas:",
                        error
                    );

                    finalizarAtualizacao(
                        button,
                        icon
                    );

                }

                return;
            }


            /*
             * Se o mesas.js não expuser nenhuma função,
             * simplesmente recarrega a página.
             *
             * Assim o botão nunca fica sem ação.
             */

            setTimeout(function () {

                window.location.reload();

            }, 350);

        });

    }


    function finalizarAtualizacao(
        button,
        icon
    ) {

        setTimeout(function () {

            button.classList.remove(
                "is-loading"
            );


            if (icon) {
                icon.textContent = "↻";
            }

        }, 450);

    }


    /*
     * Inicialização segura.
     */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarAtualizacaoMesas
        );

    } else {

        iniciarAtualizacaoMesas();

    }

})();