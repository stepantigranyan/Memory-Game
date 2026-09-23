import { MODES } from "../consts/const.js";

class ModeButton {
    constructor(id, rows, columns) {
        this.id = id;
        this.rows = rows;
        this.columns = columns;

        this.element = this._create(id, rows, columns);
    }

    _create(id, rows, columns) {
        const label =  document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add(
            "cursor-pointer",
            "px-5",
            "py-2",
            "bg-rose-100",
            "border",
            "border-rose-400",
            "text-cyan-900",
            "rounded-xl",
            "has-checked:bg-rose-800",
            "has-checked:text-white",
        );
        label.innerText = `${rows} X ${columns}`;

        const input = document.createElement("input");
        input.setAttribute("id", id);
        input.setAttribute("type", "radio");
        input.setAttribute("name", 'modes');
        input.classList.add("hidden");

        label.append(input);

        return label;
    }

    addClick(fn) {
        this.element.addEventListener("click", fn);
    }

    getElement() {
        return this.element;
    }
}

const allModeButtons = MODES.map(({id, rows, columns}) => new ModeButton(id, rows, columns));

export default allModeButtons;