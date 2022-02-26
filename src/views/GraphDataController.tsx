import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import { keyBy, omit } from "lodash";

import { Dataset, FiltersState } from "../types";
import { getNodeColor } from "../graph-utils";

const GraphDataController: FC<{ dataset: Dataset; filters: FiltersState }> = ({ dataset, filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return;

    let jobs = dataset.jobs;
    let edges = dataset.edge;
    let markerJobs = jobs.filter((job: any) => job.marker);
    let buckets = getBuckets(markerJobs);
    console.log("buckets", buckets);
    renderMarkerJobs(buckets);
    let nonMarkerJobs = jobs.filter((job: any) => !job.marker);
    showNonMarkerJobs(nonMarkerJobs);
    addEdges(graph, edges);



    setNodeSize();
    console.log("***completed***");

    return () => graph.clear();
  }, [graph, dataset]);

  function getBuckets(markerJobs: any[]) {
    let buckets: any = {};
    let bucketIndex = 1;
    for (let i = 0; i < markerJobs.length; i++) {
      const mkJob = markerJobs[i];
      if (Math.floor(mkJob.time) > bucketIndex) {
        bucketIndex++;
      }
      if (!buckets[bucketIndex]) {
        buckets[bucketIndex] = [];
      }
      buckets[bucketIndex].push(mkJob);
    }
    return buckets;
  }

  function renderMarkerJobs(buckets: any,) {
    for (const buckInd in buckets) {
      if (Object.prototype.hasOwnProperty.call(buckets, buckInd)) {
        const nodeList = buckets[buckInd];
        let isNeg = true;
        for (let nodeInd = 0; nodeInd < nodeList.length; nodeInd++) {
          const batchJob = nodeList[nodeInd];
          let xCo = parseInt(buckInd) * 50 + (nodeInd * 10);
          // let xCo = parseInt(buckInd) * 80 + ((batchJob.time - parseInt(buckInd)) * 80);
          let yCo = 0;
          if (nodeList.length > 0) {
            yCo = (nodeInd + 1) * 10;
            isNeg = !isNeg;
          } else {
            isNeg = false;
          }
          console.log("adding node", batchJob.name);
          graph.addNode(batchJob.name, {
            size: 5,
            label: batchJob.name,
            color: getNodeColor(batchJob.status),
            cluster: batchJob.status,
            tag: batchJob.app,
            x: xCo,
            y: isNeg ? (-yCo) : yCo
          });
        }
      }
    }
  }

  function showNonMarkerJobs(nonMarkerJobs: any[]) {
    for (let i = 0; i < nonMarkerJobs.length; i++) {
      const batchJob = nonMarkerJobs[i];
      const angle = (i * 3 * Math.PI) / graph.order;
      console.log("angle", angle);
      graph.addNode(batchJob.name, {
        size: 5,
        label: batchJob.name,
        color: getNodeColor(batchJob.status),
        cluster: batchJob.status,
        tag: batchJob.app,
        x: (10 * i) + 100 * Math.cos(angle),
        y: 60 + 100 * Math.sin(angle) 
      });
    }
  }

  function addEdges(graph: any, edges: any[]) {
    for (let i = 0; i < edges.length; i++) {
      let edgeObj: any = edges[i];
      console.log("edgeObj", edgeObj);
      graph.addEdge(edgeObj.inV, edgeObj.outV, {
        type: "arrow",
        label: "",
        size: 1
      });
    }
  }

  function setNodeSize() {
    graph.nodes().forEach((node, i) => {
      // graph.setNodeAttribute(node, "x", i);
      // graph.setNodeAttribute(node, "y", 70);
      const neigbors = graph.neighbors(node);
      const size = 8 + (neigbors.length * 1.2);
      graph.setNodeAttribute(node, "size", size);
      console.log("node size", node, size);
    });
  }

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    console.log("***", "running filter");
    const { clusters, tags } = filters;
    graph.forEachNode((node, { cluster, tag }) => {
      console.log("***", cluster, tag);
      graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataController;
