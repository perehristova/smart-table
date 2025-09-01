import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        // Инициализация sortModes, если еще не создано
        if (!state.sortModes) {
            state.sortModes = {};
        }

        if (action && action.name === 'sort') {
            // @todo: #3.1 — ротируем значение кнопки
            action.dataset.value = sortMap[action.dataset.value]; // Переключение состояния

            // Запоминаем поле, по которому сортируем
            field = action.dataset.field;
            // Устанавливаем направление сортировки из dataset
            order = action.dataset.value;

            // Обновляем состояние сортировки для этой колонки
            state.sortModes = {
                ...state.sortModes,
                [field]: order
            };

            // @todo: #3.2 — сброс остальных кнопок
            columns.forEach(column => {
                if (column.dataset.field !== field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // #3.3 — получаем текущий активный сортирующий столбец
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // Применяем сортировку, если есть активный режим
        if (field && order && order !== 'none') {
            data = sortCollection(data, field, order);
        } else {
            // Если сортировка не активна, возвращаем исходные данные
            // Можно оставить так, чтобы не менять порядок
            // или явно вызвать сортировку без сортировки
            // Но лучше оставить как есть
        }

        // Обновляем визуальные индикаторы сортировки
        columns.forEach(column => {
            if (column.dataset.value !== 'none') {
                field = column.dataset.field;
                order = column.dataset.value;
            }
        });

        return data;
    }
}