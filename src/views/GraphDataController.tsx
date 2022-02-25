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
      if (batchJob.marker) {
        graph.addNode(batchJob.name, {
          size: 5,
          label: batchJob.name,
          color: "#ed7047",
          cluster: '',
          tag: batchJob.app,
          x: i * 10,
          y: 0
          // image: `${process.env.PUBLIC_URL}/images/concept.svg`
        });
      } else {
        graph.addNode(batchJob.name, {
          size: 5,
          label: batchJob.name,
          color: "#ed7047",
          cluster: '',
          tag: batchJob.app,
          x: 0,
          y: i + 20
          // image: `${process.env.PUBLIC_URL}/images/concept.svg`
        });
      }

    }


    graph.nodes().forEach((node, i) => {
      // graph.setNodeAttribute(node, "x", i);
      // graph.setNodeAttribute(node, "y", 70);
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
      // graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataController;
