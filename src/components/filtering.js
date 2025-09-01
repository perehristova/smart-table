import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
// Создаем компаратор с правилами
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes) // Получаем ключи из объекта indexes
        .forEach((elementName) => { // Перебираем по именам
            // В каждый элемент добавляем опции
            elements[elementName].append(
                ...Object.values(indexes[elementName]) // формируем массив имён
                    .map(name => {
                        // @todo: создать и вернуть тег опции
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            );
        });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.type === 'click' && action.target && action.target.name === 'clear') {
            // Найти кнопку и input рядом с ней
            const button = action.target;
            const parent = button.parentElement; // Родительский элемент кнопки
            const input = parent.querySelector(`input[data-field="${button.dataset.field}"]`);
            if (input) {
                input.value = '';
                // Обновляем состояние фильтра
                if (state.hasOwnProperty(button.dataset.field)) {
                    state[button.dataset.field] = '';
                }
            }
        }

        // @todo: #4.3 — настроить компаратор
        // Создаем или обновляем сравнение при изменении фильтра
        // В данном случае, compare уже создан, и мы его используем для фильтрации

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}