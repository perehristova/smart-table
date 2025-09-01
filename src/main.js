import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение
import {initPagination} from './components/pagination.js';
import {initSorting} from './components/sorting.js';


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);                // номер страницы по умолчанию 1 и тоже число

    return {                                            // расширьте существующий return вот так
        ...state,
        rowsPerPage,
        page
    };  
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
    result = applySorting(result, state, action);
    result = applyFiltering(result, state, action);
    result = searchFilter(result, state, action); // добавляем фильтр поиска
    result = applyPagination(result, state, action);
    // Вызов фильтрации

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация компонентов
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// Инициализация поиска
const searchFieldName = 'search'; // имя поля поиска, совпадает с data-name в шаблоне
const searchFilter = initSearching(searchFieldName);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();

// ggg 

