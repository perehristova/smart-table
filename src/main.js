import {
    data as sourceData
} from "./data/dataset_1.js";
import {
    initData
} from "./data.js";
import {
    processFormData
} from "./lib/utils.js";

import {
    initTable
} from "./components/table.js";
import {
    initPagination
} from "./components/pagination.js";
import {
    initSorting
} from "./components/sorting.js";
import {
    initFiltering
} from "./components/filtering.js";
import {
    initSearching
} from "./components/searching.js";

const api = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action); // обновляем query

    const {
        total,
        items
    } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items);
}

const sampleTable = initTable({
        tableTemplate: "table",
        rowTemplate: "row",
        before: ["search", "header", "filter"],
        after: ["pagination"],
    },
    render
);

const applySearching = initSearching("search");
const {
    applyFiltering,
    updateIndexes
} = initFiltering(
    sampleTable.filter.elements
);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal,
]);

//Переходим к внедрению в main.js. Изменим инициализацию пагинации так:
const {
    applyPagination,
    updatePagination
} = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector("input");
        const label = el.querySelector("span");
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers,
    });
}

init().then(() => render());
