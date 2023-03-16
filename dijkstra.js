import { inputGrid } from "./draw.js";

const width = document.querySelector("table tbody").children[0].children.length;
const height = document.querySelector("table tbody").children.length;

const start = [31, 31];
const end = [height - 1, width - 1];

/* Dijkstra's algorithm */

class Node {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.visited = false;
        this.previous = null;
        this.distance = Infinity;
    }
}

// start button
document
    .querySelector("#start-dijkstra")
    .addEventListener("click", async () => {
        const animate = document.querySelector("#animate").checked;

        // save start time
        const timestamp = window.performance.now();

        // create node grid
        const nodeGrid = Array(height)
            .fill()
            .map((_, y) =>
                Array(width)
                    .fill()
                    .map((_, x) => new Node(x, y, inputGrid[y][x]))
            );

        // set start node distance to 0
        nodeGrid[start[0]][start[1]].distance = 0;

        // create queue
        const queue = [];

        // add start node to queue
        queue.push(nodeGrid[start[0]][start[1]]);

        while (queue.length > 0) {
            // get first node in queue
            const node = queue.shift();

            // if node is not visited
            if (!node.visited) {
                // mark node as visited
                node.visited = true;

                if (animate) {
                    document
                        .querySelector(
                            `table tr:nth-child(${node.y + 1}) :nth-child(${
                                node.x + 1
                            })`
                        )
                        .classList.add("visited");

                    // wait a bit
                    await new Promise((resolve) => setTimeout(resolve, 10));
                }

                // if node is the end node
                if (node.x === end[1] && node.y === end[0]) {
                    break;
                }

                // get all adjacent nodes
                const adjacentNodes = [
                    node.y == 0 ? undefined : nodeGrid[node.y - 1][node.x],
                    node.x == width - 1
                        ? undefined
                        : nodeGrid[node.y][node.x + 1],
                    node.y == height - 1
                        ? undefined
                        : nodeGrid[node.y + 1][node.x],
                    node.x == 0 ? undefined : nodeGrid[node.y][node.x - 1],
                ];

                // for each adjacent node
                for (const adjacentNode of adjacentNodes) {
                    // if adjacent node exists, is not visited and is not a wall
                    if (
                        adjacentNode &&
                        !adjacentNode.visited &&
                        adjacentNode.value !== 0
                    ) {
                        // if distance to adjacent node is less than current distance
                        if (node.distance + 1 < adjacentNode.distance) {
                            // update adjacent node distance
                            adjacentNode.distance = node.distance + 1;

                            // update adjacent node previous
                            adjacentNode.previous = node;
                        }

                        // add adjacent node to queue
                        queue.push(adjacentNode);
                    }
                }
            }
        }

        const path = [];

        // add end node to path
        path.push(nodeGrid[end[0]][end[1]]);

        // create path
        while (path.length > 0) {
            // get last node in path
            const node = path[path.length - 1];

            // if node has previous
            if (node.previous) {
                // add previous node to path
                path.push(node.previous);
            } else {
                // first node in path has been reached (start)
                break;
            }
        }

        // log time taken
        const timeTaken = window.performance.now() - timestamp;
        document.querySelector("#time").innerHTML = `Time taken: ${
            Math.round(timeTaken * 1000) / 1000
        }ms`;

        // clear visited canvas
        document.querySelectorAll(".visited").forEach((node) => {
            node.classList.remove("visited");
        });

        // paint path
        path.forEach((node) => {
            document
                .querySelector(
                    `table tr:nth-child(${node.y + 1}) :nth-child(${
                        node.x + 1
                    })`
                )
                .classList.add("path");
        });
    });

// restart button
document.querySelector("#restart").addEventListener("click", () => {
    // clear path canvas
    document.querySelectorAll(".path").forEach((node) => {
        node.classList.remove("path");
    });
});
