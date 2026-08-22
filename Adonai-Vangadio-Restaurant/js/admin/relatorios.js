/* =========================================================
   AVR ADMIN
   relatorios.js
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEYS = {

        orders:
            "avr-orders",

        theme:
            "avr-theme",

        adminSession:
            "avr-admin-session"

    };


    let currentPeriod = "today";


    /* =====================================================
       ELEMENTOS DO MENU
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
       MENU
    ===================================================== */

    function openMenu() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        menuOverlay?.classList.add("open");

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

        sidebar.classList.remove("open");

        menuOverlay?.classList.remove("open");

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
            sidebar?.classList.contains("open")
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

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );



    /* =====================================================
       TEMA
    ===================================================== */

    function getStoredTheme() {

        return (
            localStorage.getItem(
                STORAGE_KEYS.theme
            ) || "auto"
        );

    }


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

            root.removeAttribute(
                "data-theme"
            );

        }


        localStorage.setItem(
            STORAGE_KEYS.theme,
            theme
        );


        updateThemeLabel(theme);

    }


    function updateThemeLabel(theme) {

        if (!themeLabel) {
            return;
        }


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


    function cycleTheme() {

        const current =
            getStoredTheme();


        const next = {

            auto:
                "light",

            light:
                "dark",

            dark:
                "auto"

        }[current];


        applyTheme(
            next || "auto"
        );

    }


    themeButton?.addEventListener(
        "click",
        cycleTheme
    );


    themeMenuButton?.addEventListener(
        "click",
        cycleTheme
    );


    applyTheme(
        getStoredTheme()
    );



    /* =====================================================
       TEMA AUTOMÁTICO
    ===================================================== */

    const systemTheme =
        window.matchMedia
            ? window.matchMedia(
                "(prefers-color-scheme: dark)"
            )
            : null;


    function refreshAutomaticTheme() {

        if (
            getStoredTheme() !== "auto"
        ) {

            return;

        }


        document.documentElement.removeAttribute(
            "data-theme"
        );

    }


    systemTheme?.addEventListener(
        "change",
        refreshAutomaticTheme
    );



    /* =====================================================
       LINKS DO MENU
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
       PEDIDOS
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
                "AVR Relatórios: erro ao ler pedidos.",
                error
            );

            return [];

        }

    }



    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function calculateTotal(items) {

        if (!Array.isArray(items)) {
            return 0;
        }


        return items.reduce(
            function (total, item) {

                const price =
                    Number(item?.price) || 0;


                const quantity =
                    Number(item?.quantity) || 1;


                return (
                    total +
                    price * quantity
                );

            },
            0
        );

    }


    function countItems(items) {

        if (!Array.isArray(items)) {
            return 0;
        }


        return items.reduce(
            function (total, item) {

                return (
                    total +
                    (
                        Number(
                            item?.quantity
                        ) || 1
                    )
                );

            },
            0
        );

    }


    function formatCurrency(value) {

        return (
            new Intl.NumberFormat(
                "pt-AO"
            ).format(
                Number(value) || 0
            )
            + " Kz"
        );

    }


    function formatDate(date) {

        try {

            return new Intl.DateTimeFormat(
                "pt-AO",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            ).format(
                new Date(date)
            );

        } catch {

            return "--/--/----";

        }

    }


    function formatTime(date) {

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
       DATAS
    ===================================================== */

    function startOfDay(date) {

        const result =
            new Date(date);

        result.setHours(
            0,
            0,
            0,
            0
        );

        return result;

    }


    function startOfWeek(date) {

        const result =
            startOfDay(date);


        const day =
            result.getDay();


        const difference =
            day === 0
                ? -6
                : 1 - day;


        result.setDate(
            result.getDate() +
            difference
        );


        return result;

    }


    function startOfMonth(date) {

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            1,
            0,
            0,
            0,
            0
        );

    }


    function startOfYear(date) {

        return new Date(
            date.getFullYear(),
            0,
            1,
            0,
            0,
            0,
            0
        );

    }


    function getPeriodRange(period) {

        const now =
            new Date();


        let start;


        let end =
            new Date();


        if (period === "week") {

            start =
                startOfWeek(now);

        } else if (period === "month") {

            start =
                startOfMonth(now);

        } else if (period === "year") {

            start =
                startOfYear(now);

        } else {

            start =
                startOfDay(now);

        }


        end.setHours(
            23,
            59,
            59,
            999
        );


        return {
            start,
            end
        };

    }


    function filterOrdersByPeriod(
        orders,
        period
    ) {

        const range =
            getPeriodRange(
                period
            );


        return orders.filter(
            function (order) {

                const date =
                    new Date(
                        order.createdAt
                    );


                return (
                    !Number.isNaN(
                        date.getTime()
                    )
                    &&
                    date >= range.start
                    &&
                    date <= range.end
                );

            }
        );

    }



    /* =====================================================
       TÍTULOS
    ===================================================== */

    function getPeriodTitle(period) {

        return {

            today:
                "Hoje",

            week:
                "Esta semana",

            month:
                "Este mês",

            year:
                "Este ano"

        }[period] || "Hoje";

    }



    /* =====================================================
       KPIs
    ===================================================== */

    function renderKPIs(orders) {

        const revenue =
            orders.reduce(
                function (total, order) {

                    return (
                        total +
                        calculateTotal(
                            order.items
                        )
                    );

                },
                0
            );


        const totalOrders =
            orders.length;


        const average =
            totalOrders
                ? revenue / totalOrders
                : 0;


        const completed =
            orders.filter(
                function (order) {

                    return (
                        order.status ===
                        "delivered"
                    );

                }
            ).length;


        const revenueElement =
            document.getElementById(
                "reportRevenue"
            );


        const ordersElement =
            document.getElementById(
                "reportOrders"
            );


        const averageElement =
            document.getElementById(
                "reportAverage"
            );


        const completedElement =
            document.getElementById(
                "reportCompleted"
            );


        const chartTotal =
            document.getElementById(
                "reportChartTotal"
            );


        const financialGross =
            document.getElementById(
                "financialGross"
            );


        const financialOrders =
            document.getElementById(
                "financialOrders"
            );


        const financialAverage =
            document.getElementById(
                "financialAverage"
            );


        if (revenueElement) {

            revenueElement.textContent =
                formatCurrency(
                    revenue
                );

        }


        if (ordersElement) {

            ordersElement.textContent =
                totalOrders;

        }


        if (averageElement) {

            averageElement.textContent =
                formatCurrency(
                    average
                );

        }


        if (completedElement) {

            completedElement.textContent =
                completed;

        }


        if (chartTotal) {

            chartTotal.textContent =
                formatCurrency(
                    revenue
                );

        }


        if (financialGross) {

            financialGross.textContent =
                formatCurrency(
                    revenue
                );

        }


        if (financialOrders) {

            financialOrders.textContent =
                totalOrders;

        }


        if (financialAverage) {

            financialAverage.textContent =
                formatCurrency(
                    average
                );

        }

    }



    /* =====================================================
       GRÁFICO
    ===================================================== */

    function buildChartData(
        orders,
        period
    ) {

        const data = [];


        if (period === "today") {

            for (
                let hour = 10;
                hour <= 22;
                hour++
            ) {

                data.push({
                    label:
                        `${hour}h`,
                    value:
                        0
                });

            }


            orders.forEach(
                function (order) {

                    const date =
                        new Date(
                            order.createdAt
                        );


                    const hour =
                        date.getHours();


                    const index =
                        hour - 10;


                    if (
                        index >= 0 &&
                        index < data.length
                    ) {

                        data[index].value +=
                            calculateTotal(
                                order.items
                            );

                    }

                }
            );


            return data;

        }


        if (period === "week") {

            const names = [
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb",
                "Dom"
            ];


            names.forEach(
                function (label) {

                    data.push({
                        label,
                        value: 0
                    });

                }
            );


            orders.forEach(
                function (order) {

                    const date =
                        new Date(
                            order.createdAt
                        );


                    const day =
                        date.getDay();


                    const index =
                        day === 0
                            ? 6
                            : day - 1;


                    data[index].value +=
                        calculateTotal(
                            order.items
                        );

                }
            );


            return data;

        }


        if (period === "month") {

            const now =
                new Date();


            const days =
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0
                ).getDate();


            const step =
                Math.ceil(
                    days / 7
                );


            for (
                let start = 1;
                start <= days;
                start += step
            ) {

                const end =
                    Math.min(
                        start + step - 1,
                        days
                    );


                data.push({
                    label:
                        `${start}-${end}`,
                    value:
                        0
                });

            }


            orders.forEach(
                function (order) {

                    const day =
                        new Date(
                            order.createdAt
                        ).getDate();


                    const index =
                        Math.min(
                            Math.floor(
                                (day - 1) / step
                            ),
                            data.length - 1
                        );


                    data[index].value +=
                        calculateTotal(
                            order.items
                        );

                }
            );


            return data;

        }


        for (
            let month = 0;
            month < 12;
            month++
        ) {

            data.push({
                label:
                    new Intl.DateTimeFormat(
                        "pt-AO",
                        {
                            month: "short"
                        }
                    ).format(
                        new Date(
                            2026,
                            month,
                            1
                        )
                    ),
                value:
                    0
            });

        }


        orders.forEach(
            function (order) {

                const date =
                    new Date(
                        order.createdAt
                    );


                data[date.getMonth()].value +=
                    calculateTotal(
                        order.items
                    );

            }
        );


        return data;

    }


    function renderChart(
        orders,
        period
    ) {

        const container =
            document.getElementById(
                "reportsChart"
            );


        if (!container) {
            return;
        }


        const data =
            buildChartData(
                orders,
                period
            );


        const max =
            Math.max(
                ...data.map(
                    item => item.value
                ),
                1
            );


        container.innerHTML = "";


        data.forEach(
            function (item, index) {

                const column =
                    document.createElement(
                        "div"
                    );


                column.className =
                    "reports-chart-column";


                const bar =
                    document.createElement(
                        "div"
                    );


                bar.className =
                    "reports-chart-bar";


                const percentage =
                    item.value > 0
                        ? Math.max(
                            (
                                item.value /
                                max
                            ) * 100,
                            5
                        )
                        : 2;


                bar.style.height =
                    `${percentage}%`;


                bar.style.animationDelay =
                    `${index * 35}ms`;


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "reports-chart-label";


                label.textContent =
                    item.label;


                column.appendChild(
                    bar
                );


                column.appendChild(
                    label
                );


                container.appendChild(
                    column
                );

            }
        );

    }



    /* =====================================================
       ESTADOS DOS PEDIDOS
    ===================================================== */

    function renderStatuses(orders) {

        const container =
            document.getElementById(
                "reportsStatusList"
            );


        if (!container) {
            return;
        }


        const states = {

            new: {
                label: "Novos",
                count: 0,
                className: "new"
            },

            preparing: {
                label: "Em preparação",
                count: 0,
                className: "preparing"
            },

            ready: {
                label: "Prontos",
                count: 0,
                className: "ready"
            },

            delivered: {
                label: "Entregues",
                count: 0,
                className: "delivered"
            },

            cancelled: {
                label: "Cancelados",
                count: 0,
                className: "cancelled"
            }

        };


        orders.forEach(
            function (order) {

                const status =
                    order.status || "new";


                if (states[status]) {

                    states[status].count++;

                }

            }
        );


        container.innerHTML = "";


        Object.values(states)
            .forEach(
                function (state) {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        `reports-status-row ${state.className}`;


                    row.innerHTML = `

                        <span
                            class="reports-status-dot"
                        ></span>

                        <span
                            class="reports-status-name"
                        >
                            ${escapeHtml(
                                state.label
                            )}
                        </span>

                        <strong
                            class="reports-status-value"
                        >
                            ${state.count}
                        </strong>

                    `;


                    container.appendChild(
                        row
                    );

                }
            );

    }



    /* =====================================================
       MELHOR PERÍODO
    ===================================================== */

    function renderBestPeriod(
        orders,
        period
    ) {

        const element =
            document.getElementById(
                "financialBestPeriod"
            );


        if (!element) {
            return;
        }


        if (!orders.length) {

            element.textContent =
                "—";

            return;

        }


        const data =
            buildChartData(
                orders,
                period
            );


        const best =
            data.reduce(
                function (current, item) {

                    return (
                        item.value >
                        current.value
                    )
                        ? item
                        : current;

                },
                {
                    label: "—",
                    value: 0
                }
            );


        element.textContent =
            best.value > 0
                ? best.label
                : "—";

    }



    /* =====================================================
       TABELA
    ===================================================== */

    function renderOrdersTable(
        orders
    ) {

        const table =
            document.getElementById(
                "reportsOrdersTable"
            );


        if (!table) {
            return;
        }


        if (!orders.length) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="reports-table-empty"
                    >
                        Nenhum pedido registado
                        neste período.
                    </td>

                </tr>

            `;

            return;

        }


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


        table.innerHTML = "";


        orders
            .slice()
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                    );

                }
            )
            .slice(0, 12)
            .forEach(
                function (order) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const status =
                        order.status || "new";


                    const total =
                        calculateTotal(
                            order.items
                        );


                    const items =
                        countItems(
                            order.items
                        );


                    row.innerHTML = `

                        <td>

                            <span
                                class="report-order-id"
                            >
                                ${escapeHtml(
                                    order.id ||
                                    "#-----"
                                )}
                            </span>

                        </td>


                        <td>

                            ${formatDate(
                                order.createdAt
                            )}

                            <small>
                                ${formatTime(
                                    order.createdAt
                                )}
                            </small>

                        </td>


                        <td>
                            ${items}
                            ${items === 1
                                ? "item"
                                : "itens"}
                        </td>


                        <td>
                            <strong>
                                ${formatCurrency(
                                    total
                                )}
                            </strong>
                        </td>


                        <td>

                            <span
                                class="
                                    report-order-status
                                    ${escapeHtml(status)}
                                "
                            >
                                ${escapeHtml(
                                    statusLabels[
                                        status
                                    ] ||
                                    "Novo"
                                )}
                            </span>

                        </td>

                    `;


                    table.appendChild(
                        row
                    );

                }
            );

    }



    /* =====================================================
       RESUMO
    ===================================================== */

    function renderSummary(
        orders,
        period
    ) {

        const title =
            document.getElementById(
                "reportsSummaryTitle"
            );


        const text =
            document.getElementById(
                "reportsSummaryText"
            );


        if (!title || !text) {
            return;
        }


        const periodTitle =
            getPeriodTitle(
                period
            );


        if (!orders.length) {

            title.textContent =
                `Sem movimentação em ${periodTitle.toLowerCase()}`;


            text.textContent =
                "Ainda não existem pedidos registados neste período. "
                + "Assim que a operação começar, os dados serão "
                + "apresentados automaticamente neste relatório.";

            return;

        }


        const revenue =
            orders.reduce(
                function (total, order) {

                    return (
                        total +
                        calculateTotal(
                            order.items
                        )
                    );

                },
                0
            );


        const average =
            revenue / orders.length;


        title.textContent =
            `${orders.length} ${
                orders.length === 1
                    ? "pedido"
                    : "pedidos"
            } registados em ${periodTitle.toLowerCase()}`;


        text.textContent =
            `A faturação do período é de ${
                formatCurrency(revenue)
            }, com um ticket médio de ${
                formatCurrency(average)
            } por pedido.`;

    }



    /* =====================================================
       ATUALIZAR RELATÓRIO
    ===================================================== */

    function renderReport() {

        const allOrders =
            readOrders();


        const orders =
            filterOrdersByPeriod(
                allOrders,
                currentPeriod
            );


        const periodTitle =
            getPeriodTitle(
                currentPeriod
            );


        const titleElement =
            document.getElementById(
                "reportsPeriodTitle"
            );


        const descriptionElement =
            document.getElementById(
                "reportChartDescription"
            );


        const revenueDescription =
            document.getElementById(
                "reportRevenueDescription"
            );


        const statusElement =
            document.getElementById(
                "reportsDataStatus"
            );


        if (titleElement) {

            titleElement.textContent =
                periodTitle;

        }


        if (descriptionElement) {

            const descriptions = {

                today:
                    "Movimento financeiro ao longo do dia.",

                week:
                    "Comparação da faturação ao longo da semana.",

                month:
                    "Evolução da faturação durante o mês.",

                year:
                    "Evolução da faturação durante o ano."

            };


            descriptionElement.textContent =
                descriptions[
                    currentPeriod
                ];

        }


        if (revenueDescription) {

            revenueDescription.textContent =
                `Movimento de ${periodTitle.toLowerCase()}`;

        }


        if (statusElement) {

            statusElement.textContent =
                orders.length
                    ? "Dados atualizados"
                    : "Sem movimentação";

        }


        renderKPIs(
            orders
        );


        renderChart(
            orders,
            currentPeriod
        );


        renderStatuses(
            orders
        );


        renderBestPeriod(
            orders,
            currentPeriod
        );


        renderOrdersTable(
            orders
        );


        renderSummary(
            orders,
            currentPeriod
        );

    }



    /* =====================================================
       PERÍODOS
    ===================================================== */

    document
        .querySelectorAll(
            ".reports-period-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".reports-period-button"
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


                        currentPeriod =
                            button.dataset.period ||
                            "today";


                        renderReport();

                    }
                );

            }
        );



    /* =====================================================
       EXPORTAÇÃO
    ===================================================== */

    function exportReport() {

        const orders =
            filterOrdersByPeriod(
                readOrders(),
                currentPeriod
            );


        const revenue =
            orders.reduce(
                function (total, order) {

                    return (
                        total +
                        calculateTotal(
                            order.items
                        )
                    );

                },
                0
            );


        const average =
            orders.length
                ? revenue / orders.length
                : 0;


        const lines = [

            "AVR ADMIN — RELATÓRIO",

            `Período: ${getPeriodTitle(
                currentPeriod
            )}`,

            "",

            `Pedidos: ${orders.length}`,

            `Faturação: ${formatCurrency(
                revenue
            )}`,

            `Ticket médio: ${formatCurrency(
                average
            )}`,

            "",

            "PEDIDOS",

            ...orders.map(
                function (order) {

                    return [
                        order.id || "#-----",
                        formatDate(
                            order.createdAt
                        ),
                        formatCurrency(
                            calculateTotal(
                                order.items
                            )
                        ),
                        order.status || "new"

                    ].join(" | ");

                }
            )

        ];


        const blob =
            new Blob(
                [
                    lines.join("\n")
                ],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `avr-relatorio-${currentPeriod}.txt`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }


    document
        .getElementById(
            "reportsExportButton"
        )
        ?.addEventListener(
            "click",
            exportReport
        );



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
       CONTADORES DO MENU
    ===================================================== */

    function updateOrderCounters() {

        const orders =
            readOrders();


        const sidebarCount =
            document.getElementById(
                "sidebarOrderCount"
            );


        const bottomCount =
            document.getElementById(
                "bottomOrderCount"
            );


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
       ÚLTIMA ATUALIZAÇÃO
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
       STORAGE
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                STORAGE_KEYS.orders
                ||
                event.key ===
                STORAGE_KEYS.theme
            ) {

                renderReport();

                updateOrderCounters();

                updateLastUpdate();

            }

        }
    );



    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function initialize() {

        applyTheme(
            getStoredTheme()
        );

        renderReport();

        updateOrderCounters();

        updateLastUpdate();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }



    /* =====================================================
       API
    ===================================================== */

    window.AVRReports = {

        readOrders,

        renderReport,

        renderChart,

        openMenu,

        closeMenu,

        toggleMenu

    };


})();




/* =====================================================
   AVR ADMIN — MENU DE APARÊNCIA
===================================================== */

(function () {

    "use strict";

    const THEME_KEY = "avr-theme";

    const themeToggle =
        document.getElementById(
            "adminThemeMenuToggle"
        );

    const themeMenu =
        document.getElementById(
            "adminThemeMenu"
        );

    const themeChoices =
        document.querySelectorAll(
            "[data-theme-choice]"
        );

    const systemTheme =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    function getTheme() {

        return (
            localStorage.getItem(
                THEME_KEY
            ) || "auto"
        );

    }


    function applyTheme(theme) {

        const root =
            document.documentElement;

        let effectiveTheme =
            theme;


        if (theme === "auto") {

            effectiveTheme =
                systemTheme.matches
                    ? "dark"
                    : "light";

        }


        root.setAttribute(
            "data-theme",
            effectiveTheme
        );


        localStorage.setItem(
            THEME_KEY,
            theme
        );


        themeChoices.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.themeChoice === theme
                );

            }
        );

    }


    function openThemeMenu() {

        themeMenu?.classList.add(
            "open"
        );

        themeToggle?.setAttribute(
            "aria-expanded",
            "true"
        );

        themeMenu?.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeThemeMenu() {

        themeMenu?.classList.remove(
            "open"
        );

        themeToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        themeMenu?.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    function toggleThemeMenu() {

        if (
            themeMenu?.classList.contains(
                "open"
            )
        ) {

            closeThemeMenu();

        } else {

            openThemeMenu();

        }

    }


    themeToggle?.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleThemeMenu();

        }
    );


    themeChoices.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    applyTheme(
                        button.dataset.themeChoice
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
                !themeMenu?.contains(
                    event.target
                )
                &&
                event.target !== themeToggle
            ) {

                closeThemeMenu();

            }

        }
    );


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


    systemTheme.addEventListener(
        "change",
        function () {

            if (
                getTheme() === "auto"
            ) {

                applyTheme(
                    "auto"
                );

            }

        }
    );


    applyTheme(
        getTheme()
    );


})();