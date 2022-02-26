import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";

import { CriticalPathDataset, FiltersState } from "../types";

const GraphDataControllerCriticalPath: FC<{ dataset: CriticalPathDataset; filters: FiltersState }> = ({ dataset, filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return;

    let jobNodes: any = [];
    let jobs = dataset.vertex;
    jobs.forEach((job) => {
      if (jobNodes.indexOf(job.key) < 0 && dataset.edges.find((edge: any) => edge.inV === job.key || edge.outV === job.key)) {
        if(job.status === 'failed') {
          graph.addNode(job.key, {
            size: 8,
            label: job.label,
            color: "red",
            cluster: job.cluster,
            tag: job.tag,
            image: `${process.env.PUBLIC_URL}/images/concept.svg`
          });
        } else {
          if (dataset.edges.find((edge: any) => edge.outV === job.key)) {
            graph.addNode(job.key, {
              size: 5,
              label: job.label,
              color: "blue",
              cluster: job.cluster,
              tag: job.tag,
              image: `${process.env.PUBLIC_URL}/images/concept.svg`
            });
          } else {
            graph.addNode(job.key, {
              size: 5,
              label: job.label,
              color: "grey",
              cluster: job.cluster,
              tag: job.tag,
              image: `${process.env.PUBLIC_URL}/images/concept.svg`
            });
          }
        }
        jobNodes.push(job.key);
      }
    });

    dataset.edges.forEach((edge: any) => {
      graph.addEdge(edge.inV, edge.outV, {
        type: "arrow",
        label: "depends",
        size: 1,
        color: 'red'
      });
    });

    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
      const neigbors = graph.neighbors(node);
      graph.setNodeAttribute(node, "size", 5 + (neigbors.length * 0.1));
    });

    return () => graph.clear();
  }, [graph, dataset]);

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { clusters, tags } = filters;
    graph.forEachNode((node, { cluster, tag }) =>{
      graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataControllerCriticalPath;
