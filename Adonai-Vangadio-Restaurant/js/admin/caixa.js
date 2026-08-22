/* =========================================================
   AVR ADMIN
   caixa.js
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEYS = {

        orders:
            "avr-orders",

        transactions:
            "avr-cash-transactions",

        theme:
            "avr-theme",

        adminSession:
            "avr-admin-session"

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

    const themeMenu =
        document.getElementById(
            "adminThemeMenu"
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

        sidebar.classList.add(
            "open"
        );

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

                closeThemeMenu();

            }

        }
    );


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

    function getStoredTheme() {

        return (
            localStorage.getItem(
                STORAGE_KEYS.theme
            )
            || "auto"
        );

    }


    function applyTheme(theme) {

        const root =
            document.documentElement;


        if (
            theme === "dark"
        ) {

            root.setAttribute(
                "data-theme",
                "dark"
            );

        } else if (
            theme === "light"
        ) {

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


        updateThemeLabel(
            theme
        );

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
            labels[theme]
            || "Automático";

    }


    function closeThemeMenu() {

        if (!themeMenu) {
            return;
        }

        themeMenu.classList.remove(
            "open"
        );

        themeButton?.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function toggleThemeMenu(event) {

        if (event) {
            event.stopPropagation();
        }


        if (!themeMenu) {

            cycleTheme();

            return;

        }


        const isOpen =
            themeMenu.classList.contains(
                "open"
            );


        if (isOpen) {

            closeThemeMenu();

        } else {

            themeMenu.classList.add(
                "open"
            );

            themeButton?.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function cycleTheme() {

        const current =
            getStoredTheme();


        const nextTheme = {

            auto:
                "light",

            light:
                "dark",

            dark:
                "auto"

        }[current]
        || "auto";


        applyTheme(
            nextTheme
        );

    }


    themeButton?.addEventListener(
        "click",
        toggleThemeMenu
    );


    themeMenuButton?.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeMenu();

            toggleThemeMenu();

        }
    );


    if (themeMenu) {

        themeMenu
            .querySelectorAll(
                "[data-theme-option]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const theme =
                                button.getAttribute(
                                    "data-theme-option"
                                );


                            if (
                                theme === "auto"
                                ||
                                theme === "light"
                                ||
                                theme === "dark"
                            ) {

                                applyTheme(
                                    theme
                                );

                            }


                            closeThemeMenu();

                        }
                    );

                }
            );

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                themeMenu
                &&
                !themeMenu.contains(
                    event.target
                )
                &&
                !themeButton?.contains(
                    event.target
                )
            ) {

                closeThemeMenu();

            }

        }
    );


    applyTheme(
        getStoredTheme()
    );


    /* =====================================================
       DATA ATUAL
    ===================================================== */

    function updateCurrentDate() {

        const element =
            document.getElementById(
                "cashCurrentDate"
            );


        if (!element) {
            return;
        }


        const formatter =
            new Intl.DateTimeFormat(
                "pt-AO",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );


        const value =
            formatter.format(
                new Date()
            );


        element.textContent =
            value.charAt(0).toUpperCase()
            + value.slice(1);

    }


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function formatCurrency(value) {

        const number =
            Number(value) || 0;


        return (
            new Intl.NumberFormat(
                "pt-AO"
            ).format(number)
            + " Kz"
        );

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


    function escapeHtml(value) {

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
                "AVR Caixa: erro ao ler pedidos.",
                error
            );

            return [];

        }

    }


    function calculateOrderTotal(items) {

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
                        item?.price
                    ) || 0;


                const quantity =
                    Number(
                        item?.quantity
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
       TRANSAÇÕES DO CAIXA
    ===================================================== */

    function readTransactions() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEYS.transactions
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
                "AVR Caixa: erro ao ler movimentos.",
                error
            );

            return [];

        }

    }


    function saveTransactions(
        transactions
    ) {

        localStorage.setItem(
            STORAGE_KEYS.transactions,
            JSON.stringify(
                transactions
            )
        );

    }


    /* =====================================================
       CRIAR MOVIMENTOS A PARTIR DOS PEDIDOS
    ===================================================== */

    function syncPaidOrders() {

        const orders =
            readOrders();


        const transactions =
            readTransactions();


        let changed =
            false;


        orders.forEach(
            function (order) {

                if (
                    order.status !==
                    "delivered"
                ) {

                    return;

                }


                const orderId =
                    order.id
                    || (
                        "#"
                        + Date.now()
                    );


                const exists =
                    transactions.some(
                        function (transaction) {

                            return (
                                transaction.orderId ===
                                orderId
                            );

                        }
                    );


                if (exists) {
                    return;
                }


                transactions.push({

                    id:
                        "cash-"
                        + Date.now()
                        + "-"
                        + Math.random()
                            .toString(36)
                            .slice(2, 7),

                    orderId:
                        orderId,

                    type:
                        "income",

                    category:
                        "Pedido",

                    method:
                        order.paymentMethod
                        || "cash",

                    description:
                        "Pagamento do pedido "
                        + orderId,

                    amount:
                        calculateOrderTotal(
                            order.items
                        ),

                    createdAt:
                        order.createdAt
                        || new Date().toISOString()

                });


                changed =
                    true;

            }
        );


        if (changed) {

            saveTransactions(
                transactions
            );

        }


        return transactions;

    }


    /* =====================================================
       FILTRO DE DATA
    ===================================================== */

    function isToday(date) {

        const target =
            new Date(date);

        const now =
            new Date();


        return (
            target.getDate()
                === now.getDate()
            &&
            target.getMonth()
                === now.getMonth()
            &&
            target.getFullYear()
                === now.getFullYear()
        );

    }


    function getTodayTransactions() {

        return syncPaidOrders()
            .filter(
                function (transaction) {

                    return isToday(
                        transaction.createdAt
                    );

                }
            );

    }


    /* =====================================================
       CÁLCULOS
    ===================================================== */

    function calculateCashData() {

        const transactions =
            getTodayTransactions();


        let income =
            0;


        let expenses =
            0;


        transactions.forEach(
            function (transaction) {

                const amount =
                    Number(
                        transaction.amount
                    ) || 0;


                if (
                    transaction.type ===
                    "expense"
                ) {

                    expenses +=
                        amount;

                } else {

                    income +=
                        amount;

                }

            }
        );


        const balance =
            income - expenses;


        const paidOrders =
            transactions.filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "income"
                    );

                }
            ).length;


        return {

            income,

            expenses,

            balance,

            paidOrders,

            transactions

        };

    }


    /* =====================================================
       ESTATÍSTICAS PRINCIPAIS
    ===================================================== */

    function renderStatistics() {

        const data =
            calculateCashData();


        const balance =
            document.getElementById(
                "cashBalance"
            );


        const income =
            document.getElementById(
                "cashIncome"
            );


        const expenses =
            document.getElementById(
                "cashExpenses"
            );


        const paidOrders =
            document.getElementById(
                "cashPaidOrders"
            );


        if (balance) {

            balance.textContent =
                formatCurrency(
                    data.balance
                );

        }


        if (income) {

            income.textContent =
                formatCurrency(
                    data.income
                );

        }


        if (expenses) {

            expenses.textContent =
                formatCurrency(
                    data.expenses
                );

        }


        if (paidOrders) {

            paidOrders.textContent =
                data.paidOrders;

        }


        renderCashStatus(
            data
        );

    }


    /* =====================================================
       ESTADO DO CAIXA
    ===================================================== */

    function renderCashStatus(data) {

        const status =
            document.getElementById(
                "cashStatus"
            );


        if (!status) {
            return;
        }


        if (
            data.balance > 0
        ) {

            status.textContent =
                "Caixa positivo";

            status.className =
                "cash-status-badge positive";

        } else if (
            data.balance < 0
        ) {

            status.textContent =
                "Saldo negativo";

            status.className =
                "cash-status-badge negative";

        } else {

            status.textContent =
                "Sem movimentação";

            status.className =
                "cash-status-badge neutral";

        }

    }


    /* =====================================================
       MÉTODOS DE PAGAMENTO
    ===================================================== */

    function renderPaymentMethods() {

        const transactions =
            getTodayTransactions()
                .filter(
                    function (transaction) {

                        return (
                            transaction.type ===
                            "income"
                        );

                    }
                );


        const totals = {

            cash:
                0,

            card:
                0,

            transfer:
                0

        };


        let total =
            0;


        transactions.forEach(
            function (transaction) {

                const amount =
                    Number(
                        transaction.amount
                    ) || 0;


                let method =
                    String(
                        transaction.method
                        || "cash"
                    ).toLowerCase();


                if (
                    method === "dinheiro"
                    ||
                    method === "cash"
                ) {

                    method =
                        "cash";

                } else if (
                    method === "cartao"
                    ||
                    method === "cartão"
                    ||
                    method === "card"
                ) {

                    method =
                        "card";

                } else {

                    method =
                        "transfer";

                }


                totals[method] +=
                    amount;


                total +=
                    amount;

            }
        );


        const methods = [

            [
                "cash",
                "methodCash",
                "methodCashPercent"
            ],

            [
                "card",
                "methodCard",
                "methodCardPercent"
            ],

            [
                "transfer",
                "methodTransfer",
                "methodTransferPercent"
            ]

        ];


        methods.forEach(
            function (
                [
                    method,
                    valueId,
                    percentId
                ]
            ) {

                const valueElement =
                    document.getElementById(
                        valueId
                    );


                const percentElement =
                    document.getElementById(
                        percentId
                    );


                const value =
                    totals[method];


                const percentage =
                    total > 0
                        ? (
                            value
                            / total
                        ) * 100
                        : 0;


                if (valueElement) {

                    valueElement.textContent =
                        formatCurrency(
                            value
                        );

                }


                if (percentElement) {

                    percentElement.textContent =
                        Math.round(
                            percentage
                        )
                        + "%";

                }

            }
        );

    }


    /* =====================================================
       GRÁFICO
    ===================================================== */

    function renderChart() {

        const chart =
            document.getElementById(
                "cashChart"
            );


        if (!chart) {
            return;
        }


        const transactions =
            getTodayTransactions();


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


        transactions.forEach(
            function (transaction) {

                if (
                    transaction.type !==
                    "income"
                ) {

                    return;

                }


                const date =
                    new Date(
                        transaction.createdAt
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
                        Number(
                            transaction.amount
                        ) || 0;

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


        chart.innerHTML = "";


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

                const bar =
                    document.createElement(
                        "div"
                    );


                bar.className =
                    "cash-chart-bar";


                bar.style.setProperty(
                    "--cash-bar-height",
                    `${Math.max(
                        value > 0
                            ? (
                                value
                                / max
                            ) * 90
                            : 3,
                        3
                    )}%`
                );


                bar.style.animationDelay =
                    `${index * 35}ms`;


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "cash-chart-bar-label";


                label.textContent =
                    hour + "h";


                bar.appendChild(
                    label
                );


                chart.appendChild(
                    bar
                );

            }
        );

    }


    /* =====================================================
       TABELA DE MOVIMENTOS
    ===================================================== */

    function renderTransactions() {

        const table =
            document.getElementById(
                "cashTransactionsTable"
            );


        if (!table) {
            return;
        }


        const transactions =
            getTodayTransactions()
                .sort(
                    function (
                        a,
                        b
                    ) {

                        return (
                            new Date(
                                b.createdAt
                            )
                            -
                            new Date(
                                a.createdAt
                            )
                        );

                    }
                );


        const count =
            document.getElementById(
                "cashMovementCount"
            );


        if (count) {

            count.textContent =
                transactions.length
                + (
                    transactions.length === 1
                        ? " movimento"
                        : " movimentos"
                );

        }


        if (!transactions.length) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="cash-table-empty"
                    >
                        Nenhuma movimentação
                        registada hoje.
                    </td>

                </tr>

            `;

            return;

        }


        table.innerHTML = "";


        transactions.forEach(
            function (transaction) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const isExpense =
                    transaction.type ===
                    "expense";


                const amount =
                    Number(
                        transaction.amount
                    ) || 0;


                row.innerHTML = `

                    <td>
                        <strong>
                            ${escapeHtml(
                                transaction.description
                                || "Movimento de caixa"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${formatTime(
                            transaction.createdAt
                        )}
                    </td>

                    <td>
                        <span class="cash-type ${
                            isExpense
                                ? "expense"
                                : "income"
                        }">
                            ${
                                isExpense
                                    ? "Saída"
                                    : "Entrada"
                            }
                        </span>
                    </td>

                    <td>
                        ${
                            escapeHtml(
                                transaction.method
                                || "Dinheiro"
                            )
                        }
                    </td>

                    <td class="cash-value ${
                        isExpense
                            ? "expense"
                            : "income"
                    }">
                        ${
                            isExpense
                                ? "- "
                                : "+ "
                        }${formatCurrency(amount)}
                    </td>

                `;


                table.appendChild(
                    row
                );

            }
        );

    }


    /* =====================================================
       RESUMO DE FECHAMENTO
    ===================================================== */

    function renderClosing() {

        const data =
            calculateCashData();


        const text =
            document.getElementById(
                "cashClosingText"
            );


        const balance =
            document.getElementById(
                "cashClosingBalance"
            );


        if (balance) {

            balance.textContent =
                formatCurrency(
                    data.balance
                );

        }


        if (text) {

            if (
                data.transactions.length
            ) {

                text.textContent =
                    "O caixa apresenta "
                    + formatCurrency(
                        data.balance
                    )
                    + " de saldo acumulado "
                    + "no período de hoje.";

            } else {

                text.textContent =
                    "Ainda não existem movimentos "
                    + "registados para o caixa de hoje.";

            }

        }

    }


    /* =====================================================
       ADICIONAR MOVIMENTO
    ===================================================== */

    function addMovement() {

        const amountInput =
            window.prompt(
                "Valor do movimento em Kz:"
            );


        if (
            amountInput === null
        ) {

            return;

        }


        const amount =
            Number(
                amountInput
                    .replace(
                        /[^\d.,-]/g,
                        ""
                    )
                    .replace(
                        /\./g,
                        ""
                    )
                    .replace(
                        ",",
                        "."
                    )
            );


        if (
            !Number.isFinite(amount)
            ||
            amount <= 0
        ) {

            window.alert(
                "Introduza um valor válido."
            );

            return;

        }


        const description =
            window.prompt(
                "Descrição do movimento:",
                "Entrada de caixa"
            );


        if (
            description === null
        ) {

            return;

        }


        const transactions =
            readTransactions();


        transactions.push({

            id:
                "cash-"
                + Date.now(),

            orderId:
                null,

            type:
                "income",

            category:
                "Manual",

            method:
                "cash",

            description:
                description.trim()
                || "Entrada de caixa",

            amount:
                amount,

            createdAt:
                new Date().toISOString()

        });


        saveTransactions(
            transactions
        );


        refreshAll();

    }


    /* =====================================================
       FECHAMENTO
    ===================================================== */

    function closeCashRegister() {

        const data =
            calculateCashData();


        const confirmed =
            window.confirm(
                "Deseja fechar o caixa de hoje?\n\n"
                + "Saldo: "
                + formatCurrency(
                    data.balance
                )
            );


        if (!confirmed) {
            return;
        }


        const button =
            document.getElementById(
                "cashClosingButton"
            );


        if (button) {

            button.textContent =
                "Caixa fechado";

            button.disabled =
                true;

            button.classList.add(
                "closed"
            );

        }


        const text =
            document.getElementById(
                "cashClosingText"
            );


        if (text) {

            text.textContent =
                "O caixa de hoje foi marcado "
                + "como fechado.";

        }

    }


    /* =====================================================
       BOTÕES
    ===================================================== */

    document
        .getElementById(
            "cashAddButton"
        )
        ?.addEventListener(
            "click",
            addMovement
        );


    document
        .getElementById(
            "cashClosingButton"
        )
        ?.addEventListener(
            "click",
            closeCashRegister
        );


    /* =====================================================
       FILTROS
    ===================================================== */

    document
        .querySelectorAll(
            ".cash-filters button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".cash-filters button"
                            )
                            .forEach(
                                function (
                                    item
                                ) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        refreshAll();

                    }
                );

            }
        );


    /* =====================================================
       ATUALIZAÇÃO GERAL
    ===================================================== */

    function refreshAll() {

        syncPaidOrders();

        updateCurrentDate();

        renderStatistics();

        renderPaymentMethods();

        renderChart();

        renderTransactions();

        renderClosing();

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
       INICIALIZAÇÃO
    ===================================================== */

    function initialize() {

        refreshAll();

        updateLastUpdate();

    }


    /* =====================================================
       ATUALIZAÇÃO ENTRE ABAS
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                    STORAGE_KEYS.orders
                ||
                event.key ===
                    STORAGE_KEYS.transactions
                ||
                event.key ===
                    STORAGE_KEYS.theme
            ) {

                refreshAll();

                updateLastUpdate();

            }

        }
    );


    /* =====================================================
       API PÚBLICA
    ===================================================== */

    window.AVRCash = {

        readOrders,

        readTransactions,

        calculateCashData,

        refreshAll,

        renderStatistics,

        renderPaymentMethods,

        renderChart,

        renderTransactions,

        renderClosing

    };


    /* =====================================================
       DOM READY
    ===================================================== */

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


})();
