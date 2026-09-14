let budgets = [];
let budgetCategories = [];
let budgetCurrency = "USD";


async function loadBudgets() {

    budgets =
        await fetch(
            "/api/budgets"
        ).then(
            response =>
                response.json()
        );


    budgetCategories =
        await fetch(
            "/api/categories"
        ).then(
            response =>
                response.json()
        );


    const settings =
        await fetch(
            "/api/settings"
        ).then(
            response =>
                response.json()
        );


    budgetCurrency =
        settings.currency ||
        "USD";


    document.getElementById(
        "budgetCategory"
    ).innerHTML =
        budgetCategories
            .map(
                category => `
                    <option
                        value="${escapeHtml(
                            category.name
                        )}"
                    >
                        ${escapeHtml(
                            category.name
                        )}
                    </option>
                `
            )
            .join("");


    renderBudgets();

}


function renderBudgets() {

    const grid =
        document.getElementById(
            "budgetsGrid"
        );


    grid.innerHTML =
        budgets
            .map(
                budget => `

                    <article class="budget-card">

                        <div class="budget-head">

                            <span class="pill">
                                ${escapeHtml(
                                    budget.category
                                )}
                            </span>

                            <button
                                onclick="editBudget(${budget.id})"
                            >
                                Edit
                            </button>

                        </div>


                        <strong>
                            ${money(
                                budget.amount,
                                budgetCurrency
                            )}
                        </strong>


                        <small>
                            ${budget.month}/${budget.year}
                        </small>


                        <div class="budget-track">

                            <i
                                style="width:0%"
                            ></i>

                        </div>


                        <div class="budget-foot">

                            <span>
                                Monthly limit
                            </span>

                            <button
                                class="danger-text"
                                onclick="deleteBudget(${budget.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </article>

                `
            )
            .join("");


    document.getElementById(
        "budgetsEmpty"
    ).style.display =
        budgets.length
            ? "none"
            : "flex";

}


window.editBudget =
    function(id) {

        const budget =
            budgets.find(
                item =>
                    item.id === id
            );


        if (!budget) {
            return;
        }


        document.getElementById(
            "budgetId"
        ).value =
            budget.id;


        document.getElementById(
            "budgetCategory"
        ).value =
            budget.category;


        document.getElementById(
            "budgetAmount"
        ).value =
            budget.amount;


        document.getElementById(
            "budgetMonth"
        ).value =
            budget.month;


        document.getElementById(
            "budgetYear"
        ).value =
            budget.year;


        document.getElementById(
            "budgetModalTitle"
        ).textContent =
            "Edit budget";


        openModal(
            "budgetModal"
        );

    };


window.deleteBudget =
    async function(id) {

        if (
            !confirm(
                "Delete this budget?"
            )
        ) {
            return;
        }


        await fetch(
            `/api/budgets/${id}`,
            {
                method: "DELETE"
            }
        );


        await loadBudgets();

    };


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const now =
            new Date();


        document.getElementById(
            "budgetMonth"
        ).value =
            now.getMonth() + 1;


        document.getElementById(
            "budgetYear"
        ).value =
            now.getFullYear();


        document.getElementById(
            "addBudgetButton"
        ).onclick =
            () => {

                document.getElementById(
                    "budgetId"
                ).value = "";


                document.getElementById(
                    "budgetAmount"
                ).value = "";


                document.getElementById(
                    "budgetMonth"
                ).value =
                    now.getMonth() + 1;


                document.getElementById(
                    "budgetYear"
                ).value =
                    now.getFullYear();


                document.getElementById(
                    "budgetModalTitle"
                ).textContent =
                    "Add budget";


                openModal(
                    "budgetModal"
                );

            };


        document.getElementById(
            "budgetForm"
        ).onsubmit =
            async event => {

                event.preventDefault();


                const id =
                    document.getElementById(
                        "budgetId"
                    ).value;


                const response =
                    await fetch(
                        id
                            ? `/api/budgets/${id}`
                            : "/api/budgets",
                        {
                            method:
                                id
                                    ? "PUT"
                                    : "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    category:
                                        document
                                            .getElementById(
                                                "budgetCategory"
                                            )
                                            .value,

                                    amount:
                                        document
                                            .getElementById(
                                                "budgetAmount"
                                            )
                                            .value,

                                    month:
                                        document
                                            .getElementById(
                                                "budgetMonth"
                                            )
                                            .value,

                                    year:
                                        document
                                            .getElementById(
                                                "budgetYear"
                                            )
                                            .value

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    document.getElementById(
                        "budgetError"
                    ).textContent =
                        data.message ||
                        "Unable to save.";

                    return;

                }


                closeModal(
                    "budgetModal"
                );


                await loadBudgets();

            };


        loadBudgets();

    }
);