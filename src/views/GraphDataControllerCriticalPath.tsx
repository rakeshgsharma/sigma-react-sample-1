import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";

import { CriticalPathDataset, FiltersState } from "../types";
import { getNodeColor } from "../graph-utils";

const GraphDataControllerCriticalPath: FC<{ dataset: CriticalPathDataset; filters: FiltersState, activeNode: string }> = ({ dataset, filters, children, activeNode }) => {
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
    renderMarkerJobs(buckets);
    let nonMarkerJobs = jobs.filter((job: any) => !job.marker);
    showNonMarkerJobs(nonMarkerJobs);
    addEdges(graph, edges);
    setNodeSize();
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
      graph.addEdge(edgeObj.inV, edgeObj.outV, {
        type: "arrow",
        label: "",
        size: 10
      });
    }
  }

  function setNodeSize() {
    // graph.nodes().forEach((node, i) => {
    //   // graph.setNodeAttribute(node, "x", i);
    //   // graph.setNodeAttribute(node, "y", 70);
    //   const neigbors = graph.neighbors(node);
    //   const size = 8 + (neigbors.length * 1.2);
    //   graph.setNodeAttribute(node, "size", size);
    // });
    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
      const neigbors = graph.neighbors(node);
      graph.setNodeAttribute(node, "size", 5 + (neigbors.length * 5));
    });
  }

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { clusters, tags } = filters;
    graph.forEachNode((node, { cluster, tag }) => {
      graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataControllerCriticalPath;
