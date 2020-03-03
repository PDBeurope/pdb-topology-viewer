declare class PdbTopologyViewerPlugin {
    defaultColours: {
        domainSelection: string;
        mouseOver: string;
        borderColor: string;
        qualityGreen: string;
        qualityRed: string;
        qualityYellow: string;
        qualityOrange: string;
    };
    sequenceArr: string[];
    entityId: string;
    entryId: string;
    chainId: string;
    apiData: any;
    targetEle: HTMLElement;
    pdbevents: any;
    xScale: any;
    yScale: any;
    zoom: any;
    scaledPointsArr: any[];
    domainTypes: any[];
    svgWidth: number;
    svgHeight: number;
    svgEle: any;
    render(target: HTMLElement, entityId: string, entryId: string, chainId: string): void;
    createNewEvent: (eventTypeArr: string[]) => any;
    getApiData(pdbId: string, chainId: string): Promise<any[]>;
    getPDBSequenceArray(entities: any[]): void;
    chunkArray(arr: any[], len: number): any[][];
    getDomainRange(): void;
    drawStrandSubpaths(startResidueNumber: number, stopResidueNumber: number, index: number): void;
    drawStrandMaskShape(index: number): void;
    renderTooltip(elementData: any, action: string): void;
    dispatchEvent(eventType: any, eventData: any, eventElement?: HTMLElement): void;
    clickAction(eleObj: any): void;
    mouseoverAction(eleObj: any | this, eleData: any): void;
    mouseoutAction(eleObj: any, eleData: any): void;
    drawHelicesSubpaths(startResidueNumber: number, stopResidueNumber: number, index: number, curveYdiff: number): void;
    drawHelicesMaskShape(index: number): void;
    drawCoilsSubpaths(startResidueNumber: number, stopResidueNumber: number, index: number): void;
    drawTopologyStructures(): void;
    zoomDraw(): void;
    drawValidationShape(residueNumber: number, shape: string, rgbColor: string): void;
    getAnnotationFromMappings: () => void;
    getChainStartAndEnd(): {
        start: number;
        end: number;
    } | undefined;
    getAnnotationFromOutliers(): void;
    createDomainDropdown: () => void;
    clearHighlight(): void;
    changeResidueColor(residueNumber: number, rgbColor: string, tooltipContent: string, tooltipPosition: string): void;
    highlightResidues(residueDetails: any): void;
    highlightDomain(invokedFrom?: string): void;
    resetDisplay(): void;
}
