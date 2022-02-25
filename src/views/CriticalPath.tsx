import React, { FC, useEffect, useState } from "react";
import { SigmaContainer, ZoomControl, FullScreenControl, ForceAtlasControl, ControlsContainer } from "react-sigma-v2";
import { omit, mapValues, keyBy, constant } from "lodash";
import GraphSettingsController from "./GraphSettingsController";
import GraphEventsController from "./GraphEventsController";
import GraphDataController from "./GraphDataController";
import DescriptionPanel from "./DescriptionPanel";
import { Cluster, Dataset, FiltersState, Tag } from "../types";
import ClustersPanel from "./ClustersPanel";
import SearchField from "./SearchField";
import drawLabel from "../canvas-utils";
import GraphTitle from "./GraphTitle";
import TagsPanel from "./TagsPanel";

import "react-sigma-v2/lib/react-sigma-v2.css";
import { GrClose } from "react-icons/gr";
import { BiRadioCircleMarked, BiBookContent } from "react-icons/bi";
import { BsArrowsFullscreen, BsFullscreenExit, BsZoomIn, BsZoomOut } from "react-icons/bs";
import GraphDataControllerCriticalPath from "./GraphDataControllerCriticalPath";
interface CriticalPathProps {
    activeNode: string;
    dataset: Dataset;
}
const CriticalPath: FC<CriticalPathProps> = (props: CriticalPathProps) => {
  const [showContents, setShowContents] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getTags = (data: Dataset) => {
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

  const getClusters = (data: Dataset) => {
    let jobs = data.jobs;
    let clusters: Cluster[] = [];
    let apps: string[] = [];
    for (let i = 0; i < jobs.length; i++) {
      if (apps.indexOf(jobs[i].app) < 0) {
        clusters.push({ key: jobs[i].app, clusterLabel: jobs[i].app, color: '' });
        apps.push(jobs[i].app);
      }
    }
    return clusters;
  }

  // Load data on mount:
  useEffect(() => {
    const { dataset } = props;
    console.log(dataset, props.activeNode);
    dataset.jobs = dataset.jobs.filter(({ node }) => node === props.activeNode);
    dataset.tags = getTags(dataset);
    dataset.clusters = getClusters(dataset);
    setDataset(dataset);
    console.log("***", mapValues(keyBy(dataset.clusters, "key"), constant(true)));
    setFiltersState({
        clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
        tags: mapValues(keyBy(dataset.tags, "key"), constant(true)),
    });
    requestAnimationFrame(() => setDataReady(true));
  }, [props.activeNode]);

  if (!dataset) return null;

  return (
    <div id="app-roots2" className={showContents ? "show-contents" : ""}>
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
        className="react-sigma"
        style={{ height: "500px", width: "1000px" }}
      >
        {/* <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} /> */}
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
              <ForceAtlasControl className="ico" autoRunFor={250} />
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
