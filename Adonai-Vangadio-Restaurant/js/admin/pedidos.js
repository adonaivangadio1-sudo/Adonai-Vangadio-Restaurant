/* =========================================================
   AVR ADMIN — PEDIDOS
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEY = "avr_admin_orders";

    let orders = [];

    let currentFilter = "all";

    let currentSearch = "";

    let selectedOrderId = null;



    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const refreshButton =
        document.getElementById("ordersRefreshButton");

    const ordersStatus =
        document.getElementById("ordersStatus");

    const ordersList =
        document.getElementById("ordersList");

    const emptyState =
        document.getElementById("ordersEmptyState");

    const searchInput =
        document.getElementById("ordersSearch");

    const visibleCount =
        document.getElementById("ordersVisibleCount");

    const detailPanel =
        document.getElementById("ordersDetailPanel");

    const statusList =
        document.getElementById("ordersStatusList");

    const lastUpdate =
        document.getElementById("adminLastUpdate");



    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }



    function formatCurrency(value) {

        return new Intl.NumberFormat(
            "pt-AO",
            {
                maximumFractionDigits: 0
            }
        ).format(
            Number(value) || 0
        ) + " Kz";

    }



    function getStatusLabel(status) {

        const labels = {

            pending:
                "Pendente",

            preparing:
                "Em preparação",

            ready:
                "Pronto",

            completed:
                "Concluído"

        };

        return labels[status] || "Pendente";

    }



    function getActionLabel(status) {

        const labels = {

            pending:
                "Enviar para cozinha",

            preparing:
                "Marcar pronto",

            ready:
                "Concluir",

            completed:
                "Concluído"

        };

        return labels[status] || "Avançar";

    }



    /* =====================================================
       DADOS
    ===================================================== */

    function loadOrders() {

        /*
         * Primeiro tentamos obter pedidos reais guardados
         * pelo sistema público.
         */

        const possibleKeys = [

            "avr_admin_orders",

            "avr_pedidos",

            "avr_pedido"

        ];


        let foundData = null;


        for (
            const key of possibleKeys
        ) {

            try {

                const saved =
                    localStorage.getItem(key);

                if (!saved) {
                    continue;
                }

                const parsed =
                    JSON.parse(saved);

                if (
                    Array.isArray(parsed) &&
                    parsed.length
                ) {

                    foundData = parsed;

                    break;

                }

            } catch (error) {

                console.warn(
                    "AVR — Não foi possível ler:",
                    key,
                    error
                );

            }

        }


        if (foundData) {

            orders =
                normalizeOrders(
                    foundData
                );

        } else {

            /*
             * Não inventamos pedidos.
             * A página permanece vazia até existirem
             * dados reais ou dados administrativos.
             */

            orders = [];

        }


        saveAdminOrders();

        renderOrders();

        updateDashboard();

    }



    function normalizeOrders(data) {

        return data.map(
            (order, index) => {

                const items =
                    Array.isArray(order.items)
                        ? order.items
                        : [];


                const total =
                    Number(
                        order.total
                    ) ||
                    items.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            (
                                Number(item.price) || 0
                            ) *
                            (
                                Number(item.quantity) || 1
                            ),
                        0
                    );


                return {

                    id:
                        String(
                            order.id ||
                            `order-${index + 1}`
                        ),

                    number:
                        order.number ||
                        String(index + 1).padStart(
                            3,
                            "0"
                        ),

                    table:
                        order.table ||
                        "—",

                    customer:
                        order.customer ||
                        order.name ||
                        "Cliente",

                    time:
                        order.time ||
                        "—",

                    status:
                        normalizeStatus(
                            order.status
                        ),

                    items,

                    total,

                    elapsed:
                        order.elapsed ||
                        "Agora",

                    createdAt:
                        order.createdAt ||
                        null

                };

            }
        );

    }



    function normalizeStatus(status) {

        const valid = [

            "pending",
            "preparing",
            "ready",
            "completed"

        ];


        return valid.includes(status)
            ? status
            : "pending";

    }



    function saveAdminOrders() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(orders)
            );

        } catch (error) {

            console.warn(
                "AVR — Não foi possível guardar pedidos:",
                error
            );

        }

    }



    /* =====================================================
       FILTRO
    ===================================================== */

    function getFilteredOrders() {

        let result =
            [...orders];


        if (
            currentFilter !== "all"
        ) {

            result =
                result.filter(
                    order =>
                        order.status ===
                        currentFilter
                );

        }


        if (
            currentSearch
        ) {

            const search =
                currentSearch
                    .toLowerCase()
                    .trim();


            result =
                result.filter(
                    order => {

                        const searchable = [

                            order.number,

                            order.table,

                            order.customer,

                            order.status,

                            getStatusLabel(
                                order.status
                            )

                        ]
                            .join(" ")
                            .toLowerCase();


                        return searchable.includes(
                            search
                        );

                    }
                );

        }


        return result;

    }



    /* =====================================================
       RENDER DOS PEDIDOS
    ===================================================== */

    function renderOrders() {

        if (!ordersList) {
            return;
        }


        const filteredOrders =
            getFilteredOrders();


        ordersList.innerHTML =
            "";


        if (visibleCount) {

            visibleCount.textContent =
                filteredOrders.length;

        }


        if (
            !filteredOrders.length
        ) {

            if (emptyState) {

                emptyState.hidden =
                    false;

            }

            return;

        }


        if (emptyState) {

            emptyState.hidden =
                true;

        }


        filteredOrders.forEach(
            order => {

                const row =
                    document.createElement(
                        "article"
                    );


                row.className =
                    "orders-row";


                if (
                    order.id ===
                    selectedOrderId
                ) {

                    row.classList.add(
                        "selected"
                    );

                }


                row.innerHTML = `

                    <div class="orders-order-main">

                        <span class="orders-order-number">
                            #${escapeHtml(order.number)}
                        </span>

                        <div>

                            <strong>
                                ${escapeHtml(order.customer)}
                            </strong>

                            <small>
                                ${escapeHtml(order.time)}
                            </small>

                        </div>

                    </div>


                    <div class="orders-cell">

                        <span>
                            Mesa
                        </span>

                        <strong>
                            ${escapeHtml(order.table)}
                        </strong>

                    </div>


                    <div class="orders-cell">

                        <span>
                            Valor
                        </span>

                        <strong>
                            ${formatCurrency(order.total)}
                        </strong>

                    </div>


                    <div class="orders-cell">

                        <span>
                            Estado
                        </span>

                        <strong
                            class="orders-status-badge ${escapeHtml(order.status)}"
                        >
                            ${getStatusLabel(order.status)}
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="orders-row-action"
                        data-order-action="${escapeHtml(order.id)}"
                    >
                        ${getActionLabel(order.status)}
                    </button>

                `;


                row.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(
                                ".orders-row-action"
                            )
                        ) {

                            return;

                        }


                        selectOrder(
                            order.id
                        );

                    }
                );


                const action =
                    row.querySelector(
                        ".orders-row-action"
                    );


                if (action) {

                    action.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            advanceOrder(
                                order.id
                            );

                        }
                    );

                }


                ordersList.appendChild(
                    row
                );

            }
        );

    }



    /* =====================================================
       SELECIONAR PEDIDO
    ===================================================== */

    function selectOrder(orderId) {

        selectedOrderId =
            orderId;


        const order =
            orders.find(
                item =>
                    item.id ===
                    orderId
            );


        if (!order) {

            renderOrders();

            return;

        }


        renderOrderDetail(
            order
        );

        renderOrders();

    }



    /* =====================================================
       DETALHE
    ===================================================== */

    function renderOrderDetail(order) {

        if (!detailPanel) {
            return;
        }


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        detailPanel.innerHTML = `

            <div class="orders-detail-content">

                <div class="orders-detail-top">

                    <div class="orders-detail-heading">

                        <span class="admin-eyebrow">
                            DETALHES DO PEDIDO
                        </span>

                        <h2>
                            Pedido #${escapeHtml(order.number)}
                        </h2>

                        <p>
                            ${escapeHtml(order.customer)}
                            · Mesa ${escapeHtml(order.table)}
                            · ${escapeHtml(order.time)}
                        </p>

                    </div>


                    <div class="orders-detail-actions">

                        <button
                            type="button"
                            class="orders-detail-action"
                            id="detailAdvanceButton"
                        >
                            ${getActionLabel(order.status)}
                        </button>

                        <button
                            type="button"
                            class="orders-detail-action secondary"
                            id="detailCloseButton"
                        >
                            Limpar
                        </button>

                    </div>

                </div>


                <div class="orders-detail-items">

                    ${
                        items.length
                            ? items.map(
                                item => `

                                    <div class="orders-detail-item">

                                        <div class="orders-detail-item-main">

                                            <span class="orders-detail-item-quantity">
                                                ${escapeHtml(
                                                    item.quantity || 1
                                                )}×
                                            </span>

                                            <strong>
                                                ${escapeHtml(
                                                    item.name ||
                                                    "Item"
                                                )}
                                            </strong>

                                        </div>

                                        <span class="orders-detail-item-price">
                                            ${formatCurrency(
                                                (
                                                    Number(item.price) || 0
                                                ) *
                                                (
                                                    Number(item.quantity) || 1
                                                )
                                            )}
                                        </span>

                                    </div>

                                `
                            ).join("")
                            : `

                                <div class="orders-detail-item">

                                    <div class="orders-detail-item-main">

                                        <strong>
                                            Nenhum item detalhado
                                        </strong>

                                    </div>

                                </div>

                            `
                    }

                </div>


                <div class="orders-detail-bottom">

                    <div class="orders-detail-total">

                        <span>
                            Total do pedido
                        </span>

                        <strong>
                            ${formatCurrency(order.total)}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        const advanceButton =
            document.getElementById(
                "detailAdvanceButton"
            );


        if (advanceButton) {

            advanceButton.addEventListener(
                "click",
                () => {

                    advanceOrder(
                        order.id
                    );

                }
            );

        }


        const closeButton =
            document.getElementById(
                "detailCloseButton"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => {

                    selectedOrderId =
                        null;

                    renderOrders();

                    renderEmptyDetail();

                }
            );

        }

    }



    function renderEmptyDetail() {

        if (!detailPanel) {
            return;
        }


        detailPanel.innerHTML = `

            <div class="orders-detail-empty">

                <span class="orders-detail-icon">
                    ◇
                </span>

                <div>

                    <span class="admin-eyebrow">
                        DETALHES DO PEDIDO
                    </span>

                    <h2>
                        Nenhum pedido selecionado
                    </h2>

                    <p>
                        Selecione um pedido na lista para consultar
                        os itens, mesa, valor e estado do atendimento.
                    </p>

                </div>

            </div>

        `;

    }



    /* =====================================================
       AVANÇAR ESTADO
    ===================================================== */

    function advanceOrder(orderId) {

        const order =
            orders.find(
                item =>
                    item.id ===
                    orderId
            );


        if (!order) {
            return;
        }


        const nextStatus = {

            pending:
                "preparing",

            preparing:
                "ready",

            ready:
                "completed",

            completed:
                "completed"

        };


        order.status =
            nextStatus[
                order.status
            ] ||
            "pending";


        saveAdminOrders();


        renderOrders();

        updateDashboard();


        if (
            selectedOrderId ===
            order.id
        ) {

            renderOrderDetail(
                order
            );

        }


        updateLastUpdate();

    }



    /* =====================================================
       INDICADORES
    ===================================================== */

    function updateDashboard() {

        const total =
            orders.length;


        const pending =
            orders.filter(
                order =>
                    order.status ===
                    "pending"
            ).length;


        const preparing =
            orders.filter(
                order =>
                    order.status ===
                    "preparing"
            ).length;


        const ready =
            orders.filter(
                order =>
                    order.status ===
                    "ready"
            ).length;


        const completed =
            orders.filter(
                order =>
                    order.status ===
                    "completed"
            ).length;


        const revenue =
            orders.reduce(
                (
                    sum,
                    order
                ) =>
                    sum +
                    (
                        Number(
                            order.total
                        ) || 0
                    ),
                0
            );


        const average =
            total
                ? Math.round(
                    revenue /
                    total
                )
                : 0;


        const completion =
            total
                ? Math.round(
                    (
                        completed /
                        total
                    ) *
                    100
                )
                : 0;



        setText(
            "ordersTotal",
            total
        );

        setText(
            "ordersPending",
            pending
        );

        setText(
            "ordersPreparing",
            preparing
        );

        setText(
            "ordersCompleted",
            completed
        );


        setText(
            "ordersSummaryTotal",
            total
        );

        setText(
            "ordersRevenue",
            formatCurrency(
                revenue
            )
        );

        setText(
            "ordersAverage",
            formatCurrency(
                average
            )
        );


        setText(
            "ordersCompletionPercent",
            `${completion}%`
        );


        const completionBar =
            document.getElementById(
                "ordersCompletionBar"
            );


        if (completionBar) {

            completionBar.style.width =
                `${completion}%`;

        }


        setText(
            "bottomOrderCount",
            total
        );


        setText(
            "sidebarOrderCount",
            total
        );


        if (ordersStatus) {

            ordersStatus.textContent =
                total > 0
                    ? "Pedidos em operação"
                    : "Sistema ativo";

        }


        renderStatusSummary();

        updatePageSummary(
            total,
            pending,
            preparing,
            ready,
            completed
        );

    }



    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.textContent =
                value;

        }

    }



    /* =====================================================
       RESUMO DE ESTADOS
    ===================================================== */

    function renderStatusSummary() {

        if (!statusList) {
            return;
        }


        const states = [

            {
                key:
                    "pending",

                label:
                    "Pendentes"

            },

            {
                key:
                    "preparing",

                label:
                    "Em preparação"

            },

            {
                key:
                    "ready",

                label:
                    "Prontos"

            },

            {
                key:
                    "completed",

                label:
                    "Concluídos"

            }

        ];


        statusList.innerHTML =
            "";


        states.forEach(
            state => {

                const count =
                    orders.filter(
                        order =>
                            order.status ===
                            state.key
                    ).length;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "orders-status-item";


                item.innerHTML = `

                    <div class="orders-status-main">

                        <span
                            class="orders-status-dot ${state.key}"
                        ></span>

                        <span>
                            ${state.label}
                        </span>

                    </div>

                    <strong>
                        ${count}
                    </strong>

                `;


                statusList.appendChild(
                    item
                );

            }
        );

    }



    /* =====================================================
       RESUMO FINAL
    ===================================================== */

    function updatePageSummary(
        total,
        pending,
        preparing,
        ready,
        completed
    ) {

        const title =
            document.getElementById(
                "ordersSummaryTitle"
            );


        const text =
            document.getElementById(
                "ordersSummaryText"
            );


        if (!title || !text) {
            return;
        }


        if (!total) {

            title.textContent =
                "Sistema pronto para receber pedidos";

            text.textContent =
                "Ainda não existem pedidos registados neste momento.";

            return;

        }


        if (pending > 0) {

            title.textContent =
                `${pending} pedido(s) aguardando atendimento`;

            text.textContent =
                "Existem pedidos novos que precisam de atenção.";

            return;

        }


        if (preparing > 0) {

            title.textContent =
                `${preparing} pedido(s) em preparação`;

            text.textContent =
                "A cozinha está a processar os pedidos ativos.";

            return;

        }


        if (ready > 0) {

            title.textContent =
                `${ready} pedido(s) pronto(s)`;

            text.textContent =
                "Existem pedidos aguardando a entrega ao cliente.";

            return;

        }


        if (
            completed ===
            total
        ) {

            title.textContent =
                "Todos os pedidos concluídos";

            text.textContent =
                "Não existem pedidos pendentes neste momento.";

        }

    }



    /* =====================================================
       FILTROS
    ===================================================== */

    function setupFilters() {

        const buttons =
            document.querySelectorAll(
                ".orders-filter-button"
            );


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentFilter =
                            button.dataset.ordersFilter ||
                            "all";


                        buttons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        renderOrders();

                    }
                );

            }
        );

    }



    /* =====================================================
       PESQUISA
    ===================================================== */

    function setupSearch() {

        if (!searchInput) {
            return;
        }


        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value;

                renderOrders();

            }
        );

    }



    /* =====================================================
       ATUALIZAR
    ===================================================== */

    function refreshOrders() {

        if (!refreshButton) {

            loadOrders();

            return;

        }


        refreshButton.disabled =
            true;


        const original =
            refreshButton.innerHTML;


        refreshButton.innerHTML = `

            <span>
                ↻
            </span>

            A atualizar...

        `;


        setTimeout(
            () => {

                loadOrders();

                refreshButton.disabled =
                    false;

                refreshButton.innerHTML =
                    original;

                updateLastUpdate();

            },
            450
        );

    }



    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshOrders
        );

    }



    /* =====================================================
       ÚLTIMA ATUALIZAÇÃO
    ===================================================== */

    function updateLastUpdate() {

        if (!lastUpdate) {
            return;
        }


        const now =
            new Date();


        lastUpdate.textContent =
            now.toLocaleTimeString(
                "pt-AO",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );

    }



    /* =====================================================
       MENU ADMINISTRATIVO
       UM ÚNICO SISTEMA
    ===================================================== */

    function initAdminMenu() {

        const menuButton =
            document.getElementById(
                "adminMenuButton"
            );

        const closeButton =
            document.getElementById(
                "adminCloseMenu"
            );

        const sidebar =
            document.getElementById(
                "adminSidebar"
            );

        const overlay =
            document.getElementById(
                "adminMenuOverlay"
            );

        const bottomMore =
            document.getElementById(
                "adminBottomMore"
            );


        if (
            !menuButton ||
            !sidebar
        ) {

            return;

        }


        function openMenu() {

            sidebar.classList.add(
                "is-open"
            );

            sidebar.classList.add(
                "open"
            );


            if (overlay) {

                overlay.classList.add(
                    "is-visible"
                );

                overlay.classList.add(
                    "open"
                );

            }


            sidebar.setAttribute(
                "aria-hidden",
                "false"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );


            menuButton.classList.add(
                "active"
            );


            document.body.classList.add(
                "admin-menu-open"
            );

        }


        function closeMenu() {

            sidebar.classList.remove(
                "is-open"
            );

            sidebar.classList.remove(
                "open"
            );


            if (overlay) {

                overlay.classList.remove(
                    "is-visible"
                );

                overlay.classList.remove(
                    "open"
                );

            }


            sidebar.setAttribute(
                "aria-hidden",
                "true"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            menuButton.classList.remove(
                "active"
            );


            document.body.classList.remove(
                "admin-menu-open"
            );

        }


        function toggleMenu() {

            if (
                sidebar.classList.contains(
                    "is-open"
                ) ||
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }


        menuButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                toggleMenu();

            }
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeMenu();

                }
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                () => {

                    closeMenu();

                }
            );

        }


        if (bottomMore) {

            bottomMore.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    toggleMenu();

                }
            );

        }


        sidebar
            .querySelectorAll(
                "a.admin-side-link"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        () => {

                            closeMenu();

                        }
                    );

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeMenu();

                }

            }
        );

    }



    /* =====================================================
       MENU DE APARÊNCIA
       UM ÚNICO SISTEMA
    ===================================================== */

    function initThemeMenu() {

        const themeButton =
            document.getElementById(
                "adminThemeButton"
            );

        const themeMenu =
            document.getElementById(
                "adminThemeMenu"
            );

        const sideThemeButton =
            document.getElementById(
                "adminThemeMenuButton"
            );

        const themeLabel =
            document.getElementById(
                "adminThemeLabel"
            );


        if (
            !themeButton ||
            !themeMenu
        ) {

            return;

        }


        const themeOptions =
            themeMenu.querySelectorAll(
                ".admin-theme-option[data-theme-option]"
            );


        function getSavedTheme() {

            return (
                localStorage.getItem(
                    "avr-theme"
                ) ||

                localStorage.getItem(
                    "theme"
                ) ||

                "auto"
            );

        }


        function openThemeMenu() {

            themeMenu.classList.add(
                "is-open"
            );

            themeMenu.classList.add(
                "open"
            );


            themeMenu.setAttribute(
                "aria-hidden",
                "false"
            );


            themeButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        function closeThemeMenu() {

            themeMenu.classList.remove(
                "is-open"
            );

            themeMenu.classList.remove(
                "open"
            );


            themeMenu.setAttribute(
                "aria-hidden",
                "true"
            );


            themeButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        function toggleThemeMenu() {

            if (
                themeMenu.classList.contains(
                    "is-open"
                ) ||
                themeMenu.classList.contains(
                    "open"
                )
            ) {

                closeThemeMenu();

            } else {

                openThemeMenu();

            }

        }


        function applyTheme(theme) {

            localStorage.setItem(
                "avr-theme",
                theme
            );

            localStorage.setItem(
                "theme",
                theme
            );


            const root =
                document.documentElement;


            if (
                theme ===
                "dark"
            ) {

                root.classList.add(
                    "dark"
                );

                root.setAttribute(
                    "data-theme",
                    "dark"
                );

            }

            else if (
                theme ===
                "light"
            ) {

                root.classList.remove(
                    "dark"
                );

                root.setAttribute(
                    "data-theme",
                    "light"
                );

            }

            else {

                root.classList.remove(
                    "dark"
                );

                root.setAttribute(
                    "data-theme",
                    "auto"
                );

            }


            themeOptions.forEach(
                option => {

                    const optionTheme =
                        option.getAttribute(
                            "data-theme-option"
                        );


                    const active =
                        optionTheme ===
                        theme;


                    option.classList.toggle(
                        "active",
                        active
                    );

                    option.classList.toggle(
                        "is-active",
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


            if (themeLabel) {

                const labels = {

                    auto:
                        "Automático",

                    light:
                        "Claro",

                    dark:
                        "Escuro"

                };


                themeLabel.textContent =
                    labels[theme] ||
                    "Automático";

            }

        }


        themeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                toggleThemeMenu();

            }
        );


        if (sideThemeButton) {

            sideThemeButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    openThemeMenu();

                }
            );

        }


        themeOptions.forEach(
            option => {

                option.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const selectedTheme =
                            option.getAttribute(
                                "data-theme-option"
                            );


                        if (
                            ![
                                "auto",
                                "light",
                                "dark"
                            ].includes(
                                selectedTheme
                            )
                        ) {

                            return;

                        }


                        applyTheme(
                            selectedTheme
                        );

                        closeThemeMenu();

                    }
                );

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !themeMenu.contains(
                        event.target
                    ) &&
                    !themeButton.contains(
                        event.target
                    ) &&
                    !(
                        sideThemeButton &&
                        sideThemeButton.contains(
                            event.target
                        )
                    )
                ) {

                    closeThemeMenu();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeThemeMenu();

                }

            }
        );


        applyTheme(
            getSavedTheme()
        );

    }



    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            initAdminMenu();

            initThemeMenu();

            setupFilters();

            setupSearch();

            renderEmptyDetail();

            updateLastUpdate();

            loadOrders();

        }
    );

})();