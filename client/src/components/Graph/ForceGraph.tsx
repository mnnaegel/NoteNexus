import React, { useRef, useEffect, useState, use } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";

type Node = {
  id: number;
  noteId: number;
}

type Link = {
  source: number;
  target: number;
};

class GraphNode implements SimulationNodeDatum {
  id: number;
  noteId: number;
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  constructor(id: number, noteId: number) {
    this.id = id;
    this.noteId = noteId;
  }
}

class GraphLinks implements d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode;
  target: GraphNode;
  index?: number;

  constructor(source: GraphNode, target: GraphNode) {
    this.source = source;
    this.target = target;
  }
}

export type GraphProps = {
  nodes: Node[];
  links: Link[];
};

const ForceGraph: React.FC<GraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(nodes.map(node => new GraphNode(node.id, node.noteId)));
  const [graphLinks, setGraphLinks] = useState<GraphLinks[]>(links.map(link => new GraphLinks(graphNodes.find(node => node.noteId == link.source)!, graphNodes.find(node => node.noteId == link.target)!)));

  useEffect(() => {
    setGraphNodes(nodes.map(node => new GraphNode(node.id, node.noteId)));
  }, [nodes]);

  useEffect(() => {
    setGraphLinks(links.map(link => new GraphLinks(graphNodes.find(node => node.noteId == link.source)!, graphNodes.find(node => node.noteId == link.target)!)));
  }, [links, graphNodes]);

  useEffect(() => {
    // SVG initialization
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear the SVG for rerendering
    
    // Define the force simulation
    const simulation = d3
      .forceSimulation(graphNodes)
      .force(
        "link",
        d3.forceLink(graphLinks).id((d: any) => {return d.id;})
      )
      .force("charge", d3.forceManyBody())
      .force(
        "center",
        d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
      );

    // Draw the links
    const linkElements = svg
      .selectAll("line")
      .data(graphLinks)
      .enter()
      .append("line")
      .style("stroke", "#000");

    // Draw the nodes
    const nodeElements = svg
      .selectAll("circle")
      .data(graphNodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .style("fill", "#69b3a2")

    // Update the nodes and links positions on each "tick"
    simulation.on("tick", () => {
      nodeElements
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
      linkElements
        .attr("x1", d => d.source.x!)
        .attr("y1", d => d.source.y!)
        .attr("x2", d => d.target.x!)
        .attr("y2", d => d.target.y!);
    });

    return () => {
      simulation.stop();
    };
  }, [graphNodes, graphLinks]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        border: "4px solid black",
      }}
    >
      <svg ref={svgRef} width={1400} height={800}></svg>
    </div>
  );
};

export default ForceGraph;
