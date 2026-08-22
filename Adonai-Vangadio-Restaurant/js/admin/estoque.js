/* =========================================================
   AVR ADMIN — ESTOQUE
   MENU + APARÊNCIA + INVENTÁRIO
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ESTADO
    ===================================================== */

    let stockItems = [];

    let currentFilter = "all";

    let searchTerm = "";

    let selectedItemId = null;


    /* =====================================================
       DOM READY
    ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        initAdminMenu();
        initThemeMenu();
        initStock();
        initDate();

    });


    /* =====================================================
       MENU LATERAL
    ===================================================== */

    function initAdminMenu() {

        const menuButton =
            document.getElementById("adminMenuButton");

        const sidebar =
            document.getElementById("adminSidebar");

        const overlay =
            document.getElementById("adminMenuOverlay");

        const closeButton =
            document.getElementById("adminCloseMenu");

        const bottomMore =
            document.getElementById("adminBottomMore");


        if (!menuButton || !sidebar) {
            return;
        }


        function openMenu() {

            sidebar.classList.add("open");
            sidebar.classList.add("is-open");

            if (overlay) {
                overlay.classList.add("open");
                overlay.classList.add("is-visible");
            }

            menuButton.classList.add("active");

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            sidebar.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "admin-menu-open"
            );

        }


        function closeMenu() {

            sidebar.classList.remove("open");
            sidebar.classList.remove("is-open");

            if (overlay) {
                overlay.classList.remove("open");
                overlay.classList.remove("is-visible");
            }

            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            sidebar.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "admin-menu-open"
            );

        }


        function toggleMenu() {

            if (
                sidebar.classList.contains("open") ||
                sidebar.classList.contains("is-open")
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }


        menuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                toggleMenu();

            }
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeMenu();

                }
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeMenu();

                }
            );

        }


        if (bottomMore) {

            bottomMore.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    toggleMenu();

                }
            );

        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {
                    closeMenu();
                }

            }
        );


        sidebar
            .querySelectorAll("a.admin-side-link")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMenu();

                    }
                );

            });

    }


    /* =====================================================
       APARÊNCIA
    ===================================================== */

    function initThemeMenu() {

        const themeButton =
            document.getElementById("adminThemeButton");

        const themeMenu =
            document.getElementById("adminThemeMenu");

        const sideThemeButton =
            document.getElementById(
                "adminThemeMenuButton"
            );

        const themeLabel =
            document.getElementById(
                "adminThemeLabel"
            );


        if (!themeButton || !themeMenu) {
            return;
        }


        const themeOptions =
            themeMenu.querySelectorAll(
                ".admin-theme-option[data-theme-option]"
            );


        function openThemeMenu() {

            themeMenu.classList.add("open");
            themeMenu.classList.add("is-open");

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

            themeMenu.classList.remove("open");
            themeMenu.classList.remove("is-open");

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
                themeMenu.classList.contains("open") ||
                themeMenu.classList.contains("is-open")
            ) {

                closeThemeMenu();

            } else {

                openThemeMenu();

            }

        }


        themeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                toggleThemeMenu();

            }
        );


        if (sideThemeButton) {

            sideThemeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openThemeMenu();

                }
            );

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


            if (theme === "dark") {

                document.documentElement.classList.add(
                    "dark"
                );

                document.documentElement.setAttribute(
                    "data-theme",
                    "dark"
                );

            }

            else if (theme === "light") {

                document.documentElement.classList.remove(
                    "dark"
                );

                document.documentElement.setAttribute(
                    "data-theme",
                    "light"
                );

            }

            else {

                document.documentElement.classList.remove(
                    "dark"
                );

                document.documentElement.setAttribute(
                    "data-theme",
                    "auto"
                );

            }


            updateThemeUI(theme);

        }


        function updateThemeUI(theme) {

            themeOptions.forEach(
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

                    auto: "Automático",

                    light: "Claro",

                    dark: "Escuro"

                };

                themeLabel.textContent =
                    labels[theme] ||
                    "Automático";

            }

        }


        themeOptions.forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const selectedTheme =
                            option.getAttribute(
                                "data-theme-option"
                            );


                        if (
                            selectedTheme !== "auto" &&
                            selectedTheme !== "light" &&
                            selectedTheme !== "dark"
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
            function (event) {

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
            function (event) {

                if (event.key === "Escape") {
                    closeThemeMenu();
                }

            }
        );


        const savedTheme =
            localStorage.getItem(
                "avr-theme"
            ) ||
            localStorage.getItem(
                "theme"
            ) ||
            "auto";


        applyTheme(savedTheme);

    }


    /* =====================================================
       INICIALIZAÇÃO DO ESTOQUE
    ===================================================== */

    function initStock() {

        const refreshButton =
            document.getElementById(
                "stockRefreshButton"
            );

        const searchInput =
            document.getElementById(
                "stockSearchInput"
            );

        const addButton =
            document.getElementById(
                "stockAddButton"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    searchTerm =
                        searchInput.value
                            .trim()
                            .toLowerCase();

                    renderStock();

                }
            );

        }


        document
            .querySelectorAll(
                ".stock-filter-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            currentFilter =
                                button.dataset.stockFilter ||
                                "all";


                            document
                                .querySelectorAll(
                                    ".stock-filter-button"
                                )
                                .forEach(
                                    function (item) {

                                        item.classList.remove(
                                            "active"
                                        );

                                    }
                                );


                            button.classList.add(
                                "active"
                            );


                            renderStock();

                        }
                    );

                }
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                refreshStock
            );

        }


        if (addButton) {

            addButton.addEventListener(
                "click",
                function () {

                    showAddItemMessage();

                }
            );

        }


        loadStockData();

    }


    /* =====================================================
       DADOS
       Estrutura pronta para integração posterior.
    ===================================================== */

    function loadStockData() {

        /*
         * O estoque começa vazio nesta fase.
         *
         * A estrutura abaixo está preparada para receber
         * os produtos reais posteriormente.
         */

        stockItems = [];

        selectedItemId = null;

        renderStock();

    }


    /* =====================================================
       FILTRAGEM
    ===================================================== */

    function getFilteredItems() {

        return stockItems.filter(
            function (item) {

                const matchesSearch =
                    !searchTerm ||
                    item.name
                        .toLowerCase()
                        .includes(searchTerm) ||
                    item.category
                        .toLowerCase()
                        .includes(searchTerm);


                if (!matchesSearch) {
                    return false;
                }


                if (currentFilter === "all") {
                    return true;
                }


                return getStockState(item) === currentFilter;

            }
        );

    }


    /* =====================================================
       ESTADO DO PRODUTO
    ===================================================== */

    function getStockState(item) {

        const quantity =
            Number(item.quantity) || 0;

        const minimum =
            Number(item.minimum) || 0;


        if (quantity <= 0) {
            return "out";
        }


        if (quantity <= minimum) {
            return "low";
        }


        return "ok";

    }


    function getStockStateLabel(state) {

        const labels = {

            ok: "Normal",

            low: "Estoque baixo",

            out: "Esgotado"

        };

        return labels[state] ||
            "Normal";

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =====================================================
       MOEDA
    ===================================================== */

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


    /* =====================================================
       RENDER GERAL
    ===================================================== */

    function renderStock() {

        renderTable();

        renderMobileList();

        renderAlerts();

        renderCategories();

        updateIndicators();

        renderDetail();

    }


    /* =====================================================
       TABELA
    ===================================================== */

    function renderTable() {

        const tbody =
            document.getElementById(
                "stockTableBody"
            );

        const emptyState =
            document.getElementById(
                "stockEmptyState"
            );


        if (!tbody) {
            return;
        }


        const items =
            getFilteredItems();


        tbody.innerHTML = "";


        if (!items.length) {

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;

        }


        if (emptyState) {
            emptyState.hidden = true;
        }


        items.forEach(
            function (item) {

                const state =
                    getStockState(item);


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="stock-product">

                            <span class="stock-product-icon">
                                ${escapeHtml(
                                    item.icon || "▦"
                                )}
                            </span>

                            <div class="stock-product-name">

                                <strong>
                                    ${escapeHtml(
                                        item.name
                                    )}
                                </strong>

                                <small>
                                    ${escapeHtml(
                                        item.unit || "un."
                                    )}
                                </small>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${escapeHtml(
                            item.category
                        )}
                    </td>


                    <td>
                        <span class="stock-quantity">
                            ${escapeHtml(
                                item.quantity
                            )}
                            ${escapeHtml(
                                item.unit || ""
                            )}
                        </span>
                    </td>


                    <td>
                        <span class="stock-minimum">
                            ${escapeHtml(
                                item.minimum
                            )}
                        </span>
                    </td>


                    <td>

                        <span
                            class="stock-state ${state}"
                        >
                            ${getStockStateLabel(
                                state
                            )}
                        </span>

                    </td>


                    <td>
                        ${formatCurrency(
                            item.value
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="stock-row-action"
                            data-stock-item="${escapeHtml(
                                item.id
                            )}"
                        >
                            Ver
                        </button>

                    </td>

                `;


                row.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target.closest(
                                ".stock-row-action"
                            )
                        ) {
                            return;
                        }

                        selectItem(
                            item.id
                        );

                    }
                );


                const action =
                    row.querySelector(
                        ".stock-row-action"
                    );


                if (action) {

                    action.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();

                            selectItem(
                                item.id
                            );

                        }
                    );

                }


                tbody.appendChild(row);

            }
        );

    }


    /* =====================================================
       LISTA MOBILE
    ===================================================== */

    function renderMobileList() {

        const container =
            document.getElementById(
                "stockMobileList"
            );


        if (!container) {
            return;
        }


        const items =
            getFilteredItems();


        container.innerHTML = "";


        items.forEach(
            function (item) {

                const state =
                    getStockState(item);


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "stock-mobile-card";


                card.innerHTML = `

                    <div class="stock-mobile-top">

                        <div class="stock-mobile-info">

                            <span class="stock-product-icon">
                                ${escapeHtml(
                                    item.icon || "▦"
                                )}
                            </span>

                            <div>

                                <strong>
                                    ${escapeHtml(
                                        item.name
                                    )}
                                </strong>

                                <small>
                                    ${escapeHtml(
                                        item.category
                                    )}
                                </small>

                            </div>

                        </div>


                        <span
                            class="stock-state ${state}"
                        >
                            ${getStockStateLabel(
                                state
                            )}
                        </span>

                    </div>


                    <div class="stock-mobile-meta">

                        <div>

                            <span>
                                Quantidade
                            </span>

                            <strong>
                                ${escapeHtml(
                                    item.quantity
                                )}
                                ${escapeHtml(
                                    item.unit || ""
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Mínimo
                            </span>

                            <strong>
                                ${escapeHtml(
                                    item.minimum
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Valor
                            </span>

                            <strong>
                                ${formatCurrency(
                                    item.value
                                )}
                            </strong>

                        </div>

                    </div>

                `;


                card.addEventListener(
                    "click",
                    function () {

                        selectItem(
                            item.id
                        );

                    }
                );


                container.appendChild(card);

            }
        );

    }


    /* =====================================================
       INDICADORES
    ===================================================== */

    function updateIndicators() {

        const total =
            stockItems.length;


        const low =
            stockItems.filter(
                function (item) {

                    return getStockState(item) === "low";

                }
            ).length;


        const out =
            stockItems.filter(
                function (item) {

                    return getStockState(item) === "out";

                }
            ).length;


        const totalValue =
            stockItems.reduce(
                function (sum, item) {

                    return sum +
                        (Number(item.value) || 0);

                },
                0
            );


        const totalElement =
            document.getElementById(
                "stockTotalItems"
            );

        const lowElement =
            document.getElementById(
                "stockLowItems"
            );

        const outElement =
            document.getElementById(
                "stockOutItems"
            );

        const valueElement =
            document.getElementById(
                "stockTotalValue"
            );

        const statusElement =
            document.getElementById(
                "stockStatus"
            );

        const sidebarAlert =
            document.getElementById(
                "sidebarStockAlertCount"
            );


        if (totalElement) {
            totalElement.textContent =
                total;
        }

        if (lowElement) {
            lowElement.textContent =
                low;
        }

        if (outElement) {
            outElement.textContent =
                out;
        }

        if (valueElement) {
            valueElement.textContent =
                formatCurrency(
                    totalValue
                );
        }

        if (sidebarAlert) {
            sidebarAlert.textContent =
                low + out;
        }


        if (statusElement) {

            if (out > 0) {

                statusElement.textContent =
                    "Reposição urgente";

            }

            else if (low > 0) {

                statusElement.textContent =
                    "Atenção ao estoque";

            }

            else {

                statusElement.textContent =
                    "Estoque controlado";

            }

        }


        updateSummary(
            total,
            low,
            out
        );

    }


    /* =====================================================
       RESUMO
    ===================================================== */

    function updateSummary(
        total,
        low,
        out
    ) {

        const title =
            document.getElementById(
                "stockSummaryTitle"
            );

        const text =
            document.getElementById(
                "stockSummaryText"
            );


        if (!title || !text) {
            return;
        }


        if (total === 0) {

            title.textContent =
                "Estoque pronto para operação";

            text.textContent =
                "Não existem itens registados neste momento.";

            return;

        }


        if (out > 0) {

            title.textContent =
                `${out} item(ns) esgotado(s)`;

            text.textContent =
                "Existem produtos sem disponibilidade que precisam de reposição.";

            return;

        }


        if (low > 0) {

            title.textContent =
                `${low} item(ns) com estoque baixo`;

            text.textContent =
                "Revise os níveis mínimos para evitar interrupções na operação.";

            return;

        }


        title.textContent =
            "Estoque em situação normal";

        text.textContent =
            "Os níveis atuais estão acima dos mínimos definidos.";

    }


    /* =====================================================
       ALERTAS
    ===================================================== */

    function renderAlerts() {

        const container =
            document.getElementById(
                "stockAlertList"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const alerts =
            stockItems.filter(
                function (item) {

                    return getStockState(item) !== "ok";

                }
            ).slice(0,5);


        if (!alerts.length) {

            container.innerHTML = `

                <div class="stock-alert-item">

                    <div class="stock-alert-main">

                        <span class="stock-alert-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Nenhuma reposição urgente
                            </strong>

                            <small>
                                Os níveis de estoque estão controlados.
                            </small>

                        </div>

                    </div>

                </div>

            `;

            return;

        }


        alerts.forEach(
            function (item) {

                const state =
                    getStockState(item);


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "stock-alert-item";


                element.innerHTML = `

                    <div class="stock-alert-main">

                        <span class="stock-alert-icon">
                            ${state === "out"
                                ? "×"
                                : "!"
                            }
                        </span>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    item.name
                                )}
                            </strong>

                            <small>
                                Atual:
                                ${escapeHtml(
                                    item.quantity
                                )}
                                · Mínimo:
                                ${escapeHtml(
                                    item.minimum
                                )}
                            </small>

                        </div>

                    </div>


                    <span class="stock-alert-value">

                        ${state === "out"
                            ? "Esgotado"
                            : "Repor"
                        }

                    </span>

                `;


                container.appendChild(
                    element
                );

            }
        );

    }


    /* =====================================================
       CATEGORIAS
    ===================================================== */

    function renderCategories() {

        const container =
            document.getElementById(
                "stockCategoryList"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const categories = {};


        stockItems.forEach(
            function (item) {

                const category =
                    item.category ||
                    "Outros";


                categories[category] =
                    (categories[category] || 0) +
                    1;

            }
        );


        const values =
            Object.entries(
                categories
            );


        if (!values.length) {

            container.innerHTML = `

                <div class="stock-alert-item">

                    <div class="stock-alert-main">

                        <span class="stock-alert-icon">
                            ▦
                        </span>

                        <div>

                            <strong>
                                Sem categorias
                            </strong>

                            <small>
                                Os produtos aparecerão aqui quando forem registados.
                            </small>

                        </div>

                    </div>

                </div>

            `;

            return;

        }


        const max =
            Math.max(
                ...values.map(
                    function (item) {
                        return item[1];
                    }
                )
            );


        values
            .sort(
                function (a,b) {
                    return b[1] - a[1];
                }
            )
            .slice(0,5)
            .forEach(
                function (entry) {

                    const category =
                        entry[0];

                    const count =
                        entry[1];

                    const percent =
                        Math.round(
                            (count / max) * 100
                        );


                    const element =
                        document.createElement(
                            "div"
                        );


                    element.className =
                        "stock-category-item";


                    element.innerHTML = `

                        <span>
                            ${escapeHtml(
                                category
                            )}
                        </span>

                        <div class="stock-category-track">

                            <span
                                style="width:${percent}%"
                            ></span>

                        </div>

                        <strong>
                            ${count}
                        </strong>

                    `;


                    container.appendChild(
                        element
                    );

                }
            );

    }


    /* =====================================================
       DETALHE
    ===================================================== */

    function selectItem(itemId) {

        selectedItemId =
            itemId;

        renderDetail();

        renderTable();

        renderMobileList();

    }


    function renderDetail() {

        const panel =
            document.getElementById(
                "stockDetailPanel"
            );


        if (!panel) {
            return;
        }


        const item =
            stockItems.find(
                function (entry) {

                    return entry.id ===
                        selectedItemId;

                }
            );


        if (!item) {

            panel.innerHTML = `

                <div class="stock-detail-empty">

                    <span class="stock-detail-icon">
                        ▦
                    </span>

                    <div>

                        <span class="admin-eyebrow">
                            DETALHE DO ESTOQUE
                        </span>

                        <h2>
                            Nenhum item selecionado
                        </h2>

                        <p>
                            Selecione um produto para consultar os detalhes
                            e atualizar a quantidade disponível.
                        </p>

                    </div>

                </div>

            `;

            return;

        }


        const state =
            getStockState(item);


        panel.innerHTML = `

            <div class="stock-detail-content">

                <div class="stock-detail-top">

                    <div>

                        <span class="admin-eyebrow">
                            DETALHE DO ESTOQUE
                        </span>

                        <h2>
                            ${escapeHtml(
                                item.name
                            )}
                        </h2>

                        <p>
                            ${escapeHtml(
                                item.category
                            )}
                            ·
                            ${escapeHtml(
                                item.unit || "un."
                            )}
                        </p>

                    </div>


                    <span
                        class="stock-state ${state}"
                    >
                        ${getStockStateLabel(
                            state
                        )}
                    </span>

                </div>


                <div class="stock-detail-grid">

                    <div class="stock-detail-stat">

                        <span>
                            Quantidade atual
                        </span>

                        <strong>
                            ${escapeHtml(
                                item.quantity
                            )}
                            ${escapeHtml(
                                item.unit || ""
                            )}
                        </strong>

                    </div>


                    <div class="stock-detail-stat">

                        <span>
                            Estoque mínimo
                        </span>

                        <strong>
                            ${escapeHtml(
                                item.minimum
                            )}
                        </strong>

                    </div>


                    <div class="stock-detail-stat">

                        <span>
                            Valor unitário
                        </span>

                        <strong>
                            ${formatCurrency(
                                item.unitValue ||
                                0
                            )}
                        </strong>

                    </div>


                    <div class="stock-detail-stat">

                        <span>
                            Valor total
                        </span>

                        <strong>
                            ${formatCurrency(
                                item.value
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        `;

    }


    /* =====================================================
       ATUALIZAÇÃO
    ===================================================== */

    function refreshStock() {

        const button =
            document.getElementById(
                "stockRefreshButton"
            );


        if (!button) {
            loadStockData();
            return;
        }


        const originalHTML =
            button.innerHTML;


        button.classList.add(
            "is-refreshing"
        );

        button.innerHTML = `
            <span>↻</span>
            A atualizar...
        `;


        button.disabled = true;


        setTimeout(
            function () {

                loadStockData();

                button.disabled =
                    false;

                button.classList.remove(
                    "is-refreshing"
                );

                button.innerHTML =
                    originalHTML;

                updateLastUpdate();

            },
            500
        );

    }


    /* =====================================================
       NOVO ITEM
    ===================================================== */

    function showAddItemMessage() {

        /*
         * Interface preparada para a futura janela/modal
         * de criação de produtos.
         */

        const title =
            document.getElementById(
                "stockSummaryTitle"
            );

        const text =
            document.getElementById(
                "stockSummaryText"
            );


        if (title) {

            title.textContent =
                "Novo item de estoque";

        }


        if (text) {

            text.textContent =
                "A área de cadastro está preparada para receber o formulário de novos produtos.";

        }

    }


    /* =====================================================
       DATA
    ===================================================== */

    function initDate() {

        updateLastUpdate();

    }


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
                    minute: "2-digit"
                }
            ).format(
                new Date()
            );

    }


})();