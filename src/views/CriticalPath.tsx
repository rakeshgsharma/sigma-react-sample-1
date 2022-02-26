import { FC, useEffect, useState } from "react";
import { SigmaContainer, ZoomControl, FullScreenControl, ForceAtlasControl } from "react-sigma-v2";
import { mapValues, keyBy, constant } from "lodash";
import { Cluster, CriticalPathDataset, FiltersState, Tag } from "../types";
import drawLabel from "../canvas-utils";
import GraphTitle from "./GraphTitle";

import "react-sigma-v2/lib/react-sigma-v2.css";
import { GrClose } from "react-icons/gr";
import { BiRadioCircleMarked, BiBookContent } from "react-icons/bi";
import { BsArrowsFullscreen, BsFullscreenExit, BsZoomIn, BsZoomOut } from "react-icons/bs";
import GraphDataControllerCriticalPath from "./GraphDataControllerCriticalPath";
import GraphEventsControllerCriticalPath from "./GraphEventsControllerCriticalPath";
import { getNodeColor } from "../graph-utils";
import GraphSettingsController from "./GraphSettingsController";
interface CriticalPathProps {
    activeNode: string;
}
const CriticalPath: FC<CriticalPathProps> = (props: CriticalPathProps) => {
  const [showContents, setShowContents] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<CriticalPathDataset | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getTags = (data: CriticalPathDataset) => {
    let jobs = data.jobs;
    let tags: Tag[] = [];
    let apps: string[] = [];
    for (let i = 0; i < jobs.length; i++) {
      jobs[i].cluster = jobs[i].app;
      jobs[i].tag = jobs[i].app;
      if (apps.indexOf(jobs[i].app) < 0) {
        tags.push({ key: jobs[i].app, image: '' });
        apps.push(jobs[i].app);
      }
    }
    return tags;
  }

  const getClusters = (data: CriticalPathDataset) => {
    let jobs = data.jobs;
    let clusters: Cluster[] = [];
    let apps: string[] = [];
    for (let i = 0; i < jobs.length; i++) {
      if (apps.indexOf(jobs[i].status) < 0) {
        clusters.push({ key: jobs[i].status, clusterLabel: jobs[i].status, color: getNodeColor(jobs[i].status) });
        apps.push(jobs[i].status);
      }
    }
    return clusters;
  }

  const massageJobsData = (data: any) => {
    let jobs = [];
    for (let i = 0; i < data.vertex.length; i++) {
      const jobObj = data.vertex[i];
      jobs.push(
        {
          "name": jobObj.id,
          "app": jobObj.properties?.app[0]?.value,
          "status": jobObj.properties?.status[0]?.value,
          "marker": (jobObj.properties?.marker[0]?.value === "Y"),
          "time": (i+1),
          "avgTime": jobObj.properties?.avgTime[0]?.value,
          "description": jobObj.properties?.description[0]?.value
        }
      );
    }

    data.jobs = jobs;
    console.log("jobs", jobs);
    // data.edge = data.edge[0];
  }

  const filterData = (data: CriticalPathDataset) => {
    const requiredNodes: string[] = [];
    data.edge = data.edge.filter(({ inV, outV }: { inV: string, outV: string }) => {
      const exists = inV === props.activeNode || outV === props.activeNode;
      if(exists) {
        requiredNodes.push(inV);
        requiredNodes.push(outV);
      }
      return exists;
    });
    data.vertex = data.vertex.filter(({ id }) => requiredNodes.find(n => n === id));
  }

  // Load data on mount:
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/sample-data.json`)
      .then((res) => res.json())
      .then((dataset: CriticalPathDataset) => {
          filterData(dataset);
          massageJobsData(dataset);
          dataset.tags = getTags(dataset);
          dataset.clusters = getClusters(dataset);
          setDataset(dataset);
          setFiltersState({
              clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
              tags: mapValues(keyBy(dataset.tags, "key"), constant(true)),
          });
          requestAnimationFrame(() => setDataReady(true));
        });
  }, [props.activeNode]);

  if (!dataset) return null;

  return (
    <div id="app-root2" className={showContents ? "show-contents" : ""}>
      <SigmaContainer
        graphOptions={{ type: "directed" }}
        initialSettings={{
          // nodeProgramClasses: { circle: getNodeCir() },
          labelRenderer: drawLabel,
          defaultNodeType: "circle",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true
        }}
        // className="react-sigma"
        style={{ height: "700px", width: "1000px" }}
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsControllerCriticalPath setHoveredNode={setHoveredNode} />
        <GraphDataControllerCriticalPath dataset={dataset} filters={filtersState} />

        {dataReady && (
          <>
            <div className="controls">
              <div className="ico">
                <button
                  type="button"
                  className="show-contents"
                  onClick={() => setShowContents(true)}
                  title="Show caption and description"
                >
                  <BiBookContent />
                </button>
              </div>

              <div className="ico">

              </div>
              <FullScreenControl
                className="ico"
                customEnterFullScreen={<BsArrowsFullscreen />}
                customExitFullScreen={<BsFullscreenExit />}
              />
              <ZoomControl
                className="ico"
                customZoomIn={<BsZoomIn />}
                customZoomOut={<BsZoomOut />}
                customZoomCenter={<BiRadioCircleMarked />}
              />
              {/* <ControlsContainer> */}
              {/* <ForceAtlasControl className="ico" autoRunFor={400} /> */}
              {/* </ControlsContainer> */}
            </div>
            <div className="contents">  
              <div className="ico">
                <button
                  type="button"
                  className="ico hide-contents"
                  onClick={() => setShowContents(false)}
                  title="Show caption and description"
                >
                  <GrClose />
                </button>
              </div>
              <GraphTitle filters={filtersState} />
              {/* <div className="panels">
                <SearchField filters={filtersState} />
                <DescriptionPanel />
                <ClustersPanel
                  clusters={dataset.clusters}
                  filters={filtersState}
                  setClusters={(clusters) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters,
                    }))
                  }
                  toggleCluster={(cluster) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      clusters: filters.clusters[cluster]
                        ? omit(filters.clusters, cluster)
                        : { ...filters.clusters, [cluster]: true },
                    }));
                  }}
                />
                <TagsPanel
                  tags={dataset.tags}
                  filters={filtersState}
                  setTags={(tags) =>
                    setFiltersState((filters) => ({
                      ...filters,
                      tags,
                    }))
                  }
                  toggleTag={(tag) => {
                    setFiltersState((filters) => ({
                      ...filters,
                      tags: filters.tags[tag] ? omit(filters.tags, tag) : { ...filters.tags, [tag]: true },
                    }));
                  }}
                />
              </div> */}
            </div>
          </>
        )}
      </SigmaContainer>
    </div>
  );
};

export default CriticalPath;
