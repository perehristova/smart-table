import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — расширение таблицы
    // Обработка массива before (в обратном порядке)
    if (before && Array.isArray(before)) {
        before.slice().reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.insertBefore(root[subName].container, root.container.firstChild);
        });
    }

    // Обработка массива after (в обычном порядке)
    if (after && Array.isArray(after)) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.appendChild(root[subName].container);
        });
    }


    // @todo: #1.3 — добавляем обработчики событий
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0); // задержка 0, чтобы вызвать после сброса формы
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            // Перебираем ключи объекта item
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });
        // Очистить текущие строки
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}