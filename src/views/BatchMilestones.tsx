import React from "react";
import { constant, keyBy, mapValues, omit } from "lodash";
import { useState, useEffect } from "react";
import { BiBookContent, BiRadioCircleMarked } from "react-icons/bi";
import { BsArrowsFullscreen, BsFullscreenExit, BsZoomIn, BsZoomOut } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { SigmaContainer, FullScreenControl, ZoomControl } from "react-sigma-v2";
import drawLabel from "../canvas-utils";
import { getNodeColor } from "../graph-utils";
import { Dataset, FiltersState, Tag, Cluster } from "../types";
import ClustersPanel from "./ClustersPanel";
import CriticalPath from "./CriticalPath";
import CriticalPathModal from "./CriticalPathModal";
import GraphDataController from "./GraphDataController";
import GraphEventsController from "./GraphEventsController";
import GraphSettingsController from "./GraphSettingsController";
import GraphTitle from "./GraphTitle";
import SearchField from "./SearchField";
import TagsPanel from "./TagsPanel";
import "react-sigma-v2/lib/react-sigma-v2.css";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";

export const BatchMilestones = () => {

    const [showContents, setShowContents] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [filtersState, setFiltersState] = useState<FiltersState>({
      clusters: {},
      tags: {},
    });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
    const [show, setShow] = useState(false);
    const [activeNode, setActiveNode] = useState('');
  
    const handleClose = () => setShow(false);
    const handleShow = (activeNode: string) => {
      setShow(true);
      setActiveNode(activeNode)
    }
  
    const getTags = (data: Dataset) => {
      const jobs = data.jobs;
      const tags: Tag[] = [];
      const apps: string[] = [];
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
      const jobs = data.jobs;
      const clusters: Cluster[] = [];
      const apps: string[] = [];
      for (let i = 0; i < jobs.length; i++) {
        if (apps.indexOf(jobs[i].status) < 0) {
          clusters.push({ key: jobs[i].status, clusterLabel: jobs[i].status, color: getNodeColor(jobs[i].status) });
          apps.push(jobs[i].status);
        }
      }
      return clusters;
    }
  
    const massageJobsData = (data: any) => {
      const jobs = [];
      for (let i = 0; i < data.vertex.length; i++) {
        const jobObj = data.vertex[i];
        const status = jobObj.properties?.status[0]?.value;
        const statusMap: any = {
          "FAILURE": "FAILED",
          "ABENDED": "COMPLETED WITH DELAY",
          "SUCCESS": "COMPLETED"
        };
        jobs.push(
          {
            "name": jobObj.id,
            "app": jobObj.properties?.app[0]?.value,
            "status": statusMap[status] || status ,
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
  
    // Load data on mount:
    useEffect(() => {
      fetch(`${process.env.PUBLIC_URL}/op1.json`)
        .then((res) => res.json())
        .then((dataset: Dataset) => {
          massageJobsData(dataset);
          setDataset(dataset);
          dataset.tags = getTags(dataset);
          dataset.clusters = getClusters(dataset);
          console.log("***", mapValues(keyBy(dataset.clusters, "key"), constant(true)));
          setFiltersState({
            clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
            tags: mapValues(keyBy(dataset.tags, "key"), constant(true)),
          });
          requestAnimationFrame(() => setDataReady(true));
        });
    }, []);
  
    if (!dataset) return null;

    return (
        <SigmaContainer
            graphOptions={{ type: "directed" }}
            initialSettings={{
              nodeProgramClasses: { image: getNodeProgramImage() },
              labelRenderer: drawLabel,
              defaultNodeType: "image",
              defaultEdgeType: "arrow",
              labelDensity: 0.07,
              labelGridCellSize: 60,
              labelRenderedSizeThreshold: 15,
              labelFont: "Lato, sans-serif",
              // zIndex: true
            }}
            className="react-sigma"
          >
            <GraphSettingsController hoveredNode={hoveredNode} />
            <GraphEventsController setHoveredNode={setHoveredNode} handleShow={handleShow} />
            <GraphDataController dataset={dataset} filters={filtersState} />

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
                  {/* <ForceAtlasControl className="ico" autoRunFor={2000} /> */}
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
                  <div className="panels">
                    <SearchField filters={filtersState} />
                    {/* <DescriptionPanel /> */}
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
                  </div>
                </div>
              </>
            )}
            <CriticalPathModal activeNode={activeNode} handleClose={handleClose} show={show}>
              <CriticalPath activeNode={activeNode} />
            </CriticalPathModal>
          </SigmaContainer>
    )
}