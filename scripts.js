// Graph class definition
class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
        this.vertexPositions = new Map();
        this.selectedVertex = null; // Track the selected vertex for dragging
        this.dragOffsetX = 0; // Offset for mouse position relative to vertex center
        this.dragOffsetY = 0;
    }

    addVertex(v, x, y) {
        this.AdjList.set(v, []);
        this.vertexPositions.set(v, { x: x, y: y });
    }

    addEdge(v, w) {
        if (!this.AdjList.has(v)) {
            this.addVertex(v, 0, 0); // Add vertex v if it doesn't exist
        }
        if (!this.AdjList.has(w)) {
            this.addVertex(w, 0, 0); // Add vertex w if it doesn't exist
        }
        
        this.AdjList.get(v).push(w);
        this.AdjList.get(w).push(v);
    }

    printGraph() {
        let get_keys = this.AdjList.keys();
        for (let i of get_keys) {
            let get_values = this.AdjList.get(i);
            let conc = "";
            for (let j of get_values) {
                conc += j + " ";
            }
            console.log(i + " -> " + conc);
        }
    }

    drawGraph(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas element with ID ${canvasId} not found.`);
            return;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.AdjList.forEach((adj, vertex) => {
            const { x: x1, y: y1 } = this.vertexPositions.get(vertex);
            adj.forEach(neighbor => {
                const { x: x2, y: y2 } = this.vertexPositions.get(neighbor);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });
        });

        this.vertexPositions.forEach((pos, vertex) => {
            const { x, y } = pos;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = this.selectedVertex === vertex ? 'orange' : 'white'; // Highlight selected vertex
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fillText(vertex, x - 5, y + 5);
        });

        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onMouseDown(event) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if mouse is over any vertex
        this.vertexPositions.forEach((pos, vertex) => {
            const { x, y } = pos;
            if (Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2) <= 20) { // Radius of 20 for vertex
                this.selectedVertex = vertex;
                this.dragOffsetX = mouseX - x;
                this.dragOffsetY = mouseY - y;
            }
        });
    }

    onMouseMove(event) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.selectedVertex !== null) {
            this.vertexPositions.set(this.selectedVertex, { x: mouseX - this.dragOffsetX, y: mouseY - this.dragOffsetY });
            this.drawGraph(canvas.id);
        }
    }

    onMouseUp(event) {
        this.selectedVertex = null;
    }
}

// Initialize graph with initial vertices
let vertCount = 7;
let g = new Graph(vertCount);
let vertices = [
    { label: 'A', x: 100, y: 100 },
    { label: 'B', x: 200, y: 100 },
    { label: 'C', x: 300, y: 200 },
    { label: 'D', x: 100, y: 200 },
    { label: 'E', x: 200, y: 300 },
    { label: 'F', x: 300, y: 400 },
    { label: 'G', x: 400, y: 450 }
];

// Adding initial vertices and edges
vertices.forEach(vertex => {
    g.addVertex(vertex.label, vertex.x, vertex.y);
});

g.addEdge('A', 'B');
g.addEdge('A', 'D');
g.addEdge('B', 'C');
g.addEdge('D', 'E');
g.addEdge('E', 'F');
g.addEdge('F', 'G');

// Function to update the graph with new vertices
function updateGraph(count) {
    g = new Graph(count);
    vertices.forEach(vertex => {
        g.addVertex(vertex.label, vertex.x, vertex.y);
    });
    
    // Re-add initial edges (assuming this is necessary based on your logic)
    g.addEdge('A', 'B');
    g.addEdge('A', 'D');
    g.addEdge('B', 'C');
    g.addEdge('D', 'E');
    g.addEdge('E', 'F');
    g.addEdge('F', 'G');

    // Draw the updated graph
    g.drawGraph('graph');
}

// Function to update vertex count and vertices list
function updateVertCountAndVertices() {
    try {
        // Calculate the new label for the vertex (ASCII A is 65)
        let currentLabel = String.fromCharCode(65 + vertices.length); // Assuming you start with Anchor
		  let previousLabel = String.fromCharCode(65 + vertices.length -1)

        vertCount += 1;
        vertices.push({ label: currentLabel, x: Math.random() * 1000, y: Math.random() * 1000 });

        // Add the new vertex to the graph
        g.addVertex(currentLabel, vertices[vertices.length - 1].x, vertices[vertices.length - 1].y);

        // Add edge between currentLabel and previousLabel if vertices.length > 1
        if (vertices.length > 1) {
            let previousLabel = String.fromCharCode(65 + vertices.length - 2); // Get label of the previous vertex

            // Check if previousLabel exists in the graph
            if (g.AdjList.has(previousLabel)) {
                g.addEdge(currentLabel, previousLabel);
            } else {
                console.warn(`Vertex ${previousLabel} does not exist.`);
						alert('label not in list')
            }
        } else {
            alert('List too short'); // Alert if there are not enough vertices to create an edge
        }

        updateGraph(vertCount); // Update the graph with the new vertex and edge
			alert(previousLabel)
			g.addEdge("A", "F");
			updateGraph(vertCount);
    } catch (error) {
        console.error('Error updating vertices:', error);
        alert(error); // Handle errors, such as unexpected exceptions
    }
}

updateGraph(vertCount); // Initial draw of the graph