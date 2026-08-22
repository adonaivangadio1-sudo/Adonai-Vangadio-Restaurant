/* =========================================================
   AVR ADMIN — COZINHA
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const refreshButton =
        document.getElementById("kitchenRefreshButton");

    const statusElement =
        document.getElementById("kitchenStatus");

    const totalOrdersElement =
        document.getElementById("kitchenTotalOrders");

    const preparingElement =
        document.getElementById("kitchenPreparing");

    const readyElement =
        document.getElementById("kitchenReady");

    const averageTimeElement =
        document.getElementById("kitchenAverageTime");

    const ordersGrid =
        document.getElementById("kitchenOrdersGrid");

    const emptyState =
        document.getElementById("kitchenEmptyState");

    const priorityList =
        document.getElementById("kitchenPriorityList");

    const completionPercent =
        document.getElementById("kitchenCompletionPercent");

    const completionBar =
        document.getElementById("kitchenCompletionBar");

    const completedElement =
        document.getElementById("kitchenCompleted");

    const delayedElement =
        document.getElementById("kitchenDelayed");

    const performanceTimeElement =
        document.getElementById("kitchenPerformanceTime");

    const detailPanel =
        document.getElementById("kitchenDetailPanel");

    const summaryTitle =
        document.getElementById("kitchenSummaryTitle");

    const summaryText =
        document.getElementById("kitchenSummaryText");

    const lastUpdate =
        document.getElementById("adminLastUpdate");

    const bottomOrderCount =
        document.getElementById("bottomOrderCount");


    /* =====================================================
       DADOS INICIAIS
       Estrutura preparada para integração posterior
       com pedidos reais.
    ===================================================== */

    let kitchenOrders = [];

    let currentFilter = "all";

    let selectedOrderId = null;


    /* =====================================================
       FORMATAÇÃO
    ===================================================== */

    function formatCurrency(value) {

        return new Intl.NumberFormat("pt-AO", {
            maximumFractionDigits: 0
        }).format(value) + " Kz";

    }


    function formatTime(minutes) {

        if (minutes <= 0) {
            return "0 min";
        }

        return `${minutes} min`;

    }


    /* =====================================================
       DATA / HORA
    ===================================================== */

    function updateDate() {

        const now = new Date();

        const dateText = now.toLocaleDateString(
            "pt-AO",
            {
                weekday: "long",
                day: "2-digit",
                month: "long"
            }
        );

        const formattedDate =
            dateText.charAt(0).toUpperCase() +
            dateText.slice(1);

        const dateElement =
            document.getElementById("kitchenCurrentDate");

        if (dateElement) {
            dateElement.textContent = formattedDate;
        }

    }


    /* =====================================================
       CARREGAR DADOS
    ===================================================== */

    function loadKitchenData() {

        /*
         * Nesta fase a página começa vazia.
         * Quando o sistema de pedidos estiver ligado,
         * este ponto poderá receber os dados reais.
         */

        kitchenOrders = [];

        renderKitchen();

    }


    /* =====================================================
       FILTRO
    ===================================================== */

    function getFilteredOrders() {

        if (currentFilter === "all") {
            return kitchenOrders;
        }

        return kitchenOrders.filter(
            order => order.status === currentFilter
        );

    }


    /* =====================================================
       RENDER DOS PEDIDOS
    ===================================================== */

    function renderOrders() {

        if (!ordersGrid) {
            return;
        }

        const filteredOrders =
            getFilteredOrders();

        ordersGrid.innerHTML = "";

        if (!filteredOrders.length) {

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;

        }

        if (emptyState) {
            emptyState.hidden = true;
        }


        filteredOrders.forEach(order => {

            const card =
                document.createElement("article");

            card.className =
                "kitchen-order-card";

            if (order.id === selectedOrderId) {
                card.classList.add("selected");
            }


            const stateLabel =
                getStatusLabel(order.status);


            card.innerHTML = `

                <div class="kitchen-order-top">

                    <div class="kitchen-order-number">

                        <span>
                            Pedido
                        </span>

                        <strong>
                            #${escapeHtml(order.number)}
                        </strong>

                    </div>

                    <span class="kitchen-order-state">
                        ${stateLabel}
                    </span>

                </div>


                <div class="kitchen-order-meta">

                    <span>
                        Mesa ${escapeHtml(order.table)}
                    </span>

                    <span>
                        ${escapeHtml(order.time)}
                    </span>

                </div>


                <div class="kitchen-order-items">

                    ${order.items.map(item => `

                        <div class="kitchen-order-item">

                            <strong>
                                ${escapeHtml(item.quantity)}×
                                ${escapeHtml(item.name)}
                            </strong>

                            <span>
                                ${formatCurrency(item.price)}
                            </span>

                        </div>

                    `).join("")}

                </div>


                <div class="kitchen-order-footer">

                    <span class="kitchen-order-time">
                        ${escapeHtml(order.elapsed)}
                    </span>

                    <button
                        type="button"
                        class="kitchen-order-action"
                        data-order-action="${escapeHtml(order.id)}"
                    >
                        ${getActionLabel(order.status)}
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".kitchen-order-action"
                        )
                    ) {
                        return;
                    }

                    selectOrder(order.id);

                }
            );


            const actionButton =
                card.querySelector(
                    ".kitchen-order-action"
                );


            if (actionButton) {

                actionButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        advanceOrder(
                            order.id
                        );

                    }
                );

            }


            ordersGrid.appendChild(card);

        });

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       ESTADOS
    ===================================================== */

    function getStatusLabel(status) {

        const labels = {

            pending: "A preparar",

            preparing: "Em produção",

            ready: "Pronto",

            completed: "Concluído"

        };

        return labels[status] || "Pendente";

    }


    function getActionLabel(status) {

        const labels = {

            pending: "Preparar",

            preparing: "Marcar pronto",

            ready: "Entregar",

            completed: "Concluído"

        };

        return labels[status] || "Preparar";

    }


    /* =====================================================
       AVANÇAR PEDIDO
    ===================================================== */

    function advanceOrder(orderId) {

        const order =
            kitchenOrders.find(
                item => item.id === orderId
            );

        if (!order) {
            return;
        }


        const nextStatus = {

            pending: "preparing",

            preparing: "ready",

            ready: "completed",

            completed: "completed"

        };


        order.status =
            nextStatus[order.status] ||
            "preparing";


        renderKitchen();

        selectOrder(order.id);

    }


    /* =====================================================
       SELECIONAR PEDIDO
    ===================================================== */

    function selectOrder(orderId) {

        selectedOrderId = orderId;

        const order =
            kitchenOrders.find(
                item => item.id === orderId
            );

        if (!order || !detailPanel) {
            renderOrders();
            return;
        }


        detailPanel.innerHTML = `

            <div class="kitchen-detail-content">

                <span class="admin-eyebrow">
                    DETALHES DO PEDIDO
                </span>

                <h2>
                    Pedido #${escapeHtml(order.number)}
                </h2>

                <p>
                    Mesa ${escapeHtml(order.table)}
                    · ${escapeHtml(order.time)}
                </p>

            </div>

        `;


        renderOrders();

    }


    /* =====================================================
       PRIORIDADE
    ===================================================== */

    function renderPriority() {

        if (!priorityList) {
            return;
        }

        priorityList.innerHTML = "";


        const priorityOrders =
            kitchenOrders
                .filter(
                    order =>
                        order.status !== "completed"
                )
                .slice(0, 4);


        if (!priorityOrders.length) {

            priorityList.innerHTML = `

                <div class="kitchen-priority-item">

                    <div class="kitchen-priority-main">

                        <span class="kitchen-priority-number">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Nenhum pedido pendente
                            </strong>

                            <small>
                                A cozinha está em dia.
                            </small>

                        </div>

                    </div>

                </div>

            `;

            return;

        }


        priorityOrders.forEach(
            (order, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "kitchen-priority-item";

                item.innerHTML = `

                    <div class="kitchen-priority-main">

                        <span class="kitchen-priority-number">
                            ${index + 1}
                        </span>

                        <div>

                            <strong>
                                Pedido #${escapeHtml(order.number)}
                            </strong>

                            <small>
                                Mesa ${escapeHtml(order.table)}
                            </small>

                        </div>

                    </div>

                    <span class="kitchen-priority-time">
                        ${escapeHtml(order.elapsed)}
                    </span>

                `;

                priorityList.appendChild(item);

            }
        );

    }


    /* =====================================================
       INDICADORES
    ===================================================== */

    function updateIndicators() {

        const total =
            kitchenOrders.length;

        const preparing =
            kitchenOrders.filter(
                order =>
                    order.status === "preparing" ||
                    order.status === "pending"
            ).length;

        const ready =
            kitchenOrders.filter(
                order =>
                    order.status === "ready"
            ).length;

        const completed =
            kitchenOrders.filter(
                order =>
                    order.status === "completed"
            ).length;


        const delayed =
            kitchenOrders.filter(
                order =>
                    order.delayed === true
            ).length;


        const percentage =
            total > 0
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;


        const average =
            kitchenOrders.length
                ? Math.round(
                    kitchenOrders.reduce(
                        (sum, order) =>
                            sum + (
                                Number(order.minutes) || 0
                            ),
                        0
                    ) / kitchenOrders.length
                )
                : 0;


        if (totalOrdersElement) {
            totalOrdersElement.textContent =
                total;
        }

        if (preparingElement) {
            preparingElement.textContent =
                preparing;
        }

        if (readyElement) {
            readyElement.textContent =
                ready;
        }

        if (averageTimeElement) {
            averageTimeElement.textContent =
                formatTime(average);
        }

        if (completedElement) {
            completedElement.textContent =
                completed;
        }

        if (delayedElement) {
            delayedElement.textContent =
                delayed;
        }

        if (performanceTimeElement) {
            performanceTimeElement.textContent =
                formatTime(average);
        }

        if (completionPercent) {
            completionPercent.textContent =
                `${percentage}%`;
        }

        if (completionBar) {
            completionBar.style.width =
                `${percentage}%`;
        }

        if (bottomOrderCount) {
            bottomOrderCount.textContent =
                total;
        }


        if (statusElement) {

            statusElement.textContent =
                total > 0
                    ? "Cozinha em operação"
                    : "Cozinha ativa";

        }


        updateSummary(
            total,
            preparing,
            ready
        );

    }


    /* =====================================================
       RESUMO
    ===================================================== */

    function updateSummary(
        total,
        preparing,
        ready
    ) {

        if (!summaryTitle || !summaryText) {
            return;
        }


        if (total === 0) {

            summaryTitle.textContent =
                "Cozinha pronta para trabalhar";

            summaryText.textContent =
                "Não existem pedidos pendentes neste momento.";

            return;

        }


        if (preparing > 0) {

            summaryTitle.textContent =
                `${preparing} pedido(s) em preparação`;

            summaryText.textContent =
                "Acompanhe a fila de produção e avance os pedidos conforme ficam prontos.";

            return;

        }


        if (ready > 0) {

            summaryTitle.textContent =
                `${ready} pedido(s) pronto(s)`;

            summaryText.textContent =
                "Existem pedidos aguardando a entrega ao cliente.";

        }

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function setupFilters() {

        const buttons =
            document.querySelectorAll(
                ".kitchen-filter-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.kitchenFilter ||
                        "all";


                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    renderOrders();

                }
            );

        });

    }


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    function refreshKitchen() {

        if (refreshButton) {

            refreshButton.disabled = true;

            const original =
                refreshButton.innerHTML;


            refreshButton.innerHTML = `
                <span>↻</span>
                A atualizar...
            `;


            setTimeout(() => {

                loadKitchenData();

                refreshButton.disabled = false;

                refreshButton.innerHTML =
                    original;

                updateLastUpdate();

            }, 450);

        } else {

            loadKitchenData();

        }

    }


    /* =====================================================
       ÚLTIMA ATUALIZAÇÃO
    ===================================================== */

    function updateLastUpdate() {

        if (!lastUpdate) {
            return;
        }

        const now = new Date();

        lastUpdate.textContent =
            now.toLocaleTimeString(
                "pt-AO",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }


    /* =====================================================
       BOTÃO ATUALIZAR
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshKitchen
        );

    }


    /* =====================================================
       RENDER GERAL
    ===================================================== */

    function renderKitchen() {

        updateIndicators();

        renderOrders();

        renderPriority();

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateDate();

    updateLastUpdate();

    setupFilters();

    loadKitchenData();


});

/* =========================================================
   COZINHA — MENU DE APARÊNCIA
   ========================================================= */

(function () {

    "use strict";

    const themeButton = document.getElementById("adminThemeButton");
    const themeMenu = document.getElementById("adminThemeMenu");
    const themeOptions = document.querySelectorAll(
        ".admin-theme-option[data-theme-option]"
    );

    const sideThemeButton =
        document.getElementById("adminThemeMenuButton");

    const themeLabel =
        document.getElementById("adminThemeLabel");


    if (!themeButton || !themeMenu) {
        return;
    }


    /* =====================================================
       ABRIR / FECHAR MENU
       ===================================================== */

    function openThemeMenu() {

        themeMenu.classList.add("is-open");
        themeMenu.setAttribute("aria-hidden", "false");

        themeButton.setAttribute("aria-expanded", "true");

    }


    function closeThemeMenu() {

        themeMenu.classList.remove("is-open");
        themeMenu.setAttribute("aria-hidden", "true");

        themeButton.setAttribute("aria-expanded", "false");

    }


    function toggleThemeMenu() {

        const isOpen =
            themeMenu.classList.contains("is-open");

        if (isOpen) {
            closeThemeMenu();
        } else {
            openThemeMenu();
        }

    }


    themeButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        toggleThemeMenu();

    });


    /* =====================================================
       APLICAR TEMA
       ===================================================== */

    function applyTheme(theme) {

        /*
         * Compatibilidade com o tema global:
         * guardamos a preferência e aplicamos os atributos/classes
         * que o restante do sistema pode utilizar.
         */

        localStorage.setItem("avr-theme", theme);
        localStorage.setItem("theme", theme);

        if (theme === "dark") {

            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute(
                "data-theme",
                "dark"
            );

        } else if (theme === "light") {

            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute(
                "data-theme",
                "light"
            );

        } else {

            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute(
                "data-theme",
                "auto"
            );

        }


        /* Atualiza o estado visual das opções */

        themeOptions.forEach(function (option) {

            const optionTheme =
                option.getAttribute("data-theme-option");

            const active =
                optionTheme === theme;

            option.classList.toggle("is-active", active);
            option.classList.toggle("active", active);

            option.setAttribute(
                "aria-checked",
                active ? "true" : "false"
            );

        });


        /* Atualiza o texto no menu lateral */

        if (themeLabel) {

            const labels = {
                auto: "Automático",
                light: "Claro",
                dark: "Escuro"
            };

            themeLabel.textContent =
                labels[theme] || "Automático";

        }

    }


    /* =====================================================
       CARREGAR PREFERÊNCIA
       ===================================================== */

    function getSavedTheme() {

        return (
            localStorage.getItem("avr-theme") ||
            localStorage.getItem("theme") ||
            "auto"
        );

    }


    /* =====================================================
       CLIQUE NAS OPÇÕES
       ===================================================== */

    themeOptions.forEach(function (option) {

        option.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const selectedTheme =
                option.getAttribute("data-theme-option");

            if (
                selectedTheme !== "auto" &&
                selectedTheme !== "light" &&
                selectedTheme !== "dark"
            ) {
                return;
            }

            applyTheme(selectedTheme);

            closeThemeMenu();

        });

    });


    /* =====================================================
       BOTÃO "APARÊNCIA" DO MENU LATERAL
       ===================================================== */

    if (sideThemeButton) {

        sideThemeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeThemeMenu();
                openThemeMenu();

            }
        );

    }


    /* =====================================================
       FECHAR AO CLICAR FORA
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (
            !themeMenu.contains(event.target) &&
            !themeButton.contains(event.target)
        ) {
            closeThemeMenu();
        }

    });


    /* =====================================================
       ESC FECHA O MENU
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeThemeMenu();
        }

    });


    /* =====================================================
       ESTADO INICIAL
       ===================================================== */

    applyTheme(getSavedTheme());


})();

/* =========================================================
   COZINHA — MENU LATERAL ADMIN
   ========================================================= */

(function () {

    "use strict";

    const menuButton = document.getElementById("adminMenuButton");
    const closeButton = document.getElementById("adminCloseMenu");
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminMenuOverlay");

    if (!menuButton || !sidebar) {
        return;
    }


    function openAdminMenu() {

        sidebar.classList.add("is-open");

        if (overlay) {
            overlay.classList.add("is-visible");
        }

        sidebar.setAttribute("aria-hidden", "false");
        menuButton.setAttribute("aria-expanded", "true");

        document.body.classList.add("admin-menu-open");
    }


    function closeAdminMenu() {

        sidebar.classList.remove("is-open");

        if (overlay) {
            overlay.classList.remove("is-visible");
        }

        sidebar.setAttribute("aria-hidden", "true");
        menuButton.setAttribute("aria-expanded", "false");

        document.body.classList.remove("admin-menu-open");
    }


    menuButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const opened =
            sidebar.classList.contains("is-open");

        if (opened) {
            closeAdminMenu();
        } else {
            openAdminMenu();
        }

    });


    if (closeButton) {

        closeButton.addEventListener("click", function (event) {

            event.preventDefault();

            closeAdminMenu();

        });

    }


    if (overlay) {

        overlay.addEventListener("click", function () {

            closeAdminMenu();

        });

    }


    /* Fechar ao pressionar ESC */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeAdminMenu();
        }

    });


    /* Fechar depois de clicar num link do menu */

    sidebar.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            closeAdminMenu();

        });

    });


})();

/* =========================================================
   AVR ADMIN — COZINHA
   MENU + APARÊNCIA + ATUALIZAÇÃO
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        initAdminMenu();
        initThemeMenu();
        initKitchenRefresh();
        initDate();

    });


    /* =====================================================
       MENU LATERAL
    ====================================================== */

    function initAdminMenu() {

        const menuButton = document.getElementById("adminMenuButton");
        const sidebar = document.getElementById("adminSidebar");
        const overlay = document.getElementById("adminMenuOverlay");
        const closeButton = document.getElementById("adminCloseMenu");
        const bottomMore = document.getElementById("adminBottomMore");

        if (!menuButton || !sidebar) {
            return;
        }


        function openMenu() {

            sidebar.classList.add("open");

            if (overlay) {
                overlay.classList.add("open");
            }

            menuButton.classList.add("active");

            menuButton.setAttribute("aria-expanded", "true");
            sidebar.setAttribute("aria-hidden", "false");

            document.body.classList.add("admin-menu-open");
        }


        function closeMenu() {

            sidebar.classList.remove("open");

            if (overlay) {
                overlay.classList.remove("open");
            }

            menuButton.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            sidebar.setAttribute("aria-hidden", "true");

            document.body.classList.remove("admin-menu-open");
        }


        function toggleMenu() {

            if (sidebar.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }

        }


        /* BOTÃO PRINCIPAL */

        menuButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleMenu();

        });


        /* BOTÃO FECHAR */

        if (closeButton) {

            closeButton.addEventListener("click", function (event) {

                event.preventDefault();

                closeMenu();

            });

        }


        /* OVERLAY */

        if (overlay) {

            overlay.addEventListener("click", function () {

                closeMenu();

            });

        }


        /* BOTÃO "MAIS" NO MOBILE */

        if (bottomMore) {

            bottomMore.addEventListener("click", function (event) {

                event.preventDefault();

                toggleMenu();

            });

        }


        /* ESC */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                closeMenu();

            }

        });


        /* FECHAR AO CLICAR NUM LINK DA SIDEBAR */

        const sidebarLinks = sidebar.querySelectorAll(
            "a.admin-side-link"
        );

        sidebarLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                closeMenu();

            });

        });

    }


    /* =====================================================
       APARÊNCIA / TEMA
    ====================================================== */

    function initThemeMenu() {

        const themeButton = document.getElementById("adminThemeButton");
        const themeMenu = document.getElementById("adminThemeMenu");
        const sideThemeButton = document.getElementById("adminThemeMenuButton");
        const themeLabel = document.getElementById("adminThemeLabel");

        if (!themeButton || !themeMenu) {
            return;
        }


        const themeOptions = themeMenu.querySelectorAll(
            ".admin-theme-option"
        );


        /* -----------------------------------------------
           ABRIR / FECHAR MENU DE TEMA
        ------------------------------------------------ */

        function openThemeMenu() {

            themeMenu.classList.add("open");

            themeMenu.setAttribute("aria-hidden", "false");

            themeButton.setAttribute("aria-expanded", "true");

        }


        function closeThemeMenu() {

            themeMenu.classList.remove("open");

            themeMenu.setAttribute("aria-hidden", "true");

            themeButton.setAttribute("aria-expanded", "false");

        }


        function toggleThemeMenu() {

            if (themeMenu.classList.contains("open")) {

                closeThemeMenu();

            } else {

                openThemeMenu();

            }

        }


        /* BOTÃO DO TEMA */

        themeButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleThemeMenu();

        });


        /* BOTÃO APARÊNCIA DA SIDEBAR */

        if (sideThemeButton) {

            sideThemeButton.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                openThemeMenu();

            });

        }


        /* -----------------------------------------------
           APLICAR TEMA
        ------------------------------------------------ */

        function applyTheme(theme) {

            if (theme === "light") {

                document.documentElement.setAttribute(
                    "data-theme",
                    "light"
                );

                localStorage.setItem(
                    "avr-theme",
                    "light"
                );

            }


            else if (theme === "dark") {

                document.documentElement.setAttribute(
                    "data-theme",
                    "dark"
                );

                localStorage.setItem(
                    "avr-theme",
                    "dark"
                );

            }


            else {

                document.documentElement.removeAttribute(
                    "data-theme"
                );

                localStorage.setItem(
                    "avr-theme",
                    "auto"
                );

            }


            updateThemeUI(theme);

        }


        /* -----------------------------------------------
           ATUALIZAR INTERFACE DO TEMA
        ------------------------------------------------ */

        function updateThemeUI(theme) {

            themeOptions.forEach(function (option) {

                const optionTheme =
                    option.getAttribute("data-theme-option");

                const check =
                    option.querySelector(".admin-theme-check");


                if (optionTheme === theme) {

                    option.classList.add("active");

                    if (check) {
                        check.style.visibility = "visible";
                        check.style.opacity = "1";
                    }

                } else {

                    option.classList.remove("active");

                    if (check) {
                        check.style.visibility = "hidden";
                        check.style.opacity = "0";
                    }

                }

            });


            if (themeLabel) {

                if (theme === "light") {

                    themeLabel.textContent = "Claro";

                }

                else if (theme === "dark") {

                    themeLabel.textContent = "Escuro";

                }

                else {

                    themeLabel.textContent = "Automático";

                }

            }

        }


        /* -----------------------------------------------
           CLIQUE NAS OPÇÕES
        ------------------------------------------------ */

        themeOptions.forEach(function (option) {

            option.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                const selectedTheme =
                    option.getAttribute("data-theme-option");

                if (!selectedTheme) {
                    return;
                }

                applyTheme(selectedTheme);

                closeThemeMenu();

            });

        });


        /* -----------------------------------------------
           TEMA GUARDADO
        ------------------------------------------------ */

        const savedTheme =
            localStorage.getItem("avr-theme") || "auto";


        applyTheme(savedTheme);


        /* -----------------------------------------------
           FECHAR AO CLICAR FORA
        ------------------------------------------------ */

        document.addEventListener("click", function (event) {

            if (
                !themeMenu.contains(event.target) &&
                !themeButton.contains(event.target) &&
                !(
                    sideThemeButton &&
                    sideThemeButton.contains(event.target)
                )
            ) {

                closeThemeMenu();

            }

        });


        /* -----------------------------------------------
           ESC FECHA TEMA
        ------------------------------------------------ */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                closeThemeMenu();

            }

        });

    }


    /* =====================================================
       BOTÃO ATUALIZAR DA COZINHA
    ====================================================== */

    function initKitchenRefresh() {

        const refreshButton =
            document.getElementById("kitchenRefreshButton");


        if (!refreshButton) {
            return;
        }


        refreshButton.addEventListener("click", function () {

            refreshButton.classList.add("is-refreshing");

            const originalHTML = refreshButton.innerHTML;


            refreshButton.innerHTML = `
                <span>↻</span>
                Atualizando...
            `;


            setTimeout(function () {

                refreshButton.classList.remove(
                    "is-refreshing"
                );

                refreshButton.innerHTML = originalHTML;


                const lastUpdate =
                    document.getElementById("adminLastUpdate");


                if (lastUpdate) {

                    lastUpdate.textContent = "agora";

                }

            }, 700);

        });

    }


    /* =====================================================
       DATA ATUAL
    ====================================================== */

    function initDate() {

        const dateElements = [
            document.getElementById("tablesCurrentDate"),
            document.getElementById("cashCurrentDate")
        ];


        const now = new Date();


        const formattedDate =
            new Intl.DateTimeFormat(
                "pt-AO",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            ).format(now);


        dateElements.forEach(function (element) {

            if (element) {

                element.textContent = formattedDate;

            }

        });

    }

})();