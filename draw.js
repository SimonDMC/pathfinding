const tableSize = 64;

export const inputGrid = Array(tableSize)
    .fill()
    .map(() => Array(tableSize).fill(1));

// generate table
document.querySelector("#table-wrap").innerHTML = `
    <table>
        ${Array(tableSize)
            .fill()
            .map(
                (_, y) => `
            <tr>
                ${Array(tableSize)
                    .fill()
                    .map(
                        (_, x) => `
                    <td></td>
                `
                    )
                    .join("")}
            </tr>
        `
            )
            .join("")}
    </table>
`;

// set first and last cell to start and end
document
    .querySelector("table tr:nth-child(32) td:nth-child(32)")
    .classList.add("start-cell");
document
    .querySelector("table tr:last-child td:last-child")
    .classList.add("end-cell");

// toggle draw mode
let isMouseDown = false;

document.addEventListener("mousedown", () => {
    isMouseDown = true;
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

// paint walls
document.querySelectorAll("td").forEach((td, i) => {
    td.addEventListener("mouseover", () => {
        if (isMouseDown) fill();
    });

    td.addEventListener("mousedown", fill);

    function fill() {
        const x = i % tableSize;
        const y = Math.floor(i / tableSize);

        if (inputGrid[y][x] === 1) {
            inputGrid[y][x] = 0;
            td.classList.add("wall");
        } else {
            inputGrid[y][x] = 1;
            td.classList.remove("wall");
        }
    }
});

// clear walls
document.querySelector("#clear").addEventListener("click", () => {
    document.querySelectorAll("td").forEach((td, i) => {
        const x = i % tableSize;
        const y = Math.floor(i / tableSize);

        inputGrid[y][x] = 1;
        td.classList.remove("wall");
    });
});
