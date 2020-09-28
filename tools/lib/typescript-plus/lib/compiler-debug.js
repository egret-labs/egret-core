"use strict";
/// <reference lib="es2019" />
/* @internal */
var Debug;
(function (Debug) {
    let FlowFlags;
    let getSourceFileOfNode;
    let getSourceTextOfNodeFromSourceFile;
    let isDefaultClause;
    function init(ts) {
        FlowFlags = ts.FlowFlags;
        getSourceFileOfNode = ts.getSourceFileOfNode;
        getSourceTextOfNodeFromSourceFile = ts.getSourceTextOfNodeFromSourceFile;
        isDefaultClause = ts.isDefaultClause;
    }
    Debug.init = init;
    let nextDebugFlowId = -1;
    function getDebugFlowNodeId(f) {
        if (!f.id) {
            f.id = nextDebugFlowId;
            nextDebugFlowId--;
        }
        return f.id;
    }
    function formatControlFlowGraph(flowNode) {
        let BoxCharacter;
        (function (BoxCharacter) {
            BoxCharacter["lr"] = "\u2500";
            BoxCharacter["ud"] = "\u2502";
            BoxCharacter["dr"] = "\u256D";
            BoxCharacter["dl"] = "\u256E";
            BoxCharacter["ul"] = "\u256F";
            BoxCharacter["ur"] = "\u2570";
            BoxCharacter["udr"] = "\u251C";
            BoxCharacter["udl"] = "\u2524";
            BoxCharacter["dlr"] = "\u252C";
            BoxCharacter["ulr"] = "\u2534";
            BoxCharacter["udlr"] = "\u256B";
        })(BoxCharacter || (BoxCharacter = {}));
        let Connection;
        (function (Connection) {
            Connection[Connection["Up"] = 1] = "Up";
            Connection[Connection["Down"] = 2] = "Down";
            Connection[Connection["Left"] = 4] = "Left";
            Connection[Connection["Right"] = 8] = "Right";
            Connection[Connection["UpDown"] = 3] = "UpDown";
            Connection[Connection["LeftRight"] = 12] = "LeftRight";
            Connection[Connection["UpLeft"] = 5] = "UpLeft";
            Connection[Connection["UpRight"] = 9] = "UpRight";
            Connection[Connection["DownLeft"] = 6] = "DownLeft";
            Connection[Connection["DownRight"] = 10] = "DownRight";
            Connection[Connection["UpDownLeft"] = 7] = "UpDownLeft";
            Connection[Connection["UpDownRight"] = 11] = "UpDownRight";
            Connection[Connection["UpLeftRight"] = 13] = "UpLeftRight";
            Connection[Connection["DownLeftRight"] = 14] = "DownLeftRight";
            Connection[Connection["UpDownLeftRight"] = 15] = "UpDownLeftRight";
            Connection[Connection["NoChildren"] = 16] = "NoChildren";
        })(Connection || (Connection = {}));
        const hasAntecedentFlags = FlowFlags.Assignment |
            FlowFlags.Condition |
            FlowFlags.SwitchClause |
            FlowFlags.ArrayMutation |
            FlowFlags.Call |
            FlowFlags.ReduceLabel;
        const hasNodeFlags = FlowFlags.Start |
            FlowFlags.Assignment |
            FlowFlags.Call |
            FlowFlags.Condition |
            FlowFlags.ArrayMutation;
        const links = Object.create(/*o*/ null); // eslint-disable-line no-null/no-null
        const nodes = [];
        const edges = [];
        const root = buildGraphNode(flowNode, new Set());
        for (const node of nodes) {
            node.text = renderFlowNode(node.flowNode, node.circular);
            computeLevel(node);
        }
        const height = computeHeight(root);
        const columnWidths = computeColumnWidths(height);
        computeLanes(root, 0);
        return renderGraph();
        function isFlowSwitchClause(f) {
            return !!(f.flags & FlowFlags.SwitchClause);
        }
        function hasAntecedents(f) {
            return !!(f.flags & FlowFlags.Label) && !!f.antecedents;
        }
        function hasAntecedent(f) {
            return !!(f.flags & hasAntecedentFlags);
        }
        function hasNode(f) {
            return !!(f.flags & hasNodeFlags);
        }
        function getChildren(node) {
            const children = [];
            for (const edge of node.edges) {
                if (edge.source === node) {
                    children.push(edge.target);
                }
            }
            return children;
        }
        function getParents(node) {
            const parents = [];
            for (const edge of node.edges) {
                if (edge.target === node) {
                    parents.push(edge.source);
                }
            }
            return parents;
        }
        function buildGraphNode(flowNode, seen) {
            const id = getDebugFlowNodeId(flowNode);
            let graphNode = links[id];
            if (graphNode && seen.has(flowNode)) {
                graphNode.circular = true;
                graphNode = {
                    id: -1,
                    flowNode,
                    edges: [],
                    text: "",
                    lane: -1,
                    endLane: -1,
                    level: -1,
                    circular: "circularity"
                };
                nodes.push(graphNode);
                return graphNode;
            }
            seen.add(flowNode);
            if (!graphNode) {
                links[id] = graphNode = { id, flowNode, edges: [], text: "", lane: -1, endLane: -1, level: -1, circular: false };
                nodes.push(graphNode);
                if (hasAntecedents(flowNode)) {
                    for (const antecedent of flowNode.antecedents) {
                        buildGraphEdge(graphNode, antecedent, seen);
                    }
                }
                else if (hasAntecedent(flowNode)) {
                    buildGraphEdge(graphNode, flowNode.antecedent, seen);
                }
            }
            seen.delete(flowNode);
            return graphNode;
        }
        function buildGraphEdge(source, antecedent, seen) {
            const target = buildGraphNode(antecedent, seen);
            const edge = { source, target };
            edges.push(edge);
            source.edges.push(edge);
            target.edges.push(edge);
        }
        function computeLevel(node) {
            if (node.level !== -1) {
                return node.level;
            }
            let level = 0;
            for (const parent of getParents(node)) {
                level = Math.max(level, computeLevel(parent) + 1);
            }
            return node.level = level;
        }
        function computeHeight(node) {
            let height = 0;
            for (const child of getChildren(node)) {
                height = Math.max(height, computeHeight(child));
            }
            return height + 1;
        }
        function computeColumnWidths(height) {
            const columns = fill(Array(height), 0);
            for (const node of nodes) {
                columns[node.level] = Math.max(columns[node.level], node.text.length);
            }
            return columns;
        }
        function computeLanes(node, lane) {
            if (node.lane === -1) {
                node.lane = lane;
                node.endLane = lane;
                const children = getChildren(node);
                for (let i = 0; i < children.length; i++) {
                    if (i > 0)
                        lane++;
                    const child = children[i];
                    computeLanes(child, lane);
                    if (child.endLane > node.endLane) {
                        lane = child.endLane;
                    }
                }
                node.endLane = lane;
            }
        }
        function getHeader(flags) {
            if (flags & FlowFlags.Start)
                return "Start";
            if (flags & FlowFlags.BranchLabel)
                return "Branch";
            if (flags & FlowFlags.LoopLabel)
                return "Loop";
            if (flags & FlowFlags.Assignment)
                return "Assignment";
            if (flags & FlowFlags.TrueCondition)
                return "True";
            if (flags & FlowFlags.FalseCondition)
                return "False";
            if (flags & FlowFlags.SwitchClause)
                return "SwitchClause";
            if (flags & FlowFlags.ArrayMutation)
                return "ArrayMutation";
            if (flags & FlowFlags.Call)
                return "Call";
            if (flags & FlowFlags.ReduceLabel)
                return "ReduceLabel";
            if (flags & FlowFlags.Unreachable)
                return "Unreachable";
            throw new Error();
        }
        function getNodeText(node) {
            const sourceFile = getSourceFileOfNode(node);
            return getSourceTextOfNodeFromSourceFile(sourceFile, node, /*includeTrivia*/ false);
        }
        function renderFlowNode(flowNode, circular) {
            let text = getHeader(flowNode.flags);
            if (circular) {
                text = `${text}#${getDebugFlowNodeId(flowNode)}`;
            }
            if (hasNode(flowNode)) {
                if (flowNode.node) {
                    text += ` (${getNodeText(flowNode.node)})`;
                }
            }
            else if (isFlowSwitchClause(flowNode)) {
                const clauses = [];
                for (let i = flowNode.clauseStart; i < flowNode.clauseEnd; i++) {
                    const clause = flowNode.switchStatement.caseBlock.clauses[i];
                    if (isDefaultClause(clause)) {
                        clauses.push("default");
                    }
                    else {
                        clauses.push(getNodeText(clause.expression));
                    }
                }
                text += ` (${clauses.join(", ")})`;
            }
            return circular === "circularity" ? `Circular(${text})` : text;
        }
        function renderGraph() {
            const columnCount = columnWidths.length;
            const laneCount = nodes.reduce((x, n) => Math.max(x, n.lane), 0) + 1;
            const lanes = fill(Array(laneCount), "");
            const grid = columnWidths.map(() => Array(laneCount));
            const connectors = columnWidths.map(() => fill(Array(laneCount), 0));
            // build connectors
            for (const node of nodes) {
                grid[node.level][node.lane] = node;
                const children = getChildren(node);
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    let connector = 8 /* Right */;
                    if (child.lane === node.lane)
                        connector |= 4 /* Left */;
                    if (i > 0)
                        connector |= 1 /* Up */;
                    if (i < children.length - 1)
                        connector |= 2 /* Down */;
                    connectors[node.level][child.lane] |= connector;
                }
                if (children.length === 0) {
                    connectors[node.level][node.lane] |= 16 /* NoChildren */;
                }
                const parents = getParents(node);
                for (let i = 0; i < parents.length; i++) {
                    const parent = parents[i];
                    let connector = 4 /* Left */;
                    if (i > 0)
                        connector |= 1 /* Up */;
                    if (i < parents.length - 1)
                        connector |= 2 /* Down */;
                    connectors[node.level - 1][parent.lane] |= connector;
                }
            }
            // fill in missing connectors
            for (let column = 0; column < columnCount; column++) {
                for (let lane = 0; lane < laneCount; lane++) {
                    const left = column > 0 ? connectors[column - 1][lane] : 0;
                    const above = lane > 0 ? connectors[column][lane - 1] : 0;
                    let connector = connectors[column][lane];
                    if (!connector) {
                        if (left & 8 /* Right */)
                            connector |= 12 /* LeftRight */;
                        if (above & 2 /* Down */)
                            connector |= 3 /* UpDown */;
                        connectors[column][lane] = connector;
                    }
                }
            }
            for (let column = 0; column < columnCount; column++) {
                for (let lane = 0; lane < lanes.length; lane++) {
                    const connector = connectors[column][lane];
                    const fill = connector & 4 /* Left */ ? "\u2500" /* lr */ : " ";
                    const node = grid[column][lane];
                    if (!node) {
                        if (column < columnCount - 1) {
                            writeLane(lane, repeat(fill, columnWidths[column] + 1));
                        }
                    }
                    else {
                        writeLane(lane, node.text);
                        if (column < columnCount - 1) {
                            writeLane(lane, " ");
                            writeLane(lane, repeat(fill, columnWidths[column] - node.text.length));
                        }
                    }
                    writeLane(lane, getBoxCharacter(connector));
                    writeLane(lane, connector & 8 /* Right */ && column < columnCount - 1 && !grid[column + 1][lane] ? "\u2500" /* lr */ : " ");
                }
            }
            return `\n${lanes.join("\n")}\n`;
            function writeLane(lane, text) {
                lanes[lane] += text;
            }
        }
        function getBoxCharacter(connector) {
            switch (connector) {
                case 3 /* UpDown */: return "\u2502" /* ud */;
                case 12 /* LeftRight */: return "\u2500" /* lr */;
                case 5 /* UpLeft */: return "\u256F" /* ul */;
                case 9 /* UpRight */: return "\u2570" /* ur */;
                case 6 /* DownLeft */: return "\u256E" /* dl */;
                case 10 /* DownRight */: return "\u256D" /* dr */;
                case 7 /* UpDownLeft */: return "\u2524" /* udl */;
                case 11 /* UpDownRight */: return "\u251C" /* udr */;
                case 13 /* UpLeftRight */: return "\u2534" /* ulr */;
                case 14 /* DownLeftRight */: return "\u252C" /* dlr */;
                case 15 /* UpDownLeftRight */: return "\u256B" /* udlr */;
            }
            return " ";
        }
        function fill(array, value) {
            if (array.fill) {
                array.fill(value);
            }
            else {
                for (let i = 0; i < array.length; i++) {
                    array[i] = value;
                }
            }
            return array;
        }
        function repeat(ch, length) {
            if (ch.repeat) {
                return length > 0 ? ch.repeat(length) : "";
            }
            let s = "";
            while (s.length < length) {
                s += ch;
            }
            return s;
        }
    }
    Debug.formatControlFlowGraph = formatControlFlowGraph;
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Debug;
    }
})(Debug || (Debug = {}));
//# sourceMappingURL=compiler-debug.js.map