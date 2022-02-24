import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import { keyBy, omit } from "lodash";

import { Dataset, FiltersState } from "../types";

const GraphDataController: FC<{ dataset: Dataset; filters: FiltersState }> = ({ dataset, filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return;

    let jobNodes = [];
    let edgeList = [];
    let jobs = dataset.jobs;

    for (let i = 0; i < jobs.length; i++) {
      const batchJob = jobs[i];
      if (jobNodes.indexOf(batchJob.node) < 0) {
        graph.addNode(batchJob.node, {
          size: 5,
          label: batchJob.node,
          color: "#ed7047",
          cluster: batchJob.app,
          tag: batchJob.app
          // image: `${process.env.PUBLIC_URL}/images/concept.svg`
        });
        jobNodes.push(batchJob.node);
      }
      if (jobNodes.indexOf(batchJob.pred) < 0) {
        graph.addNode(batchJob.pred, {
          size: 5,
          label: batchJob.pred,
          cluster: batchJob.app,
          tag: batchJob.app
          // image: `${process.env.PUBLIC_URL}/images/person.svg`
        });
        jobNodes.push(batchJob.pred);
      }
      const edgeStr = batchJob.pred + "-" + batchJob.node;
      if (edgeList.indexOf(edgeStr) < 0) {
        graph.addEdge(batchJob.pred, batchJob.node, {
          type: "arrow",
          label: "",
          size: 1
        });
        edgeList.push(edgeStr);
      }
    }


    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
      const neigbors = graph.neighbors(node);
      graph.setNodeAttribute(node, "size", 5 + (neigbors.length * 0.1));
    });

    console.log("done");

    return () => graph.clear();
  }, [graph, dataset]);

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    console.log("***", "running filter");
    const { clusters, tags } = filters;
    graph.forEachNode((node, { cluster, tag }) =>{
      console.log("***", cluster, tag);
      graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataController;
