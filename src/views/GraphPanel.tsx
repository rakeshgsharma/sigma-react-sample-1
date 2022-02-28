import React from 'react';

import { ShortestPath } from './ShortestPath';
import { BatchMilestones } from './BatchMilestones';

interface GraphPanelProps {
  currentPanel: string;
}

export const GraphPanel = (props: GraphPanelProps) => {

  switch (props.currentPanel) {
    case 'Batch Milestones':
        return <BatchMilestones />
    case 'Shortest Path':
      return <ShortestPath/>
    default:
      return <BatchMilestones />
  }
}