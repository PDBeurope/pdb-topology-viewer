class PdbTopologyViewer extends HTMLElement {

  static get observedAttributes() {
    return ['pdb-id', 'entity-id', 'chain-id', 'display-style', 'error-style'];
  }

  constructor() {
    super();
  }

  validateParams() {
    if(typeof this.pdbId == 'undefined' || typeof this.entityId == 'undefined') return false;
    if(this.pdbId == null || this.entityId == null) return false;
    return true
  }

  invokePlugin(){
    let paramValidatity = this.validateParams();
    if(!paramValidatity) return

    // create an instance of the plugin
    if(typeof this.viewInstance == 'undefined') this.viewInstance = new PdbTopologyViewerPlugin();
    this.viewInstance.render(this, this.entityId, this.pdbId, this.chainId, this.displayStyle, this.errorStyle);
  }

  attributeChangedCallback() {
    this.pdbId = this.getAttribute("pdb-id");
    this.entityId = this.getAttribute("entity-id");
    this.chainId = this.getAttribute("chain-id");
    this.displayStyle = this.getAttribute("display-style");
    this.errorStyle = this.getAttribute("error-style");
    this.invokePlugin();
  }

}

export default PdbTopologyViewer;

customElements.define('pdb-topology-viewer', PdbTopologyViewer);