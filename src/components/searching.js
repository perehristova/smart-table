// Импортируем необходимые функции и правила из библиотеки compare.js
import {rules, createComparison} from "../lib/compare.js";

/**
 * Инициализация фильтра поиска по нескольким полям.
 * @param {string} searchField - имя поля поиска, например 'search'
 * @returns {function} - функция фильтрации данных по поисковому запросу
 */
export function initSearching(searchField) {
    // Создаем компаратор для сравнения строк (чувствителен к включению подстроки)
    const searchComparator = createComparison(
        (a, b) => a.includes(b),
        { skipEmptyTargetValues: true } // пропускать пустые значения поиска
    );

    // Создаем правило поиска по нескольким полям
    const searchRules = rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false);

    /**
     * Функция фильтрации данных по поисковому запросу
     * @param {Array} data - массив данных для фильтрации
     * @param {Object} state - состояние, содержащие фильтры
     * @param {Object} action - действие (не используется здесь)
     * @returns {Array} - отфильтрованный массив данных
     */
    return (data, state, action) => {
        // Получаем значение поиска из фильтров по имени searchField
        const searchValue = state.filters?.[searchField] ?? '';

        // Если поисковый запрос пустой, возвращаем исходные данные
        if (!searchValue) {
            return data;
        }

        // Фильтруем данные, проверяя каждое поле
        return data.filter(item => {
            // Проверяем каждое из полей: date, customer, seller
            return ['date', 'customer', 'seller'].some(field => {
                const fieldValue = item[field]?.toString().toLowerCase() ?? '';
                // Сравниваем значение поля с поисковым запросом
                return searchComparator(fieldValue, searchValue.toLowerCase());
            });
        });
    }
}